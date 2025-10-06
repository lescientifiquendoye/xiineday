'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MapPin, Trash2, ChevronRight } from 'lucide-react';
import MyFieldForm from './MyFieldForm';
import PlantingRecommendations from './PlantingRecommendations';
import { analyzeClimateForCrop } from '@/lib/climateAnalysis';
import { supabase } from '@/lib/supabase';

interface Field {
  id: string;
  name: string;
  crop_type: string;
  location: string;
  center_lat: number;
  center_lng: number;
  recommendations: any;
  created_at: string;
}

interface MyFieldSectionProps {
  crops: Array<{ id: number; name: string; idealConditions: any }>;
}

export default function MyFieldSection({ crops }: MyFieldSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [savedFields, setSavedFields] = useState<Field[]>([]);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const loadSavedFields = async () => {
    const { data, error } = await supabase
      .from('fields')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setSavedFields(data);
    }
  };

  useEffect(() => {
    loadSavedFields();
  }, []);

  const handleFormSubmit = async (formData: any) => {
    setLoading(true);

    const selectedCrop = crops.find((c) => c.name === formData.cropType);
    if (!selectedCrop) return;

    const analysis = analyzeClimateForCrop(
      formData.centerLat,
      formData.centerLng,
      selectedCrop.idealConditions
    );

    const fieldData = {
      name: formData.name,
      crop_type: formData.cropType,
      location: formData.polygon,
      center_lat: formData.centerLat,
      center_lng: formData.centerLng,
      recommendations: analysis,
    };

    const { data, error } = await supabase
      .from('fields')
      .insert([fieldData])
      .select()
      .maybeSingle();

    if (!error && data) {
      setAnalysisResult(analysis);
      setShowForm(false);
      await loadSavedFields();
    }

    setLoading(false);
  };

  const handleDeleteField = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce champ ?')) return;

    await supabase.from('fields').delete().eq('id', id);
    await loadSavedFields();

    if (selectedField?.id === id) {
      setSelectedField(null);
      setAnalysisResult(null);
    }
  };

  const handleViewField = (field: Field) => {
    setSelectedField(field);
    setAnalysisResult(field.recommendations);
  };

  if (showForm) {
    return (
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Créer un nouveau champ</h2>
          <Button variant="outline" onClick={() => setShowForm(false)}>
            Annuler
          </Button>
        </div>
        <MyFieldForm crops={crops} onSubmit={handleFormSubmit} />
      </div>
    );
  }

  if (analysisResult) {
    const selectedCrop = crops.find((c) => c.name === selectedField?.crop_type);

    return (
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{selectedField?.name}</h2>
            <p className="text-muted-foreground">
              {selectedField?.location} • {selectedField?.crop_type}
            </p>
          </div>
          <Button variant="outline" onClick={() => setAnalysisResult(null)}>
            Retour
          </Button>
        </div>

        <PlantingRecommendations
          cropName={selectedField?.crop_type || ''}
          climateData={analysisResult.climateData}
          plantingWindows={analysisResult.plantingWindows}
          yearRoundScore={analysisResult.yearRoundScore}
          recommendations={analysisResult.recommendations}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10">
        <CardHeader>
          <CardTitle>Mon Champ</CardTitle>
          <CardDescription>
            Créez et analysez vos champs pour obtenir des recommandations de plantation personnalisées
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" size="lg" onClick={() => setShowForm(true)}>
            <Plus className="h-5 w-5 mr-2" />
            Créer un nouveau champ
          </Button>
        </CardContent>
      </Card>

      {savedFields.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Mes champs enregistrés ({savedFields.length})</CardTitle>
            <CardDescription>Consultez les analyses climatiques de vos champs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {savedFields.map((field) => (
                <div
                  key={field.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{field.name}</h3>
                        <Badge variant="secondary">{field.crop_type}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{field.location}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Créé le {new Date(field.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteField(field.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button onClick={() => handleViewField(field)}>
                        Voir l'analyse
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
