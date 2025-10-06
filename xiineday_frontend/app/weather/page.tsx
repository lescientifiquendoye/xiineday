'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClimateCalendar } from '@/components/ClimateCalendar';
import { getAllLocations } from '@/lib/api';
import { useAppStore } from '@/lib/store';

export default function CalendarPage() {
  const { selectedLocation, setSelectedLocation } = useAppStore();
  const [locations, setLocations] = useState<string[]>([]);

  useEffect(() => {
    const loadLocations = async () => {
      const locs = await getAllLocations();
      setLocations(locs);
    };
    loadLocations();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Calendrier de Prévention Climatique
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Anticipez les conditions météorologiques et planifiez vos activités agricoles en toute sécurité
            </p>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
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
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ClimateCalendar location={selectedLocation} />
            </div>

            <div className="space-y-6">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-lg">Comment utiliser</CardTitle>
                </CardHeader>
                <div className="px-6 pb-6 space-y-3 text-sm">
                  <div className="flex gap-2">
                    <div className="mt-1">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    </div>
                    <p>Cliquez sur une date pour voir les prévisions détaillées</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="mt-1">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    </div>
                    <p>Les couleurs indiquent le niveau de risque climatique</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="mt-1">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    </div>
                    <p>Consultez les recommandations pour chaque journée</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="mt-1">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    </div>
                    <p>Les alertes climatiques sont signalées par un triangle rouge</p>
                  </div>
                </div>
              </Card>

              <Card className="border-2 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
                <CardHeader>
                  <CardTitle className="text-lg">Niveaux de risque</CardTitle>
                </CardHeader>
                <div className="px-6 pb-6 space-y-3">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg border-2 border-green-300">
                    <p className="font-semibold text-green-700 dark:text-green-300 mb-1">Favorable</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Conditions idéales pour les activités agricoles
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg border-2 border-yellow-300">
                    <p className="font-semibold text-yellow-700 dark:text-yellow-300 mb-1">Attention</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Conditions acceptables mais nécessitent une surveillance
                    </p>
                  </div>
                  <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg border-2 border-red-300">
                    <p className="font-semibold text-red-700 dark:text-red-300 mb-1">Alerte</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Conditions défavorables - reporter activités sensibles
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-lg">Types d'alertes</CardTitle>
                </CardHeader>
                <div className="px-6 pb-6 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <span className="font-semibold">Canicule:</span>
                    <span>Températures extrêmes</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <span className="font-semibold">Pluie intense:</span>
                    <span>Risques d'inondation</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Vents forts:</span>
                    <span>Rafales dangereuses</span>
                  </div>
                  <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                    <span className="font-semibold">Sécheresse:</span>
                    <span>Besoin irrigation</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
