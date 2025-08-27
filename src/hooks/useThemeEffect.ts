import { useEffect } from 'react';
import { useThemeStore } from '../stores/themeStore';

export const useThemeEffect = () => {
  const { isDark, setTheme } = useThemeStore();

  // Efecto para aplicar el tema al DOM
  useEffect(() => {
    const root = document.documentElement;
    
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  // Efecto para inicializar el tema al cargar
  useEffect(() => {
    const root = document.documentElement;
    
    // Verificar si hay un tema guardado
    const savedTheme = localStorage.getItem('theme-storage');
    let initialTheme = false;
    
    if (savedTheme) {
      try {
        const parsed = JSON.parse(savedTheme);
        initialTheme = parsed.state?.isDark ?? false;
      } catch (error) {
        console.error('Error parsing saved theme:', error);
      }
    } else {
      // Usar preferencia del sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      initialTheme = prefersDark;
    }
    
    // Aplicar tema inicial
    if (initialTheme) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Actualizar store
    setTheme(initialTheme);
  }, [setTheme]);
}; 