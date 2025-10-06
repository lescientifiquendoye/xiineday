'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Layers, Circle as CircleIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DynamicMapView as MapView } from '@/components/DynamicMapView';
import { Timeline } from '@/components/Timeline';
import { FiltersPanel, WeatherFilters } from '@/components/FiltersPanel';
import { WeatherLoader } from '@/components/WeatherLoader';
import {
  getWeather,
  getAllLocations,
  getZones,
  getWeatherTimeline,
  getWeatherByRadius,
  WeatherData,
  Zone,
  TimelineData,
} from '@/lib/api';
import { useAppStore } from '@/lib/store';

export default function EnhancedWeatherPage() {
  const { selectedLocation, setSelectedLocation } = useAppStore();
  const [locations, setLocations] = useState<string[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [zones, setZones] = useState<Zone[]>([]);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [timelineData, setTimelineData] = useState<TimelineData | null>(null);
  const [currentTimelineIndex, setCurrentTimelineIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mapMode, setMapMode] = useState<'view' | 'polygon' | 'circle'>('view');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<WeatherFilters>({
    tempMin: 15,
    tempMax: 40,
    rainIntensity: 'any',
    windMax: 50,
    timeOfDay: ['morning', 'afternoon', 'evening'],
  });

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      const locs = await getAllLocations();
      const zonesData = await getZones();
      setLocations(locs);
      setZones(zonesData);
      setLoading(false);
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    const loadWeatherAndTimeline = async () => {
      const data = await getWeather(selectedLocation);
      setWeather(data || null);

      if (data) {
        const timeline = await getWeatherTimeline(data.id);
        setTimelineData(timeline || null);
        setCurrentTimelineIndex(0);
      }
    };
    loadWeatherAndTimeline();
  }, [selectedLocation]);

  const handleLocationChange = (value: string) => {
    setSelectedLocation(value);
  };

  const handleZoneSelect = (zone: Zone) => {
    setSelectedZone(zone);
  };

  const handlePolygonCreate = async (coordinates: [number, number][]) => {
    const newZone: Zone = {
      id: Date.now(),
      name: 'Zone personnalisée',
      type: 'polygon',
      coordinates: coordinates.map(c => [c[0], c[1]]),
      weatherData: {
        temp: weather?.current.temp || 25,
        humidity: weather?.current.humidity || 70,
        windSpeed: weather?.current.windSpeed || 10,
        precipitation: weather?.current.precipitation || 0,
        condition: weather?.current.condition || 'Ensoleillé',
        icon: weather?.current.icon || 'sun',
      },
    };
    setZones([...zones, newZone]);
    setMapMode('view');
  };

  const handleCircleCreate = async (center: [number, number], radius: number) => {
    const zoneData = await getWeatherByRadius(center, radius);
    setZones([...zones, zoneData]);
    setSelectedZone(zoneData);
    setMapMode('view');
  };

  const getCurrentWeather = () => {
    if (timelineData && timelineData.hourlyForecast[currentTimelineIndex]) {
      return timelineData.hourlyForecast[currentTimelineIndex];
    }
    return undefined;
  };

  const filterForecasts = () => {
    if (!timelineData) return [];
    return timelineData.hourlyForecast.filter((forecast) => {
      if (forecast.temp < filters.tempMin || forecast.temp > filters.tempMax) return false;
      if (filters.windMax < forecast.windSpeed) return false;

      if (filters.rainIntensity !== 'any') {
        if (filters.rainIntensity === 'none' && forecast.precipitation > 5) return false;
        if (filters.rainIntensity === 'light' && (forecast.precipitation < 5 || forecast.precipitation > 30))
          return false;
        if (filters.rainIntensity === 'heavy' && forecast.precipitation < 30) return false;
      }

      const hour = parseInt(forecast.hour.split(':')[0]);
      const timeOfDay =
        hour >= 6 && hour < 12 ? 'morning' : hour >= 12 && hour < 18 ? 'afternoon' : 'evening';
      if (!filters.timeOfDay.includes(timeOfDay)) return false;

      return true;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-green-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <WeatherLoader />
      </div>
    );
  }

  const filteredForecasts = filterForecasts();
  const weatherToShow = weather?.city || selectedLocation;
  const mapCenter: [number, number] = weather?.coordinates
    ? [weather.coordinates.lat, weather.coordinates.lon]
    : [14.6937, -17.4441];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <FiltersPanel
        filters={filters}
        onFiltersChange={setFilters}
        isOpen={filtersOpen}
        onToggle={() => setFiltersOpen(!filtersOpen)}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Météo Interactive
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
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button
                  variant={mapMode === 'view' ? 'default' : 'outline'}
                  onClick={() => setMapMode('view')}
                  size="sm"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Vue
                </Button>
                <Button
                  variant={mapMode === 'polygon' ? 'default' : 'outline'}
                  onClick={() => setMapMode('polygon')}
                  size="sm"
                >
                  <Layers className="h-4 w-4 mr-2" />
                  Zone
                </Button>
                <Button
                  variant={mapMode === 'circle' ? 'default' : 'outline'}
                  onClick={() => setMapMode('circle')}
                  size="sm"
                >
                  <CircleIcon className="h-4 w-4 mr-2" />
                  Rayon
                </Button>
              </div>
            </div>
          </div>

          <Tabs defaultValue="map" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="map">Carte</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="map" className="space-y-6">
              <MapView
                zones={zones}
                selectedZone={selectedZone}
                onZoneSelect={handleZoneSelect}
                center={mapCenter}
                zoom={10}
                currentWeather={getCurrentWeather()}
                mode={mapMode}
                onPolygonCreate={handlePolygonCreate}
                onCircleCreate={handleCircleCreate}
              />

              {selectedZone && (
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle>{selectedZone.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Température</p>
                        <p className="text-2xl font-bold">{selectedZone.weatherData.temp}°C</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Humidité</p>
                        <p className="text-2xl font-bold">{selectedZone.weatherData.humidity}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Vent</p>
                        <p className="text-2xl font-bold">{selectedZone.weatherData.windSpeed} km/h</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pluie</p>
                        <p className="text-2xl font-bold">{selectedZone.weatherData.precipitation}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="timeline" className="space-y-6">
              {timelineData && filteredForecasts.length > 0 ? (
                <>
                  <Timeline
                    forecasts={filteredForecasts}
                    currentIndex={Math.min(currentTimelineIndex, filteredForecasts.length - 1)}
                    onIndexChange={setCurrentTimelineIndex}
                  />

                  <MapView
                    zones={zones}
                    selectedZone={selectedZone}
                    onZoneSelect={handleZoneSelect}
                    center={mapCenter}
                    zoom={10}
                    currentWeather={filteredForecasts[Math.min(currentTimelineIndex, filteredForecasts.length - 1)]}
                    mode="view"
                  />
                </>
              ) : (
                <Card className="border-2">
                  <CardContent className="py-12 text-center">
                    <p className="text-gray-600 dark:text-gray-400">
                      Aucune prévision ne correspond à vos filtres. Ajustez les paramètres.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
