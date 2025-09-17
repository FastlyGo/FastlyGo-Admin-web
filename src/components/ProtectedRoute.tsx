import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import logo from '../assets/images/logo.png';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export const ProtectedRoute = ({
  children,
  requireAuth = true,
  redirectTo = '/auth/login'
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, setLoading } = useAuthStore();
  const location = useLocation();

  // Mostrar pantalla de carga por 3 segundos para que sea visible
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        setLoading(false);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [isLoading, setLoading]);

  // Si está cargando, mostrar un loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-16 w-16 flex items-center justify-center">
              <img
                src={logo}
                alt="FastlyGo Logo"
                className="h-16 w-auto"
              />
            </div>
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-teal-500 border-t-transparent"></div>
              <span className="text-gray-600 font-medium">Verificando acceso...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si requiere autenticación y no está autenticado, redirigir al login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Si no requiere autenticación y está autenticado, redirigir al dashboard
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}; 