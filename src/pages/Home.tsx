import { Link } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';

export const Home = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header con toggle de tema */}
        <div className="flex justify-end mb-8">
          <ThemeToggle />
        </div>
        
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-foreground sm:text-5xl md:text-6xl">
            Bienvenido a{' '}
            <span className="text-primary">FastlyGo Admin</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-muted-foreground sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Sistema de administración FastlyGo.
          </p>
          
          <div className="mt-10 flex justify-center space-x-4">
            <Link
              to="/auth/login"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md text-base font-medium transition-colors"
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/auth/register"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-6 py-3 rounded-md text-base font-medium transition-colors"
            >
              Registrarse
            </Link>
          </div>

          {/* Características */}
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-dashboard-card text-dashboard-card-foreground hover:bg-dashboard-card/90 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 border border-border">
              <div className="w-12 h-12 bg-dashboard-card-foreground/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔐</span>
              </div>
              <h3 className="text-lg font-medium text-dashboard-card-foreground mb-2">Administracion de Negocios de la aplicación</h3>
              <p className="text-dashboard-card-foreground/90">
                Sistema de administración de negocios de la aplicación con protección de rutas y manejo de tokens JWT.
              </p>
            </div>

            <div className="bg-dashboard-card text-dashboard-card-foreground hover:bg-dashboard-card/90 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 border border-border">
              <div className="w-12 h-12 bg-dashboard-card-foreground/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚙️</span>
              </div>
              <h3 className="text-lg font-medium text-dashboard-card-foreground mb-2">Gestión de Usuarios</h3>
              <p className="text-dashboard-card-foreground/90">
                Manejo eficiente de los usuarios de la aplicación con protección de rutas y manejo de tokens JWT.
              </p>
            </div>

            <div className="bg-dashboard-card text-dashboard-card-foreground hover:bg-dashboard-card/90 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 border border-border">
              <div className="w-12 h-12 bg-dashboard-card-foreground/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-medium text-dashboard-card-foreground mb-2">Tareas programadas para los distintos negocios</h3>
              <p className="text-dashboard-card-foreground/90">
                Sistema de tareas programadas para los distintos negocios de la aplicación con protección de rutas y manejo de tokens JWT.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 