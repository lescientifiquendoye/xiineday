'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Popup, useMap } from 'react-leaflet';
import { motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Parcel } from '@/lib/api';
import { Droplets, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface ParcelMapProps {
  parcels: Parcel[];
  selectedParcel?: Parcel | null;
  onParcelSelect?: (parcel: Parcel) => void;
  center?: [number, number];
  zoom?: number;
}

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export function ParcelMap({
  parcels,
  selectedParcel,
  onParcelSelect,
  center = [14.7886, -16.9261],
  zoom = 13,
}: ParcelMapProps) {
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

  const getParcelColor = (irrigationNeed: number) => {
    if (irrigationNeed > 70) return '#ef4444';
    if (irrigationNeed > 40) return '#f59e0b';
    return '#22c55e';
  };

  const getAlertIcon = (alerts: Array<{ type: string; message: string }>) => {
    if (alerts.length === 0) return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    const hasWarning = alerts.some(a => a.type === 'warning');
    if (hasWarning) return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    return <Info className="h-4 w-4 text-blue-500" />;
  };

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

        {parcels.map((parcel) => {
          const positions = parcel.coordinates.map(coord => [coord[0], coord[1]] as [number, number]);
          const centerLat = positions.reduce((sum, pos) => sum + pos[0], 0) / positions.length;
          const centerLng = positions.reduce((sum, pos) => sum + pos[1], 0) / positions.length;
          const color = getParcelColor(parcel.irrigationNeed);

          return (
            <div key={parcel.id}>
              <Polygon
                positions={positions}
                color={selectedParcel?.id === parcel.id ? '#00C853' : color}
                fillOpacity={0.4}
                weight={selectedParcel?.id === parcel.id ? 4 : 2}
                eventHandlers={{
                  click: () => onParcelSelect?.(parcel),
                }}
              />
              <Marker position={[centerLat, centerLng]}>
                <Popup>
                  <div className="p-2 min-w-[250px]">
                    <h3 className="font-bold text-lg mb-2">{parcel.name}</h3>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Culture:</span>
                        <span className="font-semibold">{parcel.crop}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Surface:</span>
                        <span className="font-semibold">{parcel.area} ha</span>
                      </div>

                      <div className="py-2 border-y">
                        <div className="flex items-center gap-2 mb-2">
                          <Droplets className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium">Besoin d'arrosage</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full transition-all duration-500"
                            style={{
                              width: `${parcel.irrigationNeed}%`,
                              backgroundColor: color,
                            }}
                          />
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{parcel.irrigationNeed}%</p>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          {getAlertIcon(parcel.alerts)}
                          <span className="text-sm font-medium">Recommandations</span>
                        </div>
                        <div className="text-xs space-y-1">
                          <p><strong>Irrigation:</strong> {parcel.recommendations.irrigation}</p>
                          <p><strong>Moment:</strong> {parcel.recommendations.timing}</p>
                          <p><strong>Risque:</strong> {parcel.recommendations.risk}</p>
                        </div>
                      </div>

                      {parcel.alerts.length > 0 && (
                        <div className="pt-2 border-t">
                          <p className="text-xs font-semibold mb-1">Alertes:</p>
                          {parcel.alerts.map((alert, i) => (
                            <div key={i} className="text-xs p-2 bg-orange-50 rounded mb-1">
                              {alert.message}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            </div>
          );
        })}
      </MapContainer>

      <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 z-[1000] text-xs">
        <p className="font-semibold mb-2">Légende</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#22c55e' }} />
            <span>Arrosage faible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f59e0b' }} />
            <span>Arrosage modéré</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ef4444' }} />
            <span>Arrosage élevé</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
