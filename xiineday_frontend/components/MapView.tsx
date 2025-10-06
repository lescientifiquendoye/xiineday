'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, Circle, useMap, useMapEvents } from 'react-leaflet';
import { motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Zone, HourlyForecast } from '@/lib/api';
import { WeatherIcon } from './ui-custom/WeatherIcon';
import { Thermometer, Droplets, Wind } from 'lucide-react';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewProps {
  zones: Zone[];
  selectedZone?: Zone | null;
  onZoneSelect?: (zone: Zone) => void;
  center?: [number, number];
  zoom?: number;
  currentWeather?: HourlyForecast;
  mode?: 'view' | 'polygon' | 'circle';
  onPolygonCreate?: (coordinates: [number, number][]) => void;
  onCircleCreate?: (center: [number, number], radius: number) => void;
}

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

function PolygonDrawer({ onComplete }: { onComplete: (coords: [number, number][]) => void }) {
  const [points, setPoints] = useState<[number, number][]>([]);

  useMapEvents({
    click(e) {
      const newPoints = [...points, [e.latlng.lat, e.latlng.lng] as [number, number]];
      setPoints(newPoints);

      if (newPoints.length >= 3) {
        onComplete(newPoints);
        setPoints([]);
      }
    },
  });

  return points.length > 0 ? (
    <Polygon positions={points} color="blue" fillOpacity={0.2} />
  ) : null;
}

function CircleDrawer({ onComplete }: { onComplete: (center: [number, number], radius: number) => void }) {
  const [center, setCenter] = useState<[number, number] | null>(null);
  const [radius, setRadius] = useState<number>(5000);

  useMapEvents({
    click(e) {
      if (!center) {
        setCenter([e.latlng.lat, e.latlng.lng]);
      } else {
        const distance = e.latlng.distanceTo(L.latLng(center[0], center[1]));
        setRadius(distance);
        onComplete(center, distance);
        setCenter(null);
      }
    },
  });

  return center ? (
    <Circle center={center} radius={radius} color="green" fillOpacity={0.2} />
  ) : null;
}

export function MapView({
  zones,
  selectedZone,
  onZoneSelect,
  center = [14.6937, -17.4441],
  zoom = 10,
  currentWeather,
  mode = 'view',
  onPolygonCreate,
  onCircleCreate,
}: MapViewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[500px] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full h-[500px] rounded-lg overflow-hidden shadow-lg border-2"
    >
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <MapController center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {mode === 'polygon' && onPolygonCreate && (
          <PolygonDrawer onComplete={onPolygonCreate} />
        )}

        {mode === 'circle' && onCircleCreate && (
          <CircleDrawer onComplete={onCircleCreate} />
        )}

        {mode === 'view' && zones.map((zone) => {
          if (zone.type === 'polygon' && zone.coordinates) {
            const positions = zone.coordinates.map(coord => [coord[0], coord[1]] as [number, number]);
            const centerLat = positions.reduce((sum, pos) => sum + pos[0], 0) / positions.length;
            const centerLng = positions.reduce((sum, pos) => sum + pos[1], 0) / positions.length;

            return (
              <div key={zone.id}>
                <Polygon
                  positions={positions}
                  color={selectedZone?.id === zone.id ? '#00C853' : '#2196F3'}
                  fillOpacity={0.3}
                  eventHandlers={{
                    click: () => onZoneSelect?.(zone),
                  }}
                />
                <Marker position={[centerLat, centerLng]}>
                  <Popup>
                    <div className="p-2 min-w-[200px]">
                      <h3 className="font-bold text-lg mb-2">{zone.name}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Thermometer className="h-4 w-4 text-red-500" />
                          <span className="text-sm">{zone.weatherData.temp}°C</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Droplets className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">{zone.weatherData.humidity}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Wind className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{zone.weatherData.windSpeed} km/h</span>
                        </div>
                        <div className="mt-2 pt-2 border-t">
                          <p className="text-sm font-medium">{zone.weatherData.condition}</p>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              </div>
            );
          }

          if (zone.type === 'circle' && zone.center && zone.radius) {
            return (
              <div key={zone.id}>
                <Circle
                  center={[zone.center[0], zone.center[1]]}
                  radius={zone.radius}
                  color={selectedZone?.id === zone.id ? '#00C853' : '#2196F3'}
                  fillOpacity={0.3}
                  eventHandlers={{
                    click: () => onZoneSelect?.(zone),
                  }}
                />
                <Marker position={[zone.center[0], zone.center[1]]}>
                  <Popup>
                    <div className="p-2 min-w-[200px]">
                      <h3 className="font-bold text-lg mb-2">{zone.name}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Thermometer className="h-4 w-4 text-red-500" />
                          <span className="text-sm">{zone.weatherData.temp}°C</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Droplets className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">{zone.weatherData.humidity}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Wind className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{zone.weatherData.windSpeed} km/h</span>
                        </div>
                        <div className="mt-2 pt-2 border-t">
                          <p className="text-sm font-medium">{zone.weatherData.condition}</p>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              </div>
            );
          }

          return null;
        })}
      </MapContainer>

      {currentWeather && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-[1000]"
        >
          <div className="flex items-center gap-3">
            <WeatherIcon icon={currentWeather.icon} className="h-8 w-8" />
            <div>
              <p className="text-2xl font-bold">{currentWeather.temp}°C</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{currentWeather.hour}</p>
            </div>
          </div>
        </motion.div>
      )}

      {mode !== 'view' && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg px-4 py-2 z-[1000]">
          <p className="text-sm font-medium">
            {mode === 'polygon' ? 'Cliquez pour créer une zone (3+ points)' : 'Cliquez pour définir le centre, puis le rayon'}
          </p>
        </div>
      )}
    </motion.div>
  );
}
