'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Loader as Loader2, Search } from 'lucide-react';
import dynamic from 'next/dynamic';

const FieldDrawingMap = dynamic(() => import('./FieldDrawingMap'), { ssr: false });

interface MyFieldFormProps {
  crops: Array<{ id: number; name: string; idealConditions: any }>;
  onSubmit: (data: {
    name: string;
    cropType: string;
    location: string;
    polygon: Array<{ lat: number; lon: number }>;
    centerLat: number;
    centerLng: number;
  }) => void;
}

export default function MyFieldForm({ crops, onSubmit }: MyFieldFormProps) {
  const [step, setStep] = useState(1);
  const [fieldName, setFieldName] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('');
  const [location, setLocation] = useState('');
  const [searchingLocation, setSearchingLocation] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 14.7167, lon: -17.4677 });
  const [polygon, setPolygon] = useState<Array<{ lat: number; lon: number }>>([]);

  const handleLocationSearch = async () => {
    if (!location.trim()) return;

    setSearchingLocation(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        setMapCenter({
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
        });
      }
    } catch (error) {
      console.error('Error searching location:', error);
    } finally {
      setSearchingLocation(false);
    }
  };

  const handleSubmit = () => {
    if (!fieldName.trim() || !selectedCrop || polygon.length < 3) {
      alert('Veuillez remplir tous les champs et dessiner votre champ sur la carte (minimum 3 points)');
      return;
    }

    const centerLat = polygon.reduce((sum, p) => sum + p.lat, 0) / polygon.length;
    const centerLng = polygon.reduce((sum, p) => sum + p.lon, 0) / polygon.length;

    onSubmit({
      name: fieldName,
      cropType: selectedCrop,
      location,
      polygon,
      centerLat,
      centerLng,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
          1
        </div>
        <div className="flex-1 h-1 bg-gray-200">
          <div className={`h-full ${step >= 2 ? 'bg-green-600' : 'bg-gray-200'}`} style={{ width: step >= 2 ? '100%' : '0%' }} />
        </div>
        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
          2
        </div>
        <div className="flex-1 h-1 bg-gray-200">
          <div className={`h-full ${step >= 3 ? 'bg-green-600' : 'bg-gray-200'}`} style={{ width: step >= 3 ? '100%' : '0%' }} />
        </div>
        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 3 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
          3
        </div>
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Informations de base</CardTitle>
            <CardDescription>Nommez votre champ et sélectionnez la culture</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fieldName">Nom du champ</Label>
              <Input
                id="fieldName"
                placeholder="Ex: Parcelle Nord, Champ de maïs..."
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="crop">Type de culture</Label>
              <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une culture" />
                </SelectTrigger>
                <SelectContent>
                  {crops.map((crop) => (
                    <SelectItem key={crop.id} value={crop.name}>
                      {crop.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              className="w-full"
              onClick={() => setStep(2)}
              disabled={!fieldName.trim() || !selectedCrop}
            >
              Suivant
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Localisation</CardTitle>
            <CardDescription>Recherchez votre localité pour centrer la carte</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="location">Localité</Label>
              <div className="flex gap-2">
                <Input
                  id="location"
                  placeholder="Ex: Dakar, Thiès, Saint-Louis..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLocationSearch()}
                />
                <Button
                  onClick={handleLocationSearch}
                  disabled={searchingLocation || !location.trim()}
                  size="icon"
                >
                  {searchingLocation ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                La carte se centrera automatiquement sur votre localité
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)}>
                Retour
              </Button>
              <Button className="flex-1" onClick={() => setStep(3)}>
                Suivant
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Délimitation du champ</CardTitle>
            <CardDescription>
              Dessinez les limites de votre champ sur la carte ({polygon.length} points)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FieldDrawingMap
              center={mapCenter}
              zoom={13}
              polygon={polygon}
              onPolygonChange={setPolygon}
            />

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-900 dark:text-blue-100 font-medium mb-2">
                Comment dessiner votre champ :
              </p>
              <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1 ml-4 list-disc">
                <li>Cliquez sur "✏️ Dessiner" pour commencer</li>
                <li>Cliquez sur la carte pour placer chaque coin de votre champ</li>
                <li>Cliquez sur "⏸️ Arrêter" quand vous avez fini</li>
                <li>Utilisez "🗑️ Effacer" pour recommencer</li>
                <li>Minimum 3 points requis pour former un polygone</li>
              </ul>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)}>
                Retour
              </Button>
              <Button
                className="flex-1"
                onClick={handleSubmit}
                disabled={polygon.length < 3}
              >
                Analyser
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
