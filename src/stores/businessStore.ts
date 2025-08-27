import { create } from 'zustand';
import type { Business, ApiResponse } from '../services/api';
import { apiService } from '../services/api';

interface BusinessState {
  businesses: Business[];
  loading: boolean;
  error: string | null;
  fetchBusinesses: (activeOnly?: boolean) => Promise<void>;
  clearError: () => void;
}

export const useBusinessStore = create<BusinessState>((set) => ({
  businesses: [],
  loading: false,
  error: null,

  fetchBusinesses: async (activeOnly = true) => {
    set({ loading: true, error: null });
    
    try {
      const response: ApiResponse<Business[]> = await apiService.getBusinesses(activeOnly);
      
      if (response.success) {
        set({ 
          businesses: response.data, 
          loading: false,
          error: null 
        });
      } else {
        set({ 
          loading: false, 
          error: response.message || 'Error al obtener los negocios' 
        });
      }
    } catch (error) {
      console.error('Error fetching businesses:', error);
      set({ 
        loading: false, 
        error: 'Error de conexión al obtener los negocios' 
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
})); 