import { useThemeStore } from '../stores/themeStore';

export const ThemeToggle = () => {
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-header/20 bg-header/10 hover:bg-header/20 text-header h-10 px-4 py-2"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <span className="text-lg rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0">
          ☀️
        </span>
      ) : (
        <span className="text-lg rotate-90 scale-100 transition-all dark:rotate-90 dark:scale-0">
          🌙
        </span>
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}; 