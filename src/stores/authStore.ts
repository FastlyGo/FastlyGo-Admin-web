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
  register: (name: string, email: string, password: string, lastName?: string, phoneNumber?: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

// Tipo combinado
type AuthStore = AuthState & AuthActions;

// Configuración de axios
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7283';

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
          const response = await api.post('/api/Auth/login', {
            email,
            password,
          });

          if (!response.data.success) {
            throw new Error(response.data.message || 'Error al iniciar sesión');
          }

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
        } catch (error: any) {
          let errorMessage = 'Error al iniciar sesión';
          
          if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw new Error(errorMessage);
        }
      },

      register: async (name: string, email: string, password: string, lastName?: string, phoneNumber?: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await api.post('/api/Auth/register', {
            name,
            email,
            password,
            lastName,
            phoneNumber,
          });

          if (!response.data.success) {
            throw new Error(response.data.message || 'Error al registrarse');
          }

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
        } catch (error: any) {
          let errorMessage = 'Error al registrarse';
          
          if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw new Error(errorMessage);
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