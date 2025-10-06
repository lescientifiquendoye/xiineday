import { Cloud, CloudRain, CloudLightning, Sun, CloudSun } from 'lucide-react';

interface WeatherIconProps {
  icon: string;
  className?: string;
}

export function WeatherIcon({ icon, className = "h-8 w-8" }: WeatherIconProps) {
  const iconMap: Record<string, React.ElementType> = {
    sun: Sun,
    'cloud-sun': CloudSun,
    cloud: Cloud,
    'cloud-rain': CloudRain,
    'cloud-lightning': CloudLightning,
  };

  const IconComponent = iconMap[icon] || Sun;

  return <IconComponent className={className} />;
}
