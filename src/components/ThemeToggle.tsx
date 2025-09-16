import { useThemeStore } from '../stores/themeStore';

export const ThemeToggle = () => {
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-lg bg-white/15 border border-white/30 hover:bg-white/25 transition-all duration-200 backdrop-blur-sm"
      aria-label="Toggle theme"
    >
      {isDark ? (
        // Sol estilizado para modo oscuro
        <svg className="w-5 h-5 text-white transition-transform duration-300 hover:rotate-90" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          <circle cx="12" cy="12" r="1.5" opacity="0.8"/>
          <circle cx="12" cy="12" r="0.8" opacity="0.9" fill="white"/>
        </svg>
      ) : (
        // Luna estilizada para modo claro
        <svg className="w-5 h-5 text-white transition-transform duration-300 hover:-rotate-12" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.019 2.058c-5.477 0-9.961 4.484-9.961 9.961 0 5.477 4.484 9.961 9.961 9.961 1.42 0 2.77-.297 3.996-.832-2.128-.84-3.626-2.95-3.626-5.411 0-3.214 2.606-5.82 5.82-5.82 1.035 0 2.006.27 2.851.744C19.775 5.668 16.174 2.058 12.019 2.058z"/>
          <circle cx="19" cy="6" r="0.8" opacity="0.8"/>
          <circle cx="16.5" cy="4.5" r="0.4" opacity="0.6"/>
          <circle cx="20.5" cy="8.5" r="0.5" opacity="0.7"/>
        </svg>
      )}
    </button>
  );
}; 