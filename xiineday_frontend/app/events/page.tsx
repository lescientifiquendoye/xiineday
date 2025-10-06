'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, MapPin, Clock, ThumbsUp, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle2, MessageSquare, Download, ChartBar as BarChart3 } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { getWeather, getEventTypes, analyzeEventSchedule, getAllLocations, WeatherData, EventType } from '@/lib/api';
import { createEvent, UserEvent, getEvents } from '@/lib/supabase';
import { useAppStore } from '@/lib/store';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function EventsPage() {
  const { selectedLocation, setSelectedLocation } = useAppStore();
  const [locations, setLocations] = useState<string[]>([]);
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [selectedEventType, setSelectedEventType] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [analysis, setAnalysis] = useState<Array<{ date: string; score: number; reasons: string[] }>>([]);
  const [selectedSlotForCreation, setSelectedSlotForCreation] = useState<{ date: string; score: number } | null>(null);
  const [userEvents, setUserEvents] = useState<UserEvent[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; message: string }>>([
    {
      role: 'assistant',
      message: 'Bonjour ! Je peux vous aider à trouver le meilleur moment pour votre événement. Posez-moi une question sur la météo.',
    },
  ]);

  useEffect(() => {
    const loadData = async () => {
      const locs = await getAllLocations();
      const types = await getEventTypes();
      setLocations(locs);
      setEventTypes(types);
      if (types.length > 0) {
        setSelectedEventType(types[0].type);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadWeather = async () => {
      const data = await getWeather(selectedLocation);
      setWeather(data || null);
    };
    loadWeather();
  }, [selectedLocation]);

  const loadUserEvents = async () => {
    try {
      const events = await getEvents(selectedLocation);
      setUserEvents(events);
    } catch (error) {
      console.error('Error loading user events:', error);
    }
  };

  useEffect(() => {
    loadUserEvents();
  }, [selectedLocation]);

  const handleAnalyze = () => {
    if (weather && selectedEventType) {
      const eventType = eventTypes.find((e) => e.type === selectedEventType);
      if (eventType) {
        const results = analyzeEventSchedule(weather, eventType);
        setAnalysis(results);
      }
    }
  };

  const handleCreateEvent = async (dateToUse?: string, scoreToUse?: number) => {
    const finalDate = dateToUse || (selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '');
    const finalScore = scoreToUse !== undefined ? scoreToUse : undefined;

    if (!eventTitle.trim()) {
      toast.error('Veuillez entrer un titre pour l\'événement');
      return;
    }

    if (!selectedEventType) {
      toast.error('Veuillez sélectionner un type d\'événement');
      return;
    }

    if (!finalDate) {
      toast.error('Veuillez choisir une date');
      return;
    }

    try {
      const newEvent: Omit<UserEvent, 'id' | 'created_at' | 'updated_at'> = {
        title: eventTitle,
        event_type: selectedEventType,
        location: selectedLocation,
        event_date: finalDate,
        description: eventDescription,
        weather_score: finalScore,
      };

      await createEvent(newEvent);
      toast.success('Événement créé avec succès!');

      setEventTitle('');
      setEventDescription('');
      setSelectedDate(undefined);
      setSelectedSlotForCreation(null);

      await loadUserEvents();
    } catch (error) {
      toast.error('Erreur lors de la création de l\'événement');
      console.error(error);
    }
  };

  const downloadEventWithWeather = async (event: UserEvent) => {
    try {
      const weatherData = await getWeather(event.location);
      const eventDate = parseISO(event.event_date);
      const eventDateStr = format(eventDate, 'yyyy-MM-dd');

      const forecastForDate = weatherData?.forecast.find(f => f.date === eventDateStr);

      const eventData = {
        event: {
          id: event.id,
          title: event.title,
          type: event.event_type,
          location: event.location,
          date: format(eventDate, 'PPP', { locale: fr }),
          description: event.description || 'Aucune description',
          weather_score: event.weather_score,
          created_at: format(parseISO(event.created_at!), 'PPPp', { locale: fr }),
        },
        weather: forecastForDate ? {
          date: eventDateStr,
          day: forecastForDate.day,
          condition: forecastForDate.condition,
          temperature: {
            min: forecastForDate.tempMin,
            max: forecastForDate.tempMax,
          },
          precipitation: forecastForDate.precipitation,
          humidity: forecastForDate.humidity,
          windSpeed: forecastForDate.windSpeed,
        } : weatherData?.current,
        location_details: weatherData ? {
          city: weatherData.city,
          country: weatherData.country,
          coordinates: weatherData.coordinates,
        } : null,
        export_date: format(new Date(), 'PPPp', { locale: fr }),
      };

      const dataStr = JSON.stringify(eventData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `evenement-${event.title.replace(/\s+/g, '-')}-${eventDateStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Événement téléchargé avec succès!');
    } catch (error) {
      toast.error('Erreur lors du téléchargement');
      console.error(error);
    }
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setChatMessages((prev) => [...prev, { role: 'user', message: chatInput }]);

    setTimeout(() => {
      let response = '';
      const input = chatInput.toLowerCase();

      if (input.includes('ensoleillé') || input.includes('soleil')) {
        const sunnyDays = weather?.forecast.filter((d) => d.condition === 'Ensoleillé') || [];
        if (sunnyDays.length > 0) {
          response = `Les jours les plus ensoleillés sont : ${sunnyDays.map((d) => d.day).join(', ')}. Parfait pour un événement en extérieur !`;
        } else {
          response = 'Il n\'y a pas de journée complètement ensoleillée dans les prévisions.';
        }
      } else if (input.includes('pluie') || input.includes('pluvieux')) {
        const rainyDays = weather?.forecast.filter((d) => d.precipitation > 50) || [];
        if (rainyDays.length > 0) {
          response = `Attention, risque de pluie élevé ces jours : ${rainyDays.map((d) => d.day).join(', ')}. Je vous recommande d\'éviter ces dates.`;
        } else {
          response = 'Bonne nouvelle ! Aucun jour avec un fort risque de pluie dans les prévisions.';
        }
      } else if (input.includes('meilleur') || input.includes('recommand')) {
        if (analysis.length > 0) {
          const best = analysis.reduce((prev, current) => (current.score > prev.score ? current : prev));
          const day = weather?.forecast.find((d) => d.date === best.date);
          response = `Je recommande ${day?.day} (${best.date}) avec un score de ${best.score}/100. ${best.reasons.join(', ')}.`;
        } else {
          response = 'Veuillez d\'abord analyser un événement pour obtenir des recommandations.';
        }
      } else {
        response = `D'après les prévisions pour ${selectedLocation}, la météo semble ${weather?.current.condition.toLowerCase()}. Pour plus de détails, consultez l'onglet Recommandations.`;
      }

      setChatMessages((prev) => [...prev, { role: 'assistant', message: response }]);
    }, 500);

    setChatInput('');
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    if (score >= 60) return <ThumbsUp className="h-5 w-5 text-yellow-600" />;
    return <AlertTriangle className="h-5 w-5 text-red-600" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Planifier un événement
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Trouvez le meilleur créneau pour votre événement en fonction des conditions météo.
            </p>
          </div>

          <Tabs defaultValue="plan" className="space-y-6">
            <TabsList className="grid w-full max-w-2xl grid-cols-3">
              <TabsTrigger value="plan">Recommandations</TabsTrigger>
              <TabsTrigger value="events">Mes Événements</TabsTrigger>
              <TabsTrigger value="chat">Chat IA</TabsTrigger>
            </TabsList>

            <TabsContent value="plan" className="space-y-6">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Détails de l'événement</CardTitle>
                  <CardDescription>
                    Configurez votre événement pour obtenir des recommandations personnalisées
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="event-type">Type d'événement</Label>
                      <Select value={selectedEventType} onValueChange={setSelectedEventType}>
                        <SelectTrigger id="event-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {eventTypes.map((type) => (
                            <SelectItem key={type.id} value={type.type}>
                              <div className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4" />
                                {type.type}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Lieu</Label>
                      <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                        <SelectTrigger id="location">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((location) => (
                            <SelectItem key={location} value={location}>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                {location}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="event-title">Titre de l'événement</Label>
                    <Input
                      id="event-title"
                      placeholder="Ex: Semis de blé parcelle A"
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="event-description">Description (optionnel)</Label>
                    <Input
                      id="event-description"
                      placeholder="Notes ou détails supplémentaires"
                      value={eventDescription}
                      onChange={(e) => setEventDescription(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Date souhaitée (optionnel)</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, 'PPP', { locale: fr }) : "Choisir une date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          initialFocus
                          locale={fr}
                        />
                      </PopoverContent>
                    </Popover>
                    {selectedDate && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Date sélectionnée : {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
                      </p>
                    )}
                  </div>

                  {selectedEventType && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h4 className="font-semibold mb-2">Conditions idéales</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {eventTypes.find((e) => e.type === selectedEventType)?.idealConditions.description}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      onClick={handleAnalyze}
                      variant="outline"
                      className="flex-1"
                    >
                      Analyser les créneaux
                    </Button>
                    <Button
                      onClick={() => handleCreateEvent()}
                      className="flex-1 bg-gradient-to-r from-green-500 to-blue-500"
                      disabled={!eventTitle || !selectedEventType || !selectedDate}
                    >
                      Créer l'événement
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {analysis.length > 0 && (
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle>Meilleurs créneaux</CardTitle>
                    <CardDescription>
                      Classement des jours selon les conditions météo pour votre événement
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {analysis
                      .sort((a, b) => b.score - a.score)
                      .map((result, index) => {
                        const day = weather?.forecast.find((d) => d.date === result.date);
                        return (
                          <motion.div
                            key={result.date}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="p-4 rounded-lg border-2 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                {getScoreIcon(result.score)}
                                <div>
                                  <p className="font-semibold">{day?.day}</p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">{result.date}</p>
                                </div>
                              </div>
                              <div className={`text-2xl font-bold ${getScoreColor(result.score)}`}>
                                {result.score}
                                <span className="text-sm">/100</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                              {result.reasons.map((reason, i) => (
                                <Badge key={i} variant="secondary">
                                  {reason}
                                </Badge>
                              ))}
                            </div>
                            {day && (
                              <>
                                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t text-sm">
                                  <div>
                                    <span className="text-gray-600 dark:text-gray-400">Temp: </span>
                                    <span className="font-semibold">{day.tempMax}°C</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600 dark:text-gray-400">Pluie: </span>
                                    <span className="font-semibold">{day.precipitation}%</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600 dark:text-gray-400">Vent: </span>
                                    <span className="font-semibold">{day.windSpeed} km/h</span>
                                  </div>
                                </div>
                                <Button
                                  onClick={() => handleCreateEvent(result.date, result.score)}
                                  size="sm"
                                  className="w-full mt-3 bg-gradient-to-r from-green-500 to-blue-500"
                                  disabled={!eventTitle}
                                >
                                  Créer événement pour ce créneau
                                </Button>
                              </>
                            )}
                          </motion.div>
                        );
                      })}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="events" className="space-y-6">
              {userEvents.length > 0 && (
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Statistiques des événements
                    </CardTitle>
                    <CardDescription>
                      Répartition des événements par type et scores météo
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-semibold mb-4">Événements par type</h4>
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart
                            data={Object.entries(
                              userEvents.reduce((acc, event) => {
                                acc[event.event_type] = (acc[event.event_type] || 0) + 1;
                                return acc;
                              }, {} as Record<string, number>)
                            ).map(([type, count]) => ({ type, count }))}
                          >
                            <XAxis dataKey="type" tick={{ fontSize: 12 }} />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#22c55e" radius={[8, 8, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-4">Distribution des scores météo</h4>
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart
                            data={userEvents
                              .filter((e) => e.weather_score)
                              .map((e) => ({
                                date: format(parseISO(e.event_date), 'dd/MM'),
                                score: e.weather_score,
                              }))}
                          >
                            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                              {userEvents
                                .filter((e) => e.weather_score)
                                .map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={
                                      entry.weather_score! >= 80
                                        ? '#22c55e'
                                        : entry.weather_score! >= 60
                                        ? '#eab308'
                                        : '#ef4444'
                                    }
                                  />
                                ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Mes événements créés</CardTitle>
                  <CardDescription>
                    Liste de tous vos événements avec leurs données météo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {userEvents.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Aucun événement créé pour le moment
                      </p>
                      <p className="text-sm text-gray-400">
                        Créez votre premier événement dans l'onglet Recommandations
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {userEvents.map((event) => (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-lg border-2 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
                              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-1">
                                  <CalendarIcon className="h-4 w-4" />
                                  {format(parseISO(event.event_date), 'PPP', { locale: fr })}
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {event.location}
                                </div>
                              </div>
                            </div>
                            <Button
                              onClick={() => downloadEventWithWeather(event)}
                              size="sm"
                              variant="outline"
                              className="gap-2"
                            >
                              <Download className="h-4 w-4" />
                              Télécharger
                            </Button>
                          </div>

                          {event.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              {event.description}
                            </p>
                          )}

                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {event.event_type}
                            </Badge>
                            {event.weather_score && (
                              <Badge
                                className={cn(
                                  "text-xs",
                                  event.weather_score >= 80 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" :
                                  event.weather_score >= 60 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300" :
                                  "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                                )}
                              >
                                Score météo: {event.weather_score}/100
                              </Badge>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chat">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Assistant météo
                  </CardTitle>
                  <CardDescription>
                    Posez des questions sur les meilleures dates pour votre événement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-4 h-[400px] overflow-y-auto">
                    {chatMessages.map((msg, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            msg.role === 'user'
                              ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                          }`}
                        >
                          {msg.message}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <form onSubmit={handleChatSubmit} className="flex gap-2">
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Quel jour est le plus ensoleillé ?"
                      className="flex-1"
                    />
                    <Button type="submit" className="bg-gradient-to-r from-green-500 to-blue-500">
                      Envoyer
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
