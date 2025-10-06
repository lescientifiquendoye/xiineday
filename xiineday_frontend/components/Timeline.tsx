'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { HourlyForecast } from '@/lib/api';
import { WeatherIcon } from './ui-custom/WeatherIcon';

interface TimelineProps {
  forecasts: HourlyForecast[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  autoPlay?: boolean;
  interval?: number;
}

export function Timeline({
  forecasts,
  currentIndex,
  onIndexChange,
  autoPlay = false,
  interval = 2000,
}: TimelineProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      onIndexChange((currentIndex + 1) % forecasts.length);
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, currentIndex, forecasts.length, interval, onIndexChange]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newIndex = parseInt(e.target.value);
    onIndexChange(newIndex);
  };

  const handlePrevious = () => {
    onIndexChange(Math.max(0, currentIndex - 1));
  };

  const handleNext = () => {
    onIndexChange(Math.min(forecasts.length - 1, currentIndex + 1));
  };

  const currentForecast = forecasts[currentIndex];

  if (!currentForecast) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-2">
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <WeatherIcon icon={currentForecast.icon} className="h-12 w-12 text-blue-600" />
                <div>
                  <h3 className="text-2xl font-bold">{currentForecast.temp}°C</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {currentForecast.hour} - {currentForecast.condition}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                >
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNext}
                  disabled={currentIndex === forecasts.length - 1}
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max={forecasts.length - 1}
                value={currentIndex}
                onChange={handleSliderChange}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
              />

              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                <span>{forecasts[0]?.hour}</span>
                <span>{forecasts[forecasts.length - 1]?.hour}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Humidité</p>
                <p className="text-lg font-semibold">{currentForecast.humidity}%</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Vent</p>
                <p className="text-lg font-semibold">{currentForecast.windSpeed} km/h</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Pluie</p>
                <p className="text-lg font-semibold">{currentForecast.precipitation}%</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {forecasts.map((forecast, index) => (
                <motion.button
                  key={index}
                  onClick={() => onIndexChange(index)}
                  className={`p-2 rounded-lg border-2 transition-all ${
                    index === currentIndex
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex flex-col items-center gap-1">
                    <WeatherIcon icon={forecast.icon} className="h-5 w-5" />
                    <span className="text-xs font-medium">{forecast.hour.slice(0, 5)}</span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {forecast.temp}°
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
