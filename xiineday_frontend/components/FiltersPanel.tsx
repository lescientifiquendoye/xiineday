'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, Thermometer, CloudRain, Wind, Sun, Sunrise, Sunset, Moon } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';

export interface WeatherFilters {
  tempMin: number;
  tempMax: number;
  rainIntensity: 'any' | 'none' | 'light' | 'heavy';
  windMax: number;
  timeOfDay: ('morning' | 'afternoon' | 'evening')[];
  dateRange?: { start: string; end: string };
}

interface FiltersPanelProps {
  filters: WeatherFilters;
  onFiltersChange: (filters: WeatherFilters) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function FiltersPanel({ filters, onFiltersChange, isOpen, onToggle }: FiltersPanelProps) {
  const [localFilters, setLocalFilters] = useState<WeatherFilters>(filters);

  const handleTempMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...localFilters, tempMin: parseInt(e.target.value) };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleTempMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...localFilters, tempMax: parseInt(e.target.value) };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleWindMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...localFilters, windMax: parseInt(e.target.value) };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleRainIntensityChange = (intensity: 'any' | 'none' | 'light' | 'heavy') => {
    const newFilters = { ...localFilters, rainIntensity: intensity };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleTimeOfDayToggle = (time: 'morning' | 'afternoon' | 'evening') => {
    const newTimeOfDay = localFilters.timeOfDay.includes(time)
      ? localFilters.timeOfDay.filter(t => t !== time)
      : [...localFilters.timeOfDay, time];
    const newFilters = { ...localFilters, timeOfDay: newTimeOfDay };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleReset = () => {
    const defaultFilters: WeatherFilters = {
      tempMin: 15,
      tempMax: 40,
      rainIntensity: 'any',
      windMax: 50,
      timeOfDay: ['morning', 'afternoon', 'evening'],
    };
    setLocalFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.tempMin > 15 || localFilters.tempMax < 40) count++;
    if (localFilters.rainIntensity !== 'any') count++;
    if (localFilters.windMax < 50) count++;
    if (localFilters.timeOfDay.length < 3) count++;
    return count;
  };

  return (
    <>
      <Button
        onClick={onToggle}
        variant="outline"
        className="fixed top-20 right-4 z-[1001] shadow-lg"
      >
        <Filter className="h-4 w-4 mr-2" />
        Filtres
        {getActiveFiltersCount() > 0 && (
          <Badge variant="default" className="ml-2 bg-green-500">
            {getActiveFiltersCount()}
          </Badge>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onToggle}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1002]"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white dark:bg-gray-950 shadow-2xl z-[1003] overflow-y-auto"
            >
              <Card className="border-0 rounded-none h-full">
                <CardHeader className="border-b sticky top-0 bg-white dark:bg-gray-950 z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Filtres météo</CardTitle>
                      <CardDescription>Affinez vos résultats</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onToggle}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 py-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <Thermometer className="h-4 w-4 text-red-500" />
                        Température
                      </Label>
                      <Button variant="ghost" size="sm" onClick={handleReset}>
                        Réinitialiser
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Min</span>
                          <span className="text-sm font-semibold">{localFilters.tempMin}°C</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="50"
                          value={localFilters.tempMin}
                          onChange={handleTempMinChange}
                          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Max</span>
                          <span className="text-sm font-semibold">{localFilters.tempMax}°C</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="50"
                          value={localFilters.tempMax}
                          onChange={handleTempMaxChange}
                          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <CloudRain className="h-4 w-4 text-blue-500" />
                      Intensité de pluie
                    </Label>

                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: 'any', label: 'Toutes', icon: CloudRain },
                        { value: 'none', label: 'Aucune', icon: Sun },
                        { value: 'light', label: 'Légère', icon: CloudRain },
                        { value: 'heavy', label: 'Forte', icon: CloudRain },
                      ].map((option) => (
                        <Button
                          key={option.value}
                          variant={localFilters.rainIntensity === option.value ? 'default' : 'outline'}
                          className={localFilters.rainIntensity === option.value ? 'bg-gradient-to-r from-green-500 to-blue-500' : ''}
                          onClick={() => handleRainIntensityChange(option.value as any)}
                        >
                          <option.icon className="h-4 w-4 mr-2" />
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <Wind className="h-4 w-4 text-gray-500" />
                      Vent maximum
                    </Label>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Max</span>
                        <span className="text-sm font-semibold">{localFilters.windMax} km/h</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={localFilters.windMax}
                        onChange={handleWindMaxChange}
                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Moment de la journée</Label>

                    <div className="space-y-2">
                      {[
                        { value: 'morning', label: 'Matin', icon: Sunrise, time: '6h-12h' },
                        { value: 'afternoon', label: 'Après-midi', icon: Sun, time: '12h-18h' },
                        { value: 'evening', label: 'Soir', icon: Sunset, time: '18h-22h' },
                      ].map((option) => (
                        <div
                          key={option.value}
                          className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            localFilters.timeOfDay.includes(option.value as any)
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
                          }`}
                          onClick={() => handleTimeOfDayToggle(option.value as any)}
                        >
                          <div className="flex items-center gap-3">
                            <option.icon className="h-5 w-5" />
                            <div>
                              <p className="font-medium">{option.label}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">{option.time}</p>
                            </div>
                          </div>
                          <Switch
                            checked={localFilters.timeOfDay.includes(option.value as any)}
                            onCheckedChange={() => handleTimeOfDayToggle(option.value as any)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      className="w-full"
                    >
                      Réinitialiser tous les filtres
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
