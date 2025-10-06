'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, TriangleAlert as AlertTriangle, Droplets, Wind, Thermometer, Sun, Cloud, CloudRain, CloudSnow } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { WeatherIcon } from '@/components/ui-custom/WeatherIcon';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, parseISO, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getWeather, WeatherData } from '@/lib/api';
import { useAppStore } from '@/lib/store';

interface DayWeatherInfo {
  date: string;
  temp: number;
  condition: string;
  icon: string;
  precipitation: number;
  windSpeed: number;
  alerts: string[];
  risk: 'low' | 'medium' | 'high';
  recommendations: string[];
}

const mockExtendedForecast: DayWeatherInfo[] = [
  { date: '2025-10-05', temp: 28, condition: 'Ensoleillé', icon: 'sun', precipitation: 5, windSpeed: 12, alerts: [], risk: 'low', recommendations: ['Idéal pour plantation', 'Bonne journée pour travaux agricoles'] },
  { date: '2025-10-06', temp: 30, condition: 'Partiellement nuageux', icon: 'cloud-sun', precipitation: 10, windSpeed: 15, alerts: [], risk: 'low', recommendations: ['Prévoir irrigation si nécessaire'] },
  { date: '2025-10-07', temp: 32, condition: 'Chaud', icon: 'sun', precipitation: 0, windSpeed: 18, alerts: ['Température élevée'], risk: 'medium', recommendations: ['Augmenter fréquence irrigation', 'Éviter travaux en plein soleil'] },
  { date: '2025-10-08', temp: 25, condition: 'Pluie modérée', icon: 'cloud-rain', precipitation: 75, windSpeed: 25, alerts: ['Forte pluie prévue', 'Vent modéré'], risk: 'high', recommendations: ['Reporter activités sensibles', 'Vérifier drainage parcelles'] },
  { date: '2025-10-09', temp: 24, condition: 'Nuageux', icon: 'cloud', precipitation: 40, windSpeed: 20, alerts: ['Risque de pluie'], risk: 'medium', recommendations: ['Surveiller développement météo'] },
  { date: '2025-10-10', temp: 26, condition: 'Ensoleillé', icon: 'sun', precipitation: 5, windSpeed: 10, alerts: [], risk: 'low', recommendations: ['Conditions excellentes', 'Idéal pour fertilisation'] },
  { date: '2025-10-11', temp: 27, condition: 'Ensoleillé', icon: 'sun', precipitation: 0, windSpeed: 8, alerts: [], risk: 'low', recommendations: ['Parfait pour tous travaux'] },
  { date: '2025-10-12', temp: 29, condition: 'Partiellement nuageux', icon: 'cloud-sun', precipitation: 15, windSpeed: 12, alerts: [], risk: 'low', recommendations: ['Conditions favorables', 'Bon pour traitement phyto'] },
  { date: '2025-10-13', temp: 31, condition: 'Chaud', icon: 'sun', precipitation: 5, windSpeed: 16, alerts: ['Chaleur'], risk: 'medium', recommendations: ['Irrigation recommandée', 'Protéger jeunes plants'] },
  { date: '2025-10-14', temp: 28, condition: 'Ensoleillé', icon: 'sun', precipitation: 10, windSpeed: 14, alerts: [], risk: 'low', recommendations: ['Journée productive'] },
  { date: '2025-10-15', temp: 27, condition: 'Ensoleillé', icon: 'sun', precipitation: 0, windSpeed: 10, alerts: [], risk: 'low', recommendations: ['Excellent pour récolte', 'Conditions optimales'] },
  { date: '2025-10-16', temp: 29, condition: 'Partiellement nuageux', icon: 'cloud-sun', precipitation: 20, windSpeed: 15, alerts: [], risk: 'low', recommendations: ['Surveiller humidité sol'] },
  { date: '2025-10-17', temp: 26, condition: 'Nuageux', icon: 'cloud', precipitation: 35, windSpeed: 18, alerts: [], risk: 'medium', recommendations: ['Possible pluie légère'] },
  { date: '2025-10-18', temp: 38, condition: 'Canicule', icon: 'sun', precipitation: 0, windSpeed: 10, alerts: ['Alerte canicule', 'Danger chaleur extrême'], risk: 'high', recommendations: ['Irrigation intensive urgente', 'Protéger cultures sensibles', 'Limiter travaux physiques'] },
  { date: '2025-10-19', temp: 36, condition: 'Très chaud', icon: 'sun', precipitation: 0, windSpeed: 12, alerts: ['Chaleur persistante'], risk: 'high', recommendations: ['Continuer irrigation intensive', 'Surveillance cultures'] },
  { date: '2025-10-20', temp: 29, condition: 'Ensoleillé', icon: 'sun', precipitation: 5, windSpeed: 14, alerts: [], risk: 'low', recommendations: ['Retour conditions normales', 'Inspection parcelles recommandée'] },
  { date: '2025-10-21', temp: 27, condition: 'Partiellement nuageux', icon: 'cloud-sun', precipitation: 15, windSpeed: 16, alerts: [], risk: 'low', recommendations: ['Bonnes conditions'] },
  { date: '2025-10-22', temp: 28, condition: 'Ensoleillé', icon: 'sun', precipitation: 10, windSpeed: 12, alerts: [], risk: 'low', recommendations: ['Idéal pour formation', 'Journée productive'] },
  { date: '2025-10-23', temp: 30, condition: 'Chaud', icon: 'sun', precipitation: 5, windSpeed: 15, alerts: [], risk: 'low', recommendations: ['Surveiller irrigation'] },
  { date: '2025-10-24', temp: 26, condition: 'Nuageux', icon: 'cloud', precipitation: 30, windSpeed: 20, alerts: [], risk: 'medium', recommendations: ['Possible averse'] },
  { date: '2025-10-25', temp: 25, condition: 'Ensoleillé', icon: 'sun', precipitation: 5, windSpeed: 10, alerts: [], risk: 'low', recommendations: ['Excellent pour récolte mil', 'Conditions optimales'] },
  { date: '2025-10-26', temp: 27, condition: 'Ensoleillé', icon: 'sun', precipitation: 0, windSpeed: 8, alerts: [], risk: 'low', recommendations: ['Continuer récolte', 'Parfait pour battage'] },
  { date: '2025-10-27', temp: 28, condition: 'Partiellement nuageux', icon: 'cloud-sun', precipitation: 15, windSpeed: 14, alerts: [], risk: 'low', recommendations: ['Bonnes conditions'] },
  { date: '2025-10-28', temp: 24, condition: 'Venteux', icon: 'wind', precipitation: 20, windSpeed: 55, alerts: ['Alerte vent fort', 'Rafales dangereuses'], risk: 'high', recommendations: ['Sécuriser installations', 'Reporter travaux aériens', 'Protéger serres'] },
  { date: '2025-10-29', temp: 25, condition: 'Nuageux', icon: 'cloud', precipitation: 25, windSpeed: 30, alerts: [], risk: 'medium', recommendations: ['Vent encore présent', 'Prudence recommandée'] },
  { date: '2025-10-30', temp: 26, condition: 'Ensoleillé', icon: 'sun', precipitation: 10, windSpeed: 15, alerts: [], risk: 'low', recommendations: ['Retour normal', 'Réception livraison possible'] },
  { date: '2025-10-31', temp: 27, condition: 'Ensoleillé', icon: 'sun', precipitation: 5, windSpeed: 12, alerts: [], risk: 'low', recommendations: ['Excellentes conditions'] },
  { date: '2025-11-01', temp: 28, condition: 'Partiellement nuageux', icon: 'cloud-sun', precipitation: 15, windSpeed: 14, alerts: [], risk: 'low', recommendations: ['Conditions stables'] },
  { date: '2025-11-02', temp: 26, condition: 'Nuageux', icon: 'cloud', precipitation: 30, windSpeed: 18, alerts: [], risk: 'medium', recommendations: ['Surveiller évolution'] },
  { date: '2025-11-03', temp: 25, condition: 'Pluie légère', icon: 'cloud-rain', precipitation: 50, windSpeed: 20, alerts: [], risk: 'medium', recommendations: ['Planifier activités intérieures'] },
];

interface ClimateCalendarProps {
  location?: string;
}

export function ClimateCalendar({ location }: ClimateCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const { selectedLocation } = useAppStore();
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const loadWeather = async () => {
      const data = await getWeather(location || selectedLocation);
      setWeather(data || null);
    };
    loadWeather();
  }, [location, selectedLocation]);

  const getWeatherForDate = (date: Date): DayWeatherInfo | null => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return mockExtendedForecast.find(d => d.date === dateStr) || null;
  };

  const getRiskColor = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low': return 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700';
      case 'high': return 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700';
    }
  };

  const getRiskBadge = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low': return <Badge className="bg-green-500 text-white text-[10px]">Favorable</Badge>;
      case 'medium': return <Badge className="bg-yellow-500 text-white text-[10px]">Attention</Badge>;
      case 'high': return <Badge className="bg-red-500 text-white text-[10px]">Alerte</Badge>;
    }
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
          const weatherInfo = getWeatherForDate(day);
          const isToday = isSameDay(day, new Date());
          const isSelected = isSameDay(day, selectedDate);

          return (
            <motion.div
              key={day.toString()}
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedDate(day)}
              className={`min-h-[80px] sm:min-h-[100px] p-1 sm:p-2 rounded-lg border-2 cursor-pointer transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : isToday
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : weatherInfo
                  ? getRiskColor(weatherInfo.risk)
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="text-xs sm:text-sm font-semibold mb-1">{format(day, 'd')}</div>
              {weatherInfo ? (
                <div className="space-y-1">
                  <div className="flex items-center justify-center">
                    <WeatherIcon icon={weatherInfo.icon} className="h-6 w-6 sm:h-8 sm:w-8" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs sm:text-sm font-bold">{weatherInfo.temp}°</p>
                  </div>
                  {weatherInfo.alerts.length > 0 && (
                    <div className="flex justify-center">
                      <AlertTriangle className="h-3 w-3 text-red-500" />
                    </div>
                  )}
                  {getRiskBadge(weatherInfo.risk)}
                </div>
              ) : (
                <div className="text-center text-xs text-gray-400">N/A</div>
              )}
            </motion.div>
          );
        })}
      </div>
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(direction === 'prev' ? subMonths(currentMonth, 1) : addMonths(currentMonth, 1));
  };

  const selectedWeather = getWeatherForDate(selectedDate);

  return (
    <div className="space-y-4">
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg sm:text-xl">Prévisions Climatiques</CardTitle>
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
          <CardDescription>
            Cliquez sur une date pour voir les prévisions et recommandations détaillées
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderMonthView()}
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-100 dark:bg-green-900/30 border-2 border-green-300" />
              <span className="text-xs">Favorable</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-300" />
              <span className="text-xs">Attention</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-100 dark:bg-red-900/30 border-2 border-red-300" />
              <span className="text-xs">Alerte</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedWeather && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Card className={`border-2 ${getRiskColor(selectedWeather.risk)}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">
                    {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Prévisions et recommandations
                  </CardDescription>
                </div>
                <WeatherIcon icon={selectedWeather.icon} className="h-16 w-16" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="flex flex-col items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <Thermometer className="h-5 w-5 text-red-500 mb-1" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Température</span>
                  <span className="text-lg font-bold">{selectedWeather.temp}°C</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <Droplets className="h-5 w-5 text-blue-500 mb-1" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Précipitations</span>
                  <span className="text-lg font-bold">{selectedWeather.precipitation}%</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <Wind className="h-5 w-5 text-gray-500 mb-1" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Vent</span>
                  <span className="text-lg font-bold">{selectedWeather.windSpeed} km/h</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <Cloud className="h-5 w-5 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Condition</span>
                  <span className="text-sm font-semibold text-center">{selectedWeather.condition}</span>
                </div>
              </div>

              {selectedWeather.alerts.length > 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Alertes climatiques</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1 mt-2">
                      {selectedWeather.alerts.map((alert, index) => (
                        <li key={index}>{alert}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recommandations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {selectedWeather.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="mt-1">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                        </div>
                        <span className="text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {!selectedWeather && (
        <Card className="border-2">
          <CardContent className="py-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              Aucune prévision disponible pour cette date
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
