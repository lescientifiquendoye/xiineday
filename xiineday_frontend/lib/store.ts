import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'fr' | 'en' | 'wo';

interface AppState {
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  language: Language;
  setLanguage: (language: Language) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      selectedLocation: 'Dakar',
      setSelectedLocation: (location) => set({ selectedLocation: location }),
      theme: 'light',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      language: 'fr',
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'xiineday-storage',
    }
  )
);
