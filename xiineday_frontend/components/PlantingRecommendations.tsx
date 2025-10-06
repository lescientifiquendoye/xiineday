'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Calendar, Droplets, Thermometer, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle2, TrendingUp } from 'lucide-react';
import { getMonthName } from '@/lib/climateAnalysis';

interface ClimateData {
  month: number;
  avgTemp: number;
  minTemp: number;
  maxTemp: number;
  rainfall: number;
  humidity: number;
}

interface PlantingWindow {
  startMonth: number;
  endMonth: number;
  score: number;
  reasons: string[];
  warnings: string[];
}

interface PlantingRecommendationsProps {
  cropName: string;
  climateData: ClimateData[];
  plantingWindows: PlantingWindow[];
  yearRoundScore: number;
  recommendations: string[];
}

export default function PlantingRecommendations({
  cropName,
  climateData,
  plantingWindows,
  yearRoundScore,
  recommendations
}: PlantingRecommendationsProps) {
  const tempChartData = climateData.map(d => ({
    month: getMonthName(d.month).slice(0, 3),
    'Temp. Moy.': d.avgTemp,
    'Temp. Min': d.minTemp,
    'Temp. Max': d.maxTemp
  }));

  const rainfallChartData = climateData.map(d => ({
    month: getMonthName(d.month).slice(0, 3),
    'Précipitations': d.rainfall,
    'Humidité': d.humidity
  }));

  const windowsChartData = plantingWindows.map(w => ({
    période: `${getMonthName(w.startMonth).slice(0, 3)}-${getMonthName(w.endMonth).slice(0, 3)}`,
    score: w.score
  }));

  const bestWindows = plantingWindows.slice(0, 3);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { variant: 'default' as const, label: 'Excellent' };
    if (score >= 60) return { variant: 'secondary' as const, label: 'Bon' };
    if (score >= 40) return { variant: 'outline' as const, label: 'Modéré' };
    return { variant: 'destructive' as const, label: 'Difficile' };
  };

  return (
    <div className="space-y-6">
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Recommandations pour {cropName}</CardTitle>
              <CardDescription>Analyse climatique et périodes optimales de plantation</CardDescription>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {yearRoundScore.toFixed(0)}%
              </div>
              <div className="text-sm text-muted-foreground">Score annuel</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                {rec.includes('⚠️') ? (
                  <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                )}
                <p className="text-sm">{rec.replace('⚠️', '').trim()}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="windows" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="windows">Périodes de Plantation</TabsTrigger>
          <TabsTrigger value="temperature">Températures</TabsTrigger>
          <TabsTrigger value="rainfall">Précipitations</TabsTrigger>
        </TabsList>

        <TabsContent value="windows" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Meilleures Périodes de Plantation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                {bestWindows.map((window, idx) => (
                  <div key={idx} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl font-bold text-muted-foreground">#{idx + 1}</div>
                        <div>
                          <h4 className="font-semibold text-lg">
                            {getMonthName(window.startMonth)} - {getMonthName(window.endMonth)}
                          </h4>
                          <Badge {...getScoreBadge(window.score)}>
                            {getScoreBadge(window.score).label}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold">{window.score.toFixed(0)}%</div>
                        <div className="text-xs text-muted-foreground">Score</div>
                      </div>
                    </div>

                    {window.reasons.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-green-600 dark:text-green-400">Avantages :</div>
                        {window.reasons.map((reason, i) => (
                          <div key={i} className="text-sm text-muted-foreground ml-4">• {reason}</div>
                        ))}
                      </div>
                    )}

                    {window.warnings.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-orange-600 dark:text-orange-400">Points d'attention :</div>
                        {window.warnings.map((warning, i) => (
                          <div key={i} className="text-sm text-muted-foreground ml-4">• {warning}</div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={windowsChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="période" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="score" fill="#22c55e" name="Score de compatibilité (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="temperature">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Thermometer className="h-5 w-5" />
                Températures Annuelles
              </CardTitle>
              <CardDescription>
                Évolution des températures sur l'année
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={tempChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="Temp. Max" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="Temp. Moy." stackId="2" stroke="#22c55e" fill="#22c55e" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="Temp. Min" stackId="3" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rainfall">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-5 w-5" />
                Précipitations et Humidité
              </CardTitle>
              <CardDescription>
                Distribution mensuelle des précipitations et taux d'humidité
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={rainfallChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="Précipitations"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Précipitations (mm)"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="Humidité"
                      stroke="#06b6d4"
                      strokeWidth={2}
                      name="Humidité (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
