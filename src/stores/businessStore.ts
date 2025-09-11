import { create } from 'zustand';
import type { Business, ApiResponse, CreateBusinessRequest } from '../services/api';
import { api } from '../services/api';

interface BusinessState {
  businesses: Business[];
  loading: boolean;
  error: string | null;
  selectedBusiness: Business | null;
  fetchBusinesses: (activeOnly?: boolean) => Promise<void>;
  createBusiness: (businessData: CreateBusinessRequest) => Promise<Business>;
  updateBusiness: (id: string, businessData: Partial<CreateBusinessRequest>) => Promise<Business>;
  deleteBusiness: (id: string) => Promise<void>;
  getBusiness: (id: string) => Promise<Business | null>;
  setSelectedBusiness: (business: Business | null) => void;
  clearError: () => void;
}

export const useBusinessStore = create<BusinessState>((set, get) => ({
  businesses: [],
  loading: false,
  error: null,
  selectedBusiness: null,

  fetchBusinesses: async (activeOnly = false) => {
    set({ loading: true, error: null });
    
    try {
      const response: ApiResponse<Business[]> = await api.getBusinesses(activeOnly);
      
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

  createBusiness: async (businessData: CreateBusinessRequest) => {
    set({ loading: true, error: null });
    
    try {
      const response: ApiResponse<Business> = await api.createBusiness(businessData);
      
      if (response.success) {
        const newBusiness = response.data;
        set(state => ({ 
          businesses: [...state.businesses, newBusiness],
          loading: false,
          error: null
        }));
        return newBusiness;
      } else {
        set({ 
          loading: false, 
          error: response.message || 'Error al crear el negocio' 
        });
        throw new Error(response.message || 'Error al crear el negocio');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión al crear el negocio';
      set({ 
        loading: false, 
        error: errorMessage 
      });
      throw error;
    }
  },

  updateBusiness: async (id: string, businessData: Partial<CreateBusinessRequest>) => {
    set({ loading: true, error: null });
    
    try {
      const response: ApiResponse<Business> = await api.updateBusiness(id, businessData);
      
      if (response.success) {
        const updatedBusiness = response.data;
        set(state => ({
          businesses: state.businesses.map(b => 
            b.id === id ? updatedBusiness : b
          ),
          selectedBusiness: state.selectedBusiness?.id === id ? updatedBusiness : state.selectedBusiness,
          loading: false,
          error: null
        }));
        return updatedBusiness;
      } else {
        set({ 
          loading: false, 
          error: response.message || 'Error al actualizar el negocio' 
        });
        throw new Error(response.message || 'Error al actualizar el negocio');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión al actualizar el negocio';
      set({ 
        loading: false, 
        error: errorMessage 
      });
      throw error;
    }
  },

  deleteBusiness: async (id: string) => {
    set({ loading: true, error: null });
    
    try {
      const response: ApiResponse<null> = await api.deleteBusiness(id);
      
      if (response.success) {
        set(state => ({
          businesses: state.businesses.filter(b => b.id !== id),
          selectedBusiness: state.selectedBusiness?.id === id ? null : state.selectedBusiness,
          loading: false,
          error: null
        }));
      } else {
        set({ 
          loading: false, 
          error: response.message || 'Error al eliminar el negocio' 
        });
        throw new Error(response.message || 'Error al eliminar el negocio');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión al eliminar el negocio';
      set({ 
        loading: false, 
        error: errorMessage 
      });
      throw error;
    }
  },

  getBusiness: async (id: string) => {
    set({ loading: true, error: null });
    
    try {
      const response: ApiResponse<Business> = await api.getBusiness(id);
      
      if (response.success) {
        set({ 
          selectedBusiness: response.data,
          loading: false,
          error: null 
        });
        return response.data;
      } else {
        set({ 
          loading: false, 
          error: response.message || 'Error al obtener el negocio' 
        });
        return null;
      }
    } catch (error) {
      console.error('Error fetching business:', error);
      set({ 
        loading: false, 
        error: 'Error de conexión al obtener el negocio' 
      });
      return null;
    }
  },

  setSelectedBusiness: (business: Business | null) => {
    set({ selectedBusiness: business });
  },

  clearError: () => {
    set({ error: null });
  },
})); 