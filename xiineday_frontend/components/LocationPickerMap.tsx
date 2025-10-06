'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const customIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface LocationPickerMapProps {
  center: { lat: number; lon: number };
  zoom: number;
  selectedPosition: { lat: number; lon: number } | null;
  onMapClick: (lat: number, lon: number) => void;
}

function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lon: number) => void }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MapCenterUpdater({ center, zoom }: { center: { lat: number; lon: number }; zoom: number }) {
  const map = useMapEvents({});

  useEffect(() => {
    map.setView([center.lat, center.lon], zoom);
  }, [center.lat, center.lon, zoom, map]);

  return null;
}

export default function LocationPickerMap({ center, zoom, selectedPosition, onMapClick }: LocationPickerMapProps) {
  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-lg">
      <MapContainer
        center={[center.lat, center.lon]}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onMapClick={onMapClick} />
        <MapCenterUpdater center={center} zoom={zoom} />
        {selectedPosition && (
          <Marker position={[selectedPosition.lat, selectedPosition.lon]} icon={customIcon} />
        )}
      </MapContainer>
    </div>
  );
}
