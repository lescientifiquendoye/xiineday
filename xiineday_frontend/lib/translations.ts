import { Language } from './store';

export const translations = {
  fr: {
    appName: 'XiineDay',
    tagline: 'Votre météo, vos décisions.',
    nav: {
      home: 'Accueil',
      weather: 'Météo',
      events: 'Événements',
      pro: 'Pro',
    },
    languages: {
      fr: 'Français',
      en: 'English',
      wo: 'Wolof',
    },
  },
  en: {
    appName: 'XiineDay',
    tagline: 'Your weather, your decisions.',
    nav: {
      home: 'Home',
      weather: 'Weather',
      events: 'Events',
      pro: 'Pro',
    },
    languages: {
      fr: 'Français',
      en: 'English',
      wo: 'Wolof',
    },
  },
  wo: {
    appName: 'XiineDay',
    tagline: 'Sa taw, sa décisions.',
    nav: {
      home: 'Kër',
      weather: 'Taw',
      events: 'Seen',
      pro: 'Pro',
    },
    languages: {
      fr: 'Français',
      en: 'English',
      wo: 'Wolof',
    },
  },
};

export function useTranslation(language: Language) {
  return translations[language];
}
