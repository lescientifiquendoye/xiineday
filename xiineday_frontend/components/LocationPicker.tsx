'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, Locate, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import dynamic from 'next/dynamic';

const DynamicMap = dynamic(() => import('@/components/LocationPickerMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-lg flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" />
    </div>
  ),
});

interface LocationPickerProps {
  onLocationSelect: (location: { lat: number; lon: number; name: string }) => void;
}

export function LocationPicker({ onLocationSelect }: LocationPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<{ lat: number; lon: number } | null>(null);
  const [locationName, setLocationName] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ name: string; lat: number; lon: number }>>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleGetCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setSelectedPosition({ lat: latitude, lon: longitude });

          const name = await reverseGeocode(latitude, longitude);
          setLocationName(name);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Impossible d\'obtenir votre position. Veuillez vérifier les autorisations.');
        }
      );
    } else {
      alert('La géolocalisation n\'est pas supportée par votre navigateur.');
    }
  };

  const reverseGeocode = async (lat: number, lon: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`
      );
      const data = await response.json();
      return data.address?.city || data.address?.town || data.address?.village || 'Position personnalisée';
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return 'Position personnalisée';
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`
      );
      const data = await response.json();

      const results = data.map((item: any) => ({
        name: item.display_name,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
      }));

      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchResultClick = (result: { name: string; lat: number; lon: number }) => {
    setSelectedPosition({ lat: result.lat, lon: result.lon });
    setLocationName(result.name);
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleMapClick = async (lat: number, lon: number) => {
    setSelectedPosition({ lat, lon });
    const name = await reverseGeocode(lat, lon);
    setLocationName(name);
  };

  const handleConfirm = () => {
    if (selectedPosition) {
      onLocationSelect({
        lat: selectedPosition.lat,
        lon: selectedPosition.lon,
        name: locationName,
      });
      setIsOpen(false);
      setSelectedPosition(null);
      setLocationName('');
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          className="gap-2 border-2 border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
        >
          <Plus className="h-4 w-4" />
          Ajouter position
        </Button>
      </motion.div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Ajouter une position
            </DialogTitle>
            <DialogDescription>
              Recherchez une adresse, utilisez votre position actuelle ou cliquez directement sur la carte
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Rechercher une ville ou une adresse..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      className="pr-10"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSearchResults([]);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <Button onClick={handleSearch} disabled={isSearching} className="gap-2">
                    <Search className="h-4 w-4" />
                    {isSearching ? 'Recherche...' : 'Rechercher'}
                  </Button>
                </div>

                <Button
                  onClick={handleGetCurrentLocation}
                  variant="outline"
                  className="w-full gap-2 border-2 border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <Locate className="h-4 w-4" />
                  Utiliser ma position
                </Button>

                <AnimatePresence>
                  {searchResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-2"
                    >
                      {searchResults.map((result, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Card
                            className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-green-500"
                            onClick={() => handleSearchResultClick(result)}
                          >
                            <CardContent className="p-3 flex items-start gap-2">
                              <MapPin className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <p className="text-sm">{result.name}</p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {selectedPosition && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Card className="border-2 border-green-500 bg-green-50 dark:bg-green-900/20">
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-center gap-2 text-green-700 dark:text-green-300 font-semibold">
                          <MapPin className="h-5 w-5" />
                          Position sélectionnée
                        </div>
                        <p className="text-sm">{locationName}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Lat: {selectedPosition.lat.toFixed(4)}, Lon: {selectedPosition.lon.toFixed(4)}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Cliquez sur la carte pour sélectionner une position
                </p>
                <DynamicMap
                  center={selectedPosition || { lat: 14.6937, lon: -17.4441 }}
                  zoom={selectedPosition ? 12 : 6}
                  selectedPosition={selectedPosition}
                  onMapClick={handleMapClick}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  setSelectedPosition(null);
                  setLocationName('');
                  setSearchQuery('');
                  setSearchResults([]);
                }}
              >
                Annuler
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={!selectedPosition}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Confirmer la position
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
