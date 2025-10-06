'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { MapPin, Wind, Droplets, Gauge, Sun as SunIcon, Map, Globe, Navigation, Download, Calendar as CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WeatherIcon } from '@/components/ui-custom/WeatherIcon';
import { ClimateCalendar } from '@/components/ClimateCalendar';
import { LocationPicker } from '@/components/LocationPicker';
import { getWeather, getAllLocations, WeatherData } from '@/lib/api';
import { useAppStore } from '@/lib/store';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function WeatherPage() {
  const { selectedLocation, setSelectedLocation } = useAppStore();
  const [locations, setLocations] = useState<string[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [customLocations, setCustomLocations] = useState<Array<{ name: string; lat: number; lon: number }>>([]);

  useEffect(() => {
    const loadLocations = async () => {
      const locs = await getAllLocations();
      setLocations(locs);
    };
    loadLocations();
  }, []);

  useEffect(() => {
    const loadWeather = async () => {
      setLoading(true);
      const data = await getWeather(selectedLocation);
      setWeather(data || null);
      setLoading(false);
    };
    loadWeather();
  }, [selectedLocation]);

  const handleLocationChange = (value: string) => {
    setSelectedLocation(value);
  };

  const handleCustomLocationAdd = async (location: { lat: number; lon: number; name: string }) => {
    setCustomLocations([...customLocations, location]);

    const mockWeatherData: WeatherData = {
      id: Date.now(),
      city: location.name,
      country: 'Position personnalisée',
      coordinates: { lat: location.lat, lon: location.lon },
      current: {
        temp: 25,
        feelsLike: 27,
        humidity: 65,
        windSpeed: 15,
        windDirection: 'N',
        pressure: 1013,
        precipitation: 10,
        condition: 'Partiellement nuageux',
        icon: 'partly-cloudy',
        uvIndex: 6,
      },
      forecast: Array.from({ length: 5 }, (_, i) => ({
        date: format(new Date(Date.now() + i * 86400000), 'yyyy-MM-dd'),
        day: format(new Date(Date.now() + i * 86400000), 'EEEE', { locale: fr }),
        tempMin: 18 + Math.random() * 5,
        tempMax: 28 + Math.random() * 5,
        condition: 'Ensoleillé',
        icon: 'sun',
        precipitation: Math.floor(Math.random() * 30),
        humidity: 60 + Math.floor(Math.random() * 20),
        windSpeed: 10 + Math.floor(Math.random() * 15),
      })),
    };

    setWeather(mockWeatherData);
    setSelectedLocation(location.name);
  };

  const downloadWeatherData = () => {
    if (!weather) return;

    const weatherData = {
      location: {
        city: weather.city,
        country: weather.country,
        coordinates: weather.coordinates,
      },
      current: weather.current,
      forecast: weather.forecast,
      exportDate: format(new Date(), 'PPPp', { locale: fr }),
    };

    const dataStr = JSON.stringify(weatherData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `meteo-${weather.city}-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" />
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Données météo non disponibles</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Météo et Calendrier Climatique
            </h1>
            <div className="flex flex-wrap items-center gap-4">
              <Select value={selectedLocation} onValueChange={handleLocationChange}>
                <SelectTrigger className="w-[250px]">
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
                  {customLocations.length > 0 && (
                    <>
                      <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 border-t mt-1 pt-2">
                        Positions personnalisées
                      </div>
                      {customLocations.map((loc) => (
                        <SelectItem key={loc.name} value={loc.name}>
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-green-600" />
                            {loc.name}
                          </div>
                        </SelectItem>
                      ))}
                    </>
                  )}
                </SelectContent>
              </Select>

              <LocationPicker onLocationSelect={handleCustomLocationAdd} />

              <Button
                onClick={downloadWeatherData}
                variant="outline"
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Télécharger les données
              </Button>

              <Link href="/weather/enhanced">
                <Button className="bg-gradient-to-r from-green-500 to-blue-500">
                  <Map className="h-4 w-4 mr-2" />
                  Vue Interactive
                </Button>
              </Link>
            </div>
          </div>

          <Tabs defaultValue="weather" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="weather">Météo Actuelle</TabsTrigger>
              <TabsTrigger value="calendar">Calendrier Climatique</TabsTrigger>
            </TabsList>

            <TabsContent value="weather" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2"
            >
              <Card className="border-2 bg-gradient-to-br from-blue-500 to-green-500 text-white h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                      <CardTitle className="text-2xl text-white">{weather.city}</CardTitle>
                      <p className="text-blue-100">{weather.country}</p>
                    </motion.div>
                    <motion.div
                      initial={{ rotate: -180, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
                    >
                      <WeatherIcon icon={weather.current.icon} className="h-16 w-16" />
                    </motion.div>
                  </div>
                </CardHeader>
                <CardContent>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="flex items-baseline gap-2 mb-4"
                  >
                    <span className="text-6xl font-bold">{weather.current.temp}°</span>
                    <span className="text-2xl text-blue-100">
                      Ressenti {weather.current.feelsLike}°
                    </span>
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="text-xl mb-6 text-blue-100"
                  >
                    {weather.current.condition}
                  </motion.p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { icon: Wind, label: 'Vent', value: `${weather.current.windSpeed} km/h` },
                      { icon: Droplets, label: 'Humidité', value: `${weather.current.humidity}%` },
                      { icon: Gauge, label: 'Pression', value: `${weather.current.pressure} hPa` },
                      { icon: SunIcon, label: 'UV Index', value: weather.current.uvIndex },
                    ].map((item, index) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                        className="flex flex-col"
                      >
                        <div className="flex items-center gap-2 text-blue-100">
                          <item.icon className="h-4 w-4" />
                          <span className="text-sm">{item.label}</span>
                        </div>
                        <span className="text-lg font-semibold">{item.value}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Card className="border-2 h-full">
              <CardHeader>
                <CardTitle className="text-lg">Détails supplémentaires</CardTitle>
              </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: 'Direction du vent', value: weather.current.windDirection },
                    { label: 'Précipitations', value: `${weather.current.precipitation}%` },
                    { label: 'Température ressentie', value: `${weather.current.feelsLike}°C` },
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                      className="flex items-center justify-between"
                    >
                      <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                      <span className="font-semibold">{item.value}</span>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Card className="border-2 mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-green-600" />
                  Informations géographiques
                </CardTitle>
              </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7, duration: 0.4 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20"
                    >
                      <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold mb-1">Localisation</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{weather.city}, {weather.country}</p>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8, duration: 0.4 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20"
                    >
                      <Navigation className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold mb-1">Coordonnées GPS</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Latitude: {weather.coordinates.lat.toFixed(4)}°
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Longitude: {weather.coordinates.lon.toFixed(4)}°
                        </p>
                      </div>
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                    className="bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-lg p-4 border-2 border-green-200 dark:border-green-800"
                  >
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Map className="h-4 w-4" />
                    Carte de localisation
                  </h4>
                  <div className="aspect-video bg-white dark:bg-gray-800 rounded-lg overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="h-12 w-12 text-green-600 mx-auto mb-2" />
                        <p className="text-sm font-semibold">{weather.city}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {weather.coordinates.lat.toFixed(2)}°, {weather.coordinates.lon.toFixed(2)}°
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Badge variant="secondary" className="text-xs">
                      Zone: {weather.country}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Fuseau: UTC+0
                      </Badge>
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <Card className="border-2">
            <CardHeader>
              <CardTitle>Prévisions sur 5 jours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {weather.forecast.map((day, index) => (
                  <motion.div
                    key={day.date}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 border-2 hover:shadow-md transition-shadow"
                  >
                    <p className="font-semibold mb-2">{day.day}</p>
                    <div className="flex justify-center mb-3">
                      <WeatherIcon icon={day.icon} className="h-10 w-10 text-blue-600" />
                    </div>
                    <div className="text-center mb-2">
                      <p className="text-2xl font-bold">{day.tempMax}°</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{day.tempMin}°</p>
                    </div>
                    <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                      <div className="flex items-center justify-between">
                        <span>Pluie</span>
                        <span className="font-semibold">{day.precipitation}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Vent</span>
                        <span className="font-semibold">{day.windSpeed} km/h</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
            </TabsContent>

            <TabsContent value="calendar" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <ClimateCalendar location={selectedLocation} />
                </div>

                <div className="space-y-6">
                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="text-lg">Comment utiliser</CardTitle>
                    </CardHeader>
                    <div className="px-6 pb-6 space-y-3 text-sm">
                      <div className="flex gap-2">
                        <div className="mt-1">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                        </div>
                        <p>Cliquez sur une date pour voir les prévisions détaillées</p>
                      </div>
                      <div className="flex gap-2">
                        <div className="mt-1">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                        </div>
                        <p>Les couleurs indiquent le niveau de risque climatique</p>
                      </div>
                      <div className="flex gap-2">
                        <div className="mt-1">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                        </div>
                        <p>Consultez les recommandations pour chaque journée</p>
                      </div>
                      <div className="flex gap-2">
                        <div className="mt-1">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                        </div>
                        <p>Les alertes climatiques sont signalées par un triangle rouge</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="border-2 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
                    <CardHeader>
                      <CardTitle className="text-lg">Niveaux de risque</CardTitle>
                    </CardHeader>
                    <div className="px-6 pb-6 space-y-3">
                      <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg border-2 border-green-300">
                        <p className="font-semibold text-green-700 dark:text-green-300 mb-1">Favorable</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Conditions idéales pour les activités agricoles
                        </p>
                      </div>
                      <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg border-2 border-yellow-300">
                        <p className="font-semibold text-yellow-700 dark:text-yellow-300 mb-1">Attention</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Conditions acceptables mais nécessitent une surveillance
                        </p>
                      </div>
                      <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg border-2 border-red-300">
                        <p className="font-semibold text-red-700 dark:text-red-300 mb-1">Alerte</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Conditions défavorables - reporter activités sensibles
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="text-lg">Types d'alertes</CardTitle>
                    </CardHeader>
                    <div className="px-6 pb-6 space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                        <span className="font-semibold">Canicule:</span>
                        <span>Températures extrêmes</span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                        <span className="font-semibold">Pluie intense:</span>
                        <span>Risques d'inondation</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <span className="font-semibold">Vents forts:</span>
                        <span>Rafales dangereuses</span>
                      </div>
                      <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                        <span className="font-semibold">Sécheresse:</span>
                        <span>Besoin irrigation</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
