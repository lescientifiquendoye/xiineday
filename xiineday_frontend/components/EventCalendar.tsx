'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin, Clock } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getEvents, UserEvent } from '@/lib/supabase';

type EventCategory = 'agricultural' | 'weather' | 'personal' | 'reminder';

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  category: EventCategory;
  location?: string;
  weatherImpact?: boolean;
}

const categoryColors: Record<EventCategory, { bg: string; text: string; border: string }> = {
  agricultural: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', border: 'border-green-300 dark:border-green-700' },
  weather: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-300 dark:border-blue-700' },
  personal: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-300 dark:border-purple-700' },
  reminder: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-300 dark:border-orange-700' },
};

const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Plantation de Mil',
    description: 'Début de la plantation dans la parcelle Nord',
    date: new Date(2025, 9, 5),
    startTime: '08:00',
    endTime: '12:00',
    category: 'agricultural',
    location: 'Parcelle Nord',
    weatherImpact: true,
  },
  {
    id: '2',
    title: 'Irrigation Maïs',
    description: 'Système d\'irrigation à vérifier',
    date: new Date(2025, 9, 6),
    startTime: '06:00',
    endTime: '09:00',
    category: 'agricultural',
    location: 'Parcelle Est',
    weatherImpact: true,
  },
  {
    id: '3',
    title: 'Risque de pluie',
    description: 'Pluies abondantes prévues',
    date: new Date(2025, 9, 8),
    startTime: '14:00',
    endTime: '18:00',
    category: 'weather',
    weatherImpact: true,
  },
  {
    id: '4',
    title: 'Récolte Arachide',
    description: 'Début de la récolte',
    date: new Date(2025, 9, 15),
    startTime: '07:00',
    endTime: '16:00',
    category: 'agricultural',
    location: 'Parcelle Ouest',
  },
];

interface EventCalendarProps {
  compact?: boolean;
  showCategories?: EventCategory[];
}

export function EventCalendar({ compact = false, showCategories }: EventCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [userEvents, setUserEvents] = useState<UserEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserEvents();
  }, [currentMonth]);

  const loadUserEvents = async () => {
    try {
      setLoading(true);
      const monthStart = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
      const monthEnd = format(endOfMonth(currentMonth), 'yyyy-MM-dd');
      const events = await getEvents(undefined, monthStart, monthEnd);
      setUserEvents(events);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const convertUserEventToCalendarEvent = (userEvent: UserEvent): CalendarEvent => {
    return {
      id: userEvent.id || '',
      title: userEvent.title,
      description: userEvent.description || '',
      date: parseISO(userEvent.event_date),
      startTime: '08:00',
      endTime: '17:00',
      category: 'agricultural',
      location: userEvent.location,
      weatherImpact: true,
    };
  };

  const allEvents = [
    ...mockEvents,
    ...userEvents.map(convertUserEventToCalendarEvent),
  ];

  const filteredEvents = showCategories
    ? allEvents.filter(e => showCategories.includes(e.category))
    : allEvents;

  const getEventsForDate = (date: Date) => {
    return filteredEvents.filter((event) => isSameDay(event.date, date));
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return (
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
          <div key={day} className="text-center font-semibold text-xs sm:text-sm text-gray-600 dark:text-gray-400 py-2">
            {day}
          </div>
        ))}
        {days.map((day) => {
          const dayEvents = getEventsForDate(day);
          const isToday = isSameDay(day, new Date());
          const isSelected = isSameDay(day, selectedDate);

          return (
            <motion.div
              key={day.toString()}
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedDate(day)}
              className={`min-h-[60px] sm:min-h-[80px] p-1 sm:p-2 rounded-lg border-2 cursor-pointer transition-all ${
                isSelected
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : isToday
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="text-xs sm:text-sm font-semibold mb-1">{format(day, 'd')}</div>
              <div className="space-y-1">
                {dayEvents.slice(0, compact ? 1 : 2).map((event) => (
                  <div
                    key={event.id}
                    className={`text-[10px] sm:text-xs p-0.5 sm:p-1 rounded truncate ${categoryColors[event.category].bg} ${categoryColors[event.category].text}`}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > (compact ? 1 : 2) && (
                  <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">+{dayEvents.length - (compact ? 1 : 2)}</div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(direction === 'prev' ? subMonths(currentMonth, 1) : addMonths(currentMonth, 1));
  };

  return (
    <div className="space-y-4">
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg sm:text-xl">Calendrier</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm sm:text-base font-semibold min-w-[120px] text-center">
                {format(currentMonth, 'MMMM yyyy', { locale: fr })}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderMonthView()}
        </CardContent>
      </Card>

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-lg">Événements du jour</CardTitle>
          <CardDescription>
            {format(selectedDate, 'd MMMM yyyy', { locale: fr })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getEventsForDate(selectedDate).length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                Aucun événement ce jour
              </p>
            ) : (
              getEventsForDate(selectedDate).map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-3 rounded-lg border-l-4 ${categoryColors[event.category].bg} ${categoryColors[event.category].border}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-semibold text-sm">{event.title}</div>
                    <Badge className="text-xs bg-gradient-to-r from-green-500 to-blue-500">
                      Événement créé
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {event.description}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="h-3 w-3" />
                    {event.startTime} - {event.endTime}
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <MapPin className="h-3 w-3" />
                      {event.location}
                    </div>
                  )}
                  {event.weatherImpact && (
                    <Badge variant="secondary" className="mt-2 text-xs">
                      Sensible à la météo
                    </Badge>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
