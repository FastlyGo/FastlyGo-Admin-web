import { useThemeEffect } from './hooks/useThemeEffect';
import { AppRouter } from './routes/AppRouter';

function App() {
  useThemeEffect();

  return (
    <AppRouter />
  );
}

export default App;
