import mockWeather from '@/data/mockWeather.json';
import mockEvents from '@/data/mockEvents.json';
import mockCrops from '@/data/mockCrops.json';
import mockZones from '@/data/mockZones.json';
import mockTimeline from '@/data/mockTimeline.json';
import mockParcels from '@/data/mockParcels.json';
import mockCalendarEvents from '@/data/mockCalendarEvents.json';

export interface WeatherData {
  id: number;
  city: string;
  country: string;
  coordinates: { lat: number; lon: number };
  current: {
    temp: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    windDirection: string;
    pressure: number;
    precipitation: number;
    condition: string;
    icon: string;
    uvIndex: number;
  };
  forecast: Array<{
    date: string;
    day: string;
    tempMin: number;
    tempMax: number;
    condition: string;
    icon: string;
    precipitation: number;
    humidity: number;
    windSpeed: number;
  }>;
}

export interface EventType {
  id: number;
  type: string;
  duration: number;
  idealConditions: {
    tempMin: number;
    tempMax: number;
    precipitationMax: number;
    windSpeedMax: number;
    description: string;
  };
}

export interface CropData {
  id: number;
  name: string;
  plantingPeriod: string;
  harvestPeriod: string;
  waterRequirements: string;
  idealConditions: {
    tempMin: number;
    tempMax: number;
    rainfallMin: number;
    rainfallMax: number;
    soilMoisture: string;
  };
  growthStages: Array<{
    stage: string;
    duration: string;
    irrigation: string;
    vulnerabilities: string[];
  }>;
}

export async function getWeather(location: string): Promise<WeatherData | undefined> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockWeather.find(item => item.city.toLowerCase() === location.toLowerCase());
}

export async function getAllLocations(): Promise<string[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockWeather.map(item => item.city);
}

export async function getEventTypes(): Promise<EventType[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockEvents;
}

export async function getCrops(): Promise<CropData[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockCrops;
}

export async function getCropById(id: number): Promise<CropData | undefined> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockCrops.find(crop => crop.id === id);
}

export interface Zone {
  id: number;
  name: string;
  type: 'polygon' | 'circle';
  coordinates?: number[][];
  center?: number[];
  radius?: number;
  weatherData: {
    temp: number;
    humidity: number;
    windSpeed: number;
    precipitation: number;
    condition: string;
    icon: string;
  };
}

export interface HourlyForecast {
  timestamp: string;
  hour: string;
  temp: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  condition: string;
  icon: string;
}

export interface TimelineData {
  locationId: number;
  location: string;
  hourlyForecast: HourlyForecast[];
}

export interface Parcel {
  id: number;
  name: string;
  crop: string;
  coordinates: number[][];
  area: number;
  plantingDate: string;
  expectedHarvest: string;
  soilMoisture: number;
  irrigationNeed: number;
  alerts: Array<{ type: string; message: string }>;
  recommendations: {
    irrigation: string;
    timing: string;
    risk: string;
  };
}

export async function getZones(): Promise<Zone[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockZones as Zone[];
}

export async function getWeatherByZone(zoneId: number): Promise<Zone | undefined> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return (mockZones as Zone[]).find(zone => zone.id === zoneId);
}

export async function getWeatherByRadius(center: [number, number], radius: number): Promise<Zone> {
  await new Promise(resolve => setTimeout(resolve, 400));
  const nearestLocation = mockWeather[0];
  return {
    id: 999,
    name: `Zone personnalisée (${radius}m)`,
    type: 'circle',
    center: center,
    radius: radius,
    weatherData: {
      temp: nearestLocation.current.temp,
      humidity: nearestLocation.current.humidity,
      windSpeed: nearestLocation.current.windSpeed,
      precipitation: nearestLocation.current.precipitation,
      condition: nearestLocation.current.condition,
      icon: nearestLocation.current.icon,
    }
  };
}

export async function getWeatherTimeline(locationId: number): Promise<TimelineData | undefined> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return (mockTimeline as TimelineData[]).find(t => t.locationId === locationId);
}

export async function getParcels(): Promise<Parcel[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockParcels as Parcel[];
}

export async function getParcelById(id: number): Promise<Parcel | undefined> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return (mockParcels as Parcel[]).find(parcel => parcel.id === id);
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  category: 'agricultural' | 'weather' | 'personal' | 'reminder';
  location?: string;
  weatherImpact?: boolean;
  alertWeather?: string;
}

export async function getCalendarEvents(): Promise<CalendarEvent[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockCalendarEvents as CalendarEvent[];
}

export async function getCalendarEventsByDate(date: string): Promise<CalendarEvent[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return (mockCalendarEvents as CalendarEvent[]).filter(event => event.date === date);
}

export async function getCalendarEventsByCategory(category: string): Promise<CalendarEvent[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return (mockCalendarEvents as CalendarEvent[]).filter(event => event.category === category);
}

export function analyzeEventSchedule(
  weather: WeatherData,
  eventType: EventType
): Array<{ date: string; score: number; reasons: string[] }> {
  return weather.forecast.map(day => {
    let score = 100;
    const reasons: string[] = [];

    if (day.tempMin < eventType.idealConditions.tempMin || day.tempMax > eventType.idealConditions.tempMax) {
      score -= 20;
      reasons.push('Température non optimale');
    }

    if (day.precipitation > eventType.idealConditions.precipitationMax) {
      score -= 30;
      reasons.push('Risque de pluie élevé');
    }

    if (day.windSpeed > eventType.idealConditions.windSpeedMax) {
      score -= 15;
      reasons.push('Vent trop fort');
    }

    if (score >= 80) {
      reasons.push('Conditions excellentes');
    } else if (score >= 60) {
      reasons.push('Conditions acceptables');
    }

    return {
      date: day.date,
      score: Math.max(0, score),
      reasons
    };
  });
}
