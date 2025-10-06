'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polygon, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface FieldDrawingMapProps {
  center: { lat: number; lon: number };
  zoom: number;
  polygon: Array<{ lat: number; lon: number }>;
  onPolygonChange: (polygon: Array<{ lat: number; lon: number }>) => void;
}

function DrawingControl({ polygon, onPolygonChange }: { polygon: Array<{ lat: number; lon: number }>; onPolygonChange: (polygon: Array<{ lat: number; lon: number }>) => void }) {
  const map = useMap();
  const drawingRef = useRef(false);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    const markerIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    const onMapClick = (e: L.LeafletMouseEvent) => {
      if (!drawingRef.current) return;

      const newPoint = { lat: e.latlng.lat, lon: e.latlng.lng };
      const newPolygon = [...polygon, newPoint];
      onPolygonChange(newPolygon);

      const marker = L.marker([e.latlng.lat, e.latlng.lng], { icon: markerIcon }).addTo(map);
      markersRef.current.push(marker);
    };

    map.on('click', onMapClick);

    return () => {
      map.off('click', onMapClick);
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
    };
  }, [map, polygon, onPolygonChange]);

  const startDrawing = () => {
    drawingRef.current = true;
  };

  const stopDrawing = () => {
    drawingRef.current = false;
  };

  const clearPolygon = () => {
    onPolygonChange([]);
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
  };

  useEffect(() => {
    const drawButton = L.Control.extend({
      options: { position: 'topright' },
      onAdd: function() {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        container.style.background = 'white';
        container.style.padding = '10px';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '5px';

        const startBtn = L.DomUtil.create('button', '', container);
        startBtn.innerHTML = '✏️ Dessiner';
        startBtn.style.cursor = 'pointer';
        startBtn.style.padding = '5px 10px';
        startBtn.style.border = '1px solid #ccc';
        startBtn.style.borderRadius = '4px';
        startBtn.style.background = '#22c55e';
        startBtn.style.color = 'white';
        L.DomEvent.on(startBtn, 'click', (e) => {
          L.DomEvent.stopPropagation(e);
          startDrawing();
        });

        const stopBtn = L.DomUtil.create('button', '', container);
        stopBtn.innerHTML = '⏸️ Arrêter';
        stopBtn.style.cursor = 'pointer';
        stopBtn.style.padding = '5px 10px';
        stopBtn.style.border = '1px solid #ccc';
        stopBtn.style.borderRadius = '4px';
        stopBtn.style.background = '#3b82f6';
        stopBtn.style.color = 'white';
        L.DomEvent.on(stopBtn, 'click', (e) => {
          L.DomEvent.stopPropagation(e);
          stopDrawing();
        });

        const clearBtn = L.DomUtil.create('button', '', container);
        clearBtn.innerHTML = '🗑️ Effacer';
        clearBtn.style.cursor = 'pointer';
        clearBtn.style.padding = '5px 10px';
        clearBtn.style.border = '1px solid #ccc';
        clearBtn.style.borderRadius = '4px';
        clearBtn.style.background = '#ef4444';
        clearBtn.style.color = 'white';
        L.DomEvent.on(clearBtn, 'click', (e) => {
          L.DomEvent.stopPropagation(e);
          clearPolygon();
        });

        return container;
      }
    });

    const control = new drawButton();
    map.addControl(control);

    return () => {
      map.removeControl(control);
    };
  }, [map]);

  return null;
}

export default function FieldDrawingMap({ center, zoom, polygon, onPolygonChange }: FieldDrawingMapProps) {
  const polygonPositions = polygon.map(p => [p.lat, p.lon] as [number, number]);

  return (
    <div className="h-[500px] w-full rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-lg">
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
        <DrawingControl polygon={polygon} onPolygonChange={onPolygonChange} />
        {polygonPositions.length > 2 && (
          <Polygon
            positions={polygonPositions}
            pathOptions={{
              color: '#22c55e',
              fillColor: '#22c55e',
              fillOpacity: 0.3,
              weight: 3
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
