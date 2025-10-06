interface CropConditions {
  tempMin: number;
  tempMax: number;
  rainfallMin: number;
  rainfallMax: number;
  soilMoisture: string;
}

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

const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

function generateMockClimateData(lat: number, lon: number): ClimateData[] {
  const isNorthernHemisphere = lat > 0;
  const tropicalBelt = Math.abs(lat) < 23.5;

  return Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    let baseTemp = 25;
    let tempVariation = 0;
    let rainfall = 50;

    if (tropicalBelt) {
      baseTemp = 27;
      if (month >= 6 && month <= 9) {
        rainfall = Math.random() * 150 + 100;
        baseTemp += 2;
      } else if (month >= 11 || month <= 2) {
        rainfall = Math.random() * 30 + 10;
        baseTemp -= 2;
      } else {
        rainfall = Math.random() * 80 + 40;
      }
      tempVariation = 5;
    } else {
      if (isNorthernHemisphere) {
        tempVariation = 15 * Math.sin((month - 1) * Math.PI / 6);
      } else {
        tempVariation = 15 * Math.sin((month - 7) * Math.PI / 6);
      }
      rainfall = Math.random() * 100 + 50;
    }

    const avgTemp = baseTemp + tempVariation;

    return {
      month,
      avgTemp: parseFloat(avgTemp.toFixed(1)),
      minTemp: parseFloat((avgTemp - 5).toFixed(1)),
      maxTemp: parseFloat((avgTemp + 5).toFixed(1)),
      rainfall: parseFloat(rainfall.toFixed(1)),
      humidity: parseFloat((60 + Math.random() * 20).toFixed(1))
    };
  });
}

export function analyzeClimateForCrop(
  lat: number,
  lon: number,
  cropConditions: CropConditions
): {
  climateData: ClimateData[];
  plantingWindows: PlantingWindow[];
  yearRoundScore: number;
  recommendations: string[];
} {
  const climateData = generateMockClimateData(lat, lon);
  const plantingWindows: PlantingWindow[] = [];

  for (let startMonth = 1; startMonth <= 12; startMonth++) {
    const growthMonths = 4;
    const monthsToCheck: ClimateData[] = [];

    for (let i = 0; i < growthMonths; i++) {
      const monthIndex = ((startMonth - 1 + i) % 12);
      monthsToCheck.push(climateData[monthIndex]);
    }

    let score = 100;
    const reasons: string[] = [];
    const warnings: string[] = [];

    const avgTemp = monthsToCheck.reduce((sum, m) => sum + m.avgTemp, 0) / growthMonths;
    const totalRainfall = monthsToCheck.reduce((sum, m) => sum + m.rainfall, 0);
    const minTemp = Math.min(...monthsToCheck.map(m => m.minTemp));
    const maxTemp = Math.max(...monthsToCheck.map(m => m.maxTemp));

    if (avgTemp < cropConditions.tempMin) {
      const deficit = cropConditions.tempMin - avgTemp;
      score -= deficit * 5;
      warnings.push(`Température moyenne trop basse (${avgTemp.toFixed(1)}°C < ${cropConditions.tempMin}°C)`);
    } else if (avgTemp > cropConditions.tempMax) {
      const excess = avgTemp - cropConditions.tempMax;
      score -= excess * 5;
      warnings.push(`Température moyenne trop élevée (${avgTemp.toFixed(1)}°C > ${cropConditions.tempMax}°C)`);
    } else {
      reasons.push(`Température optimale (${avgTemp.toFixed(1)}°C)`);
    }

    if (totalRainfall < cropConditions.rainfallMin) {
      const deficit = ((cropConditions.rainfallMin - totalRainfall) / cropConditions.rainfallMin) * 100;
      score -= deficit * 0.5;
      warnings.push(`Précipitations insuffisantes (${totalRainfall.toFixed(0)}mm < ${cropConditions.rainfallMin}mm)`);
    } else if (totalRainfall > cropConditions.rainfallMax) {
      const excess = ((totalRainfall - cropConditions.rainfallMax) / cropConditions.rainfallMax) * 100;
      score -= excess * 0.3;
      warnings.push(`Précipitations excessives (${totalRainfall.toFixed(0)}mm > ${cropConditions.rainfallMax}mm)`);
    } else {
      reasons.push(`Précipitations adéquates (${totalRainfall.toFixed(0)}mm)`);
    }

    if (minTemp < cropConditions.tempMin - 5) {
      score -= 20;
      warnings.push(`Risque de gel ou froid extrême (${minTemp.toFixed(1)}°C)`);
    }

    if (maxTemp > cropConditions.tempMax + 5) {
      score -= 15;
      warnings.push(`Risque de chaleur extrême (${maxTemp.toFixed(1)}°C)`);
    }

    const endMonth = ((startMonth + growthMonths - 2) % 12) + 1;

    plantingWindows.push({
      startMonth,
      endMonth,
      score: Math.max(0, Math.min(100, score)),
      reasons,
      warnings
    });
  }

  plantingWindows.sort((a, b) => b.score - a.score);

  const yearRoundScore = plantingWindows.reduce((sum, w) => sum + w.score, 0) / 12;

  const bestWindow = plantingWindows[0];
  const recommendations: string[] = [];

  if (bestWindow.score > 80) {
    recommendations.push(`Période idéale : ${MONTHS[bestWindow.startMonth - 1]} - ${MONTHS[bestWindow.endMonth - 1]}`);
    recommendations.push('Conditions climatiques excellentes pour cette culture');
  } else if (bestWindow.score > 60) {
    recommendations.push(`Période recommandée : ${MONTHS[bestWindow.startMonth - 1]} - ${MONTHS[bestWindow.endMonth - 1]}`);
    recommendations.push('Conditions climatiques favorables avec quelques précautions');
  } else if (bestWindow.score > 40) {
    recommendations.push(`Période possible : ${MONTHS[bestWindow.startMonth - 1]} - ${MONTHS[bestWindow.endMonth - 1]}`);
    recommendations.push('Conditions climatiques modérées, irrigation recommandée');
  } else {
    recommendations.push('Cette région présente des défis pour cette culture');
    recommendations.push('Envisager des variétés résistantes ou des techniques d\'adaptation');
  }

  if (yearRoundScore < 50) {
    recommendations.push('⚠️ Cette culture pourrait ne pas être adaptée à cette région');
  }

  return {
    climateData,
    plantingWindows,
    yearRoundScore,
    recommendations
  };
}

export function getMonthName(month: number): string {
  return MONTHS[month - 1];
}
