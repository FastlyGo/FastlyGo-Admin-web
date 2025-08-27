import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

// Tipos para el usuario
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

// Tipos para el estado de autenticación
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Tipos para las acciones
interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

// Tipo combinado
type AuthStore = AuthState & AuthActions;

// Configuración de axios
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Instancia de axios con interceptores
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Estado inicial
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Acciones
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // SIMULACIÓN DE LOGIN - Para pruebas
          // Comentar las siguientes líneas para usar el backend real
          await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay
          
          // Datos simulados de usuario
          const mockUser = {
            id: '1',
            email: email,
            name: 'Manuel Perez',
            role: 'admin'
          };
          
          // Usar password para validación básica (opcional)
          if (password.length < 3) {
            throw new Error('Contraseña muy corta');
          }
          
          const mockToken = 'mock-jwt-token-' + Date.now();
          
          // Guardar token en localStorage
          localStorage.setItem('auth-token', mockToken);
          
          set({
            user: mockUser,
            token: mockToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          
          // DESCOMENTAR LAS SIGUIENTES LÍNEAS PARA USAR EL BACKEND REAL
          /*
          const response = await api.post('/auth/login', {
            email,
            password,
          });

          const { user, token } = response.data;
          
          // Guardar token en localStorage
          localStorage.setItem('auth-token', token);
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          */
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Error al iniciar sesión';
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await api.post('/auth/register', {
            name,
            email,
            password,
          });

          const { user, token } = response.data;
          
          // Guardar token en localStorage
          localStorage.setItem('auth-token', token);
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Error al registrarse';
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('auth-token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Exportar la instancia de axios para uso en otros componentes
export { api }; 