import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      isDark: false,
      toggleTheme: () => {
        const currentState = get();
        const newIsDark = !currentState.isDark;
        set({ isDark: newIsDark });
      },
      setTheme: (isDark: boolean) => {
        set({ isDark });
      },
    }),
    {
      name: 'theme-storage',
    }
  )
); 