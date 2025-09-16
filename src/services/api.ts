// import axios from 'axios';
// import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// // Tipos para la respuesta de la API
// export interface ApiResponse<T = unknown> {
//   success: boolean;
//   message: string;
//   data: T;
//   error?: {
//     type: string;
//     code: string;
//     message: string;
//     details: Array<{
//       field: string;
//       message: string;
//       code: string;
//     }>;
//     sourceService: string;
//   };
//   traceId: string;
// }

// // Type definitions for Business
// export interface Business {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   businessType: number;
//   businessTypeName?: string;
//   description: string;
//   address: string;
//   isActive: boolean;
//   responsibleUserName?: string;
//   createdAt: string;
// }

// // Type definitions for Vehicle
// export interface Vehicle {
//   id: string;
//   vehicleType: number;
//   vehicleTypeName?: string;
//   brand: string;
//   model: string;
//   year: number;
//   plate: string;
//   capacityKg?: number;
//   avgSpeedKmh?: number;
//   fuelCostPerKm?: number;
//   isAvailable?: boolean;
//   conditionStatus?: string;
//   color?: string;
//   vinNumber?: string;
//   insuranceExpiry?: string;
//   maintenanceDueDate?: string;
//   notes?: string;
//   createdAt: string;
// }

// // Vehicle creation/update request interface
// export interface VehicleRequest {
//   vehicleType: number;
//   brand: string;
//   model: string;
//   year: number;
//   plate: string;
//   capacityKg?: number;
//   avgSpeedKmh?: number;
//   fuelCostPerKm?: number;
//   isAvailable?: boolean;
//   conditionStatus?: string;
//   color?: string;
//   vinNumber?: string;
//   insuranceExpiry?: string;
//   maintenanceDueDate?: string;
//   notes?: string;
// }

// // Vehicle Stats interface
// export interface VehicleStats {
//   totalVehicles: number;
//   availableVehicles: number;
//   unavailableVehicles: number;
//   vehiclesByType: Array<{
//     type: number;
//     count: number;
//     typeName?: string;
//   }>;
// }

// export interface Product {
//   id: string;
//   name: string;
//   description: string;
//   categoryId: string;
//   businessId: string;
//   brand: string;
//   isActive: boolean;
//   createdAt: string;
//   category: Category;
//   variants: ProductVariant[];
// }

// export interface Category {
//   id: string;
//   name: string;
//   description: string;
//   isActive: boolean;
//   createdAt: string;
//   businessId: string;
// }

// export interface ProductVariant {
//   id: string;
//   productId: string;
//   name: string;
//   description: string;
//   unitId: string;
//   barcode: string;
//   price: number;
//   stockQuantity: number;
//   isActive: boolean;
//   createdAt: string;
//   unitName: string;
//   toppings: Topping[];
//   images: ProductImage[];
// }

// export interface Topping {
//   id: string;
//   name: string;
//   price: number;
//   imageUrl: string;
// }

// export interface ProductImage {
//   id: string;
//   url: string;
//   imageType: number;
// }

// export interface Location {
//   id: string;
//   businessId: string;
//   name: string;
//   address: string;
//   latitude: number;
//   longitude: number;
//   statusId: number;
//   phone: string;
//   openingHours: string;
//   createdAt: string;
//   schedules: Schedule[];
// }

// export interface Schedule {
//   id: string;
//   dayOfWeek: string;
//   openingTime: string;
//   closingTime: string;
//   isClosed: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface Image {
//   id: string;
//   userId: string;
//   entityId: string;
//   entityType: number;
//   imageType: number;
//   url: string;
//   publicId: string;
//   createdAt: string;
//   updatedAt: string;
//   isActive: boolean;
// }

// export interface Review {
//   id: string;
//   businessId: string;
//   userId: string;
//   comment: string;
//   rating: number;
//   createdAt: string;
// }

// export interface Feature {
//   id: number;
//   businessId: string;
//   name: string;
//   description: string;
//   isAvailable: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

// // Tipos adicionales para los endpoints de Business
// export interface BusinessStats {
//   totalBusinesses: number;
//   activeBusinesses: number;
//   inactiveBusinesses: number;
//   businessesByType: Array<{
//     type: number;
//     count: number;
//     typeName?: string;
//   }>;
// }

// export interface BusinessByTypeRequest {
//   businessType: number;
//   activeOnly?: boolean;
// }

// class ApiService {
//   private api: AxiosInstance;
//   private readonly BASE_URL = 'https://localhost:7283';

//   constructor() {
//     this.api = axios.create({
//       baseURL: this.BASE_URL,
//       timeout: 10000,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     this.setupInterceptors();
//   }

//   private setupInterceptors() {
//     // Request interceptor
//     this.api.interceptors.request.use(
//       (config) => {
//         console.log('🚀 Request:', config.method?.toUpperCase(), config.url);
//         return config;
//       },
//       (error) => {
//         console.error('❌ Request Error:', error);
//         return Promise.reject(error);
//       }
//     );

//     // Response interceptor
//     this.api.interceptors.response.use(
//       (response: AxiosResponse) => {
//         console.log('✅ Response:', response.status, response.config.url);
//         return response;
//       },
//       (error) => {
//         console.error('❌ Response Error:', error.response?.status, error.response?.data);
//         return Promise.reject(error);
//       }
//     );
//   }

//   // Método genérico para hacer peticiones
//   async request<T = unknown>(
//     url: string,
//     config: AxiosRequestConfig = {}
//   ): Promise<ApiResponse<T>> {
//     try {
//       const response = await this.api.request<ApiResponse<T>>({
//         url,
//         ...config,
//       });
//       return response.data;
//     } catch (error: unknown) {
//       console.error('❌ API Error:', error);
//       throw error;
//     }
//   }

//   // Método GET
//   async get<T = unknown>(url: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
//     return this.request<T>(url, {
//       method: 'GET',
//       params,
//     });
//   }

//   // Método POST
//   async post<T = unknown>(url: string, data?: unknown): Promise<ApiResponse<T>> {
//     return this.request<T>(url, {
//       method: 'POST',
//       data,
//     });
//   }

//   // Método PUT
//   async put<T = unknown>(url: string, data?: unknown): Promise<ApiResponse<T>> {
//     return this.request<T>(url, {
//       method: 'PUT',
//       data,
//     });
//   }

//   // Método DELETE
//   async delete<T = unknown>(url: string): Promise<ApiResponse<T>> {
//     return this.request<T>(url, {
//       method: 'DELETE',
//     });
//   }

//   // ==========================================
//   // MÉTODOS PARA BUSINESS ADMINISTRATION
//   // ==========================================

//   /**
//    * GET /api/admin/Business
//    * Obtiene todos los businesses
//    */
//   async getAllBusinesses(params?: { activeOnly?: boolean }): Promise<ApiResponse<Business[]>> {
//     return this.get<Business[]>('/api/admin/Business', params);
//   }

//   /**
//    * GET /api/admin/Business/{id}
//    * Obtiene un business específico por ID
//    */
//   async getBusinessById(id: string): Promise<ApiResponse<Business>> {
//     return this.get<Business>(`/api/admin/Business/${id}`);
//   }

//   /**
//    * PUT /api/admin/Business/{id}
//    * Actualiza un business específico
//    */
//   async updateBusiness(id: string, businessData: Partial<Business>): Promise<ApiResponse<Business>> {
//     return this.put<Business>(`/api/admin/Business/${id}`, businessData);
//   }

//   /**
//    * DELETE /api/admin/Business/{id}
//    * Elimina un business específico
//    */
//   async deleteBusiness(id: string): Promise<ApiResponse<void>> {
//     return this.delete<void>(`/api/admin/Business/${id}`);
//   }

//   /**
//    * POST /api/admin/Business/by-type
//    * Obtiene businesses filtrados por tipo
//    */
//   async getBusinessesByType(requestData: BusinessByTypeRequest): Promise<ApiResponse<Business[]>> {
//     return this.post<Business[]>('/api/admin/Business/by-type', requestData);
//   }

//   /**
//    * GET /api/admin/Business/stats
//    * Obtiene estadísticas de los businesses
//    */
//   async getBusinessStats(): Promise<ApiResponse<BusinessStats>> {
//     return this.get<BusinessStats>('/api/admin/Business/stats');
//   }

//   // ==========================================
//   // MÉTODOS PARA VEHICLE ADMINISTRATION
//   // ==========================================

//   /**
//    * GET /api/admin/Vehicle
//    * Obtiene todos los vehículos
//    */
//   async getAllVehicles(): Promise<ApiResponse<Vehicle[]>> {
//     return this.get<Vehicle[]>('/api/admin/Vehicle');
//   }

//   /**
//    * POST /api/admin/Vehicle
//    * Crea un nuevo vehículo
//    */
//   async createVehicle(vehicleData: VehicleRequest): Promise<ApiResponse<Vehicle>> {
//     return this.post<Vehicle>('/api/admin/Vehicle', vehicleData);
//   }

//   /**
//    * GET /api/admin/Vehicle/{id}
//    * Obtiene un vehículo específico por ID
//    */
//   async getVehicleById(id: string): Promise<ApiResponse<Vehicle>> {
//     return this.get<Vehicle>(`/api/admin/Vehicle/${id}`);
//   }

//   /**
//    * PUT /api/admin/Vehicle/{id}
//    * Actualiza un vehículo específico
//    */
//   async updateVehicle(id: string, vehicleData: Partial<VehicleRequest>): Promise<ApiResponse<Vehicle>> {
//     return this.put<Vehicle>(`/api/admin/Vehicle/${id}`, vehicleData);
//   }

//   /**
//    * DELETE /api/admin/Vehicle/{id}
//    * Elimina un vehículo específico
//    */
//   async deleteVehicle(id: string): Promise<ApiResponse<void>> {
//     return this.delete<void>(`/api/admin/Vehicle/${id}`);
//   }

//   /**
//    * GET /api/admin/Vehicle/by-plate/{plate}
//    * Busca un vehículo por placa
//    */
//   async getVehicleByPlate(plate: string): Promise<ApiResponse<Vehicle>> {
//     return this.get<Vehicle>(`/api/admin/Vehicle/by-plate/${plate}`);
//   }

//   /**
//    * GET /api/admin/Vehicle/by-availability
//    * Obtiene vehículos filtrados por disponibilidad
//    */
//   async getVehiclesByAvailability(available?: boolean): Promise<ApiResponse<Vehicle[]>> {
//     return this.get<Vehicle[]>('/api/admin/Vehicle/by-availability', { available });
//   }

//   /**
//    * GET /api/admin/Vehicle/stats
//    * Obtiene estadísticas de los vehículos
//    */
//   async getVehicleStats(): Promise<ApiResponse<VehicleStats>> {
//     return this.get<VehicleStats>('/api/admin/Vehicle/stats');
//   }
// }

// // Instancia singleton del servicio
// export const apiService = new ApiService();



import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Tipos para la respuesta de la API
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  error?: {
    type: string;
    code: string;
    message: string;
    details: Array<{
      field: string;
      message: string;
      code: string;
    }>;
    sourceService: string;
  };
  traceId: string;
}

// Type definitions for Business
export interface Business {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessType: number;
  businessTypeName?: string;
  description: string;
  logoUrl?: string;
  coverUrl?: string;
  website?: string;
  taxId?: string;
  isActive: boolean;
  responsibleUserName?: string;
  statusName?: string;
  statusId?: number;
  userId?: string;
  createdAt: string;
  updatedAt?: string;
}

// Type definitions for Vehicle
export interface Vehicle {
  id: string;
  vehicleType: number;
  vehicleTypeName?: string;
  brand: string;
  model: string;
  year: number;
  plate: string;
  capacityKg?: number;
  avgSpeedKmh?: number;
  fuelCostPerKm?: number;
  isAvailable?: boolean;
  conditionStatus?: string;
  color?: string;
  vinNumber?: string;
  insuranceExpiry?: string;
  maintenanceDueDate?: string;
  notes?: string;
  createdAt: string;
}

// Vehicle creation/update request interface
export interface VehicleRequest {
  vehicleType: number;
  brand: string;
  model: string;
  year: number;
  plate: string;
  capacityKg?: number;
  avgSpeedKmh?: number;
  fuelCostPerKm?: number;
  isAvailable?: boolean;
  conditionStatus?: string;
  color?: string;
  vinNumber?: string;
  insuranceExpiry?: string;
  maintenanceDueDate?: string;
  notes?: string;
}

// Type definitions for Vehicle Assignment
export interface VehicleAssignment {
  id: string;
  deliveryPersonName: string;
  vehicleModel: string;
  vehiclePlate: string;
  assignedAt: string;
  assignmentStatus: number;
  assignmentStatusName: string;
  registrationDate: string;
  deliveryPersonId?: string;
  vehicleId?: string;
  assignmentReason?: string;
  comments?: string;
  conditionAtAssignment?: string;
  mileageAtAssignment?: number;
  assignedBy?: string;
}

// Vehicle Assignment creation/update request interface
export interface VehicleAssignmentRequest {
  deliveryPersonId: string;
  vehicleId: string;
  assignmentStatus: number;
  assignedAt: string;
  assignmentReason?: string;
  comments?: string;
  conditionAtAssignment?: string;
  mileageAtAssignment?: number;
  assignedBy?: string;
}

//Vehicle Assignment Stats interface
export interface VehicleAssignmentStats {
  totalAssignments: number;
  activeAssignments: number;
  returnedAssignments: number;
  assignmentsByStatus: Array<{
    status: number;
    count: number;
    statusName?: string;
  }>;
}

// Vehicle Stats interface
export interface VehicleStats {
  totalVehicles: number;
  availableVehicles: number;
  unavailableVehicles: number;
  vehiclesByType: Array<{
    type: number;
    count: number;
    typeName?: string;
  }>;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  businessId: string;
  brand: string;
  isActive: boolean;
  createdAt: string;
  category: Category;
  variants: ProductVariant[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  businessId: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  description: string;
  unitId: string;
  barcode: string;
  price: number;
  stockQuantity: number;
  isActive: boolean;
  createdAt: string;
  unitName: string;
  toppings: Topping[];
  images: ProductImage[];
}

export interface Topping {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

export interface ProductImage {
  id: string;
  url: string;
  imageType: number;
}

export interface Location {
  id: string;
  businessId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  statusId: number;
  phone: string;
  openingHours: string;
  createdAt: string;
  schedules: Schedule[];
}

export interface Schedule {
  id: string;
  dayOfWeek: string;
  openingTime: string;
  closingTime: string;
  isClosed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Image {
  id: string;
  userId: string;
  entityId: string;
  entityType: number;
  imageType: number;
  url: string;
  publicId: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface Review {
  id: string;
  businessId: string;
  userId: string;
  comment: string;
  rating: number;
  createdAt: string;
}

export interface Feature {
  id: number;
  businessId: string;
  name: string;
  description: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

// Tipos adicionales para los endpoints de Business
export interface BusinessStats {
  totalBusinesses: number;
  activeBusinesses: number;
  inactiveBusinesses: number;
  businessesByType: Array<{
    type: number;
    count: number;
    typeName?: string;
  }>;
}

export interface BusinessByTypeRequest {
  businessType: number;
  activeOnly?: boolean;
}

// Business creation request interface
export interface CreateBusinessRequest {
  name: string;
  description: string;
  email: string;
  phone: string;
  website: string;
  taxId: string;
  businessType: number;
  userId: string;
  statusId?: number;
  logoUrl?: string;
  coverUrl?: string;
  cloudinaryPublicId?: string;
}

// Type definitions for User
export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  isActive: boolean;
  roles: string[];
  totalOrders?: number;
  lastOrderDate?: string | null;
  createdAt: string;
  updatedAt?: string;
}

// Type definition for Merchant Users
export interface MerchantUser {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
}

// User registration request interface
export interface UserRegisterRequest {
  productCode: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  planId: string;
  profileImage?: File;
  roles?: string[];
}

// User stats interface
export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  pausedUsers: number;
  pendingUsers: number;
}

// Pagination interfaces
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Franchise Report interfaces
export interface FranchiseReportData {
  business: {
    id: string;
    name: string;
    businessType: string;
  };
  metrics: {
    totalSales: string;
    totalOrders: number;
    uniqueCustomers: number;
    averagePerDay: string;
    trend: string;
  };
  chartData: Array<{
    label: string;
    value: number;
    displayValue: string;
  }>;
  recentTransactions: Array<{
    date: string;
    product: string;
    category: string;
    quantity: number;
    price: string;
    total: string;
  }>;
  period: {
    startDate: string;
    endDate: string;
  };
}

export interface BusinessForReport {
  id: string;
  name: string;
  businessTypeName: string;
  isActive: boolean;
}

// Delivery Person interfaces
export interface DeliveryPerson {
  id: string;
  userId: string;
  userName: string;
  email: string;
  licenseNumber: string;
  licenseExpiryDate: string;
  rating?: number;
  maxActiveDeliveries: number;
  currentLat?: number;
  currentLng?: number;
  isActive: boolean;
  isOnline: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateDeliveryPersonRequest {
  userId: string;
  licenseNumber: string;
  licenseExpiryDate: string;
  rating?: number;
  maxActiveDeliveries: number;
  currentLat?: number;
  currentLng?: number;
  isActive: boolean;
  isOnline: boolean;
}

export interface UpdateDeliveryPersonRequest {
  licenseNumber: string;
  licenseExpiryDate: string;
  rating?: number;
  maxActiveDeliveries: number;
  currentLat?: number;
  currentLng?: number;
  isActive: boolean;
  isOnline: boolean;
}

// Banner interfaces
export interface Banner {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  actionUrl?: string;
  businessId?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  priority: number;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  cloudinaryPublicId?: string;
}

export interface CreateBannerRequest {
  title: string;
  description?: string;
  actionUrl?: string;
  businessId?: string;
  startDate: string;
  endDate: string;
  priority: number;
  imageFile: File;
}

export interface UpdateBannerRequest {
  id: string;
  title: string;
  description?: string;
  actionUrl?: string;
  businessId?: string;
  startDate: string;
  endDate: string;
  priority: number;
  imageFile?: File;
}

export interface BannerStats {
  totalBanners: number;
  activeBanners: number;
  inactiveBanners: number;
  currentActiveBanners: number;
  expiredBanners: number;
  scheduledBanners: number;
}

class ApiService {
  private api: AxiosInstance;
  private readonly BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7283';

  constructor() {
    this.api = axios.create({
      baseURL: this.BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        console.log('🚀 Request:', config.method?.toUpperCase(), config.url);
        
        // Obtener token del localStorage
        const token = localStorage.getItem('auth-token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log('✅ Response:', response.status, response.config.url);
        console.log('📊 Response Data:', response.data);
        return response;
      },
      (error) => {
        console.error('❌ Response Error:', error.response?.status, error.response?.data);
        console.error('❌ Full Error:', error);
        
        // Si hay error 401, limpiar token y redirigir al login
        if (error.response?.status === 401) {
          localStorage.removeItem('auth-token');
          window.location.href = '/login';
        }
        
        return Promise.reject(error);
      }
    );
  }

  // Método genérico para hacer peticiones
  async request<T = unknown>(
    url: string,
    config: AxiosRequestConfig = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.request<ApiResponse<T>>({
        url,
        ...config,
      });
      return response.data;
    } catch (error: unknown) {
      console.error('❌ API Error:', error);
      throw error;
    }
  }

  // Método GET
  async get<T = unknown>(url: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'GET',
      params,
    });
  }

  // Método POST
  async post<T = unknown>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'POST',
      data,
    });
  }

  // Método PUT
  async put<T = unknown>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'PUT',
      data,
    });
  }

  // Método DELETE
  async delete<T = unknown>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'DELETE',
    });
  }

  // ==========================================
  // MÉTODOS PARA BUSINESS ADMINISTRATION
  // ==========================================

  /**
   * GET /api/admin/Business
   * Obtiene todos los businesses
   */
  async getAllBusinesses(params?: { activeOnly?: boolean }): Promise<ApiResponse<Business[]>> {
    return this.get<Business[]>('/api/admin/Business', params);
  }

  /**
   * POST /api/admin/Business
   * Crea un nuevo business
   */
  async createBusiness(businessData: CreateBusinessRequest): Promise<ApiResponse<Business>> {
    return this.post<Business>('/api/admin/Business', businessData);
  }

  /**
   * GET /api/admin/Business/{id}
   * Obtiene un business específico por ID
   */
  async getBusinessById(id: string): Promise<ApiResponse<Business>> {
    return this.get<Business>(`/api/admin/Business/${id}`);
  }

  /**
   * PUT /api/admin/Business/{id}
   * Actualiza un business específico
   */
  async updateBusiness(id: string, businessData: Partial<Business>): Promise<ApiResponse<Business>> {
    return this.put<Business>(`/api/admin/Business/${id}`, businessData);
  }

  /**
   * DELETE /api/admin/Business/{id}
   * Elimina un business específico
   */
  async deleteBusiness(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/api/admin/Business/${id}`);
  }

  /**
   * POST /api/admin/Business/by-type
   * Obtiene businesses filtrados por tipo
   */
  async getBusinessesByType(requestData: BusinessByTypeRequest): Promise<ApiResponse<Business[]>> {
    return this.post<Business[]>('/api/admin/Business/by-type', requestData);
  }

  /**
   * GET /api/admin/Business/stats
   * Obtiene estadísticas de los businesses
   */
  async getBusinessStats(): Promise<ApiResponse<BusinessStats>> {
    return this.get<BusinessStats>('/api/admin/Business/stats');
  }

  // ==========================================
  // MÉTODOS PARA VEHICLE ADMINISTRATION
  // ==========================================

  /**
   * GET /api/admin/Vehicle
   * Obtiene todos los vehículos
   */
  async getAllVehicles(): Promise<ApiResponse<Vehicle[]>> {
    return this.get<Vehicle[]>('/api/admin/Vehicle');
  }

  /**
   * POST /api/admin/Vehicle
   * Crea un nuevo vehículo
   */
  async createVehicle(vehicleData: VehicleRequest): Promise<ApiResponse<Vehicle>> {
    return this.post<Vehicle>('/api/admin/Vehicle', vehicleData);
  }

  /**
   * GET /api/admin/Vehicle/{id}
   * Obtiene un vehículo específico por ID
   */
  async getVehicleById(id: string): Promise<ApiResponse<Vehicle>> {
    return this.get<Vehicle>(`/api/admin/Vehicle/${id}`);
  }

  /**
   * PUT /api/admin/Vehicle/{id}
   * Actualiza un vehículo específico
   */
  async updateVehicle(id: string, vehicleData: Partial<VehicleRequest>): Promise<ApiResponse<Vehicle>> {
    return this.put<Vehicle>(`/api/admin/Vehicle/${id}`, vehicleData);
  }

  /**
   * DELETE /api/admin/Vehicle/{id}
   * Elimina un vehículo específico
   */
  async deleteVehicle(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/api/admin/Vehicle/${id}`);
  }

  /**
   * GET /api/admin/Vehicle/by-plate/{plate}
   * Busca un vehículo por placa
   */
  async getVehicleByPlate(plate: string): Promise<ApiResponse<Vehicle>> {
    return this.get<Vehicle>(`/api/admin/Vehicle/by-plate/${plate}`);
  }

  /**
   * GET /api/admin/Vehicle/by-availability
   * Obtiene vehículos filtrados por disponibilidad
   */
  async getVehiclesByAvailability(available?: boolean): Promise<ApiResponse<Vehicle[]>> {
    return this.get<Vehicle[]>('/api/admin/Vehicle/by-availability', { available });
  }

  /**
   * GET /api/admin/Vehicle/stats
   * Obtiene estadísticas de los vehículos
   */
  async getVehicleStats(): Promise<ApiResponse<VehicleStats>> {
    return this.get<VehicleStats>('/api/admin/Vehicle/stats');
  }

  // ==========================================
  // MÉTODOS PARA VEHICLE ASSIGNMENT ADMINISTRATION
  // ==========================================

  /**
   * GET /api/admin/VehicleAssignment
   * Obtiene todas las asignaciones de vehículos
   */
  async getAllVehicleAssignments(): Promise<ApiResponse<VehicleAssignment[]>> {
    return this.get<VehicleAssignment[]>('/api/admin/VehicleAssignment');
  }

  /**
   * POST /api/admin/VehicleAssignment
   * Crea una nueva asignación de vehículo
   */
  async createVehicleAssignment(assignmentData: VehicleAssignmentRequest): Promise<ApiResponse<VehicleAssignment>> {
    return this.post<VehicleAssignment>('/api/admin/VehicleAssignment', assignmentData);
  }

  /**
   * GET /api/admin/VehicleAssignment/{id}
   * Obtiene una asignación específica por ID
   */
  async getVehicleAssignmentById(id: string): Promise<ApiResponse<VehicleAssignment>> {
    return this.get<VehicleAssignment>(`/api/admin/VehicleAssignment/${id}`);
  }

  /**
   * PUT /api/admin/VehicleAssignment/{id}
   * Actualiza una asignación específica
   */
  async updateVehicleAssignment(id: string, assignmentData: Partial<VehicleAssignmentRequest>): Promise<ApiResponse<VehicleAssignment>> {
    return this.put<VehicleAssignment>(`/api/admin/VehicleAssignment/${id}`, assignmentData);
  }

  /**
   * DELETE /api/admin/VehicleAssignment/{id}
   * Elimina una asignación específica
   */
  async deleteVehicleAssignment(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/api/admin/VehicleAssignment/${id}`);
  }

  /**
   * GET /api/admin/VehicleAssignment/by-status/{status}
   * Obtiene asignaciones filtradas por estado
   */
  async getVehicleAssignmentsByStatus(status: number): Promise<ApiResponse<VehicleAssignment[]>> {
    return this.get<VehicleAssignment[]>(`/api/admin/VehicleAssignment/by-status/${status}`);
  }

  /**
   * GET /api/admin/VehicleAssignment/by-delivery-person-and-plate/{deliveryPersonId}/{plate}
   * Obtiene asignaciones por persona de entrega y placa
   */
  async getVehicleAssignmentByDeliveryPersonAndPlate(
    deliveryPersonId: string, 
    plate: string
  ): Promise<ApiResponse<VehicleAssignment[]>> {
    return this.get<VehicleAssignment[]>(`/api/admin/VehicleAssignment/by-delivery-person-and-plate/${deliveryPersonId}/${plate}`);
  }

  /**
   * GET /api/admin/VehicleAssignment/stats
   * Obtiene estadísticas de las asignaciones de vehículos
   */
  async getVehicleAssignmentStats(): Promise<ApiResponse<VehicleAssignmentStats>> {
    return this.get<VehicleAssignmentStats>('/api/admin/VehicleAssignment/stats');
  }

  // ==========================================
  // MÉTODOS PARA USER ADMINISTRATION
  // ==========================================

  /**
   * GET /api/admin/UserControllerPaginated/paginated
   * Obtiene todos los usuarios con paginación
   */
  async getAllUsers(params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<User> | User[]>> {
    return this.get<PaginatedResponse<User> | User[]>('/api/admin/UserControllerPaginated/paginated', params);
  }

  /**
   * POST /api/admin/User
   * Registra un nuevo usuario
   */
  async registerUser(userData: UserRegisterRequest): Promise<ApiResponse<User>> {
    const formData = new FormData();
    formData.append('ProductCode', userData.productCode);
    formData.append('Email', userData.email);
    formData.append('Password', userData.password);
    formData.append('FirstName', userData.firstName);
    formData.append('LastName', userData.lastName);
    if (userData.phoneNumber) {
      formData.append('PhoneNumber', userData.phoneNumber);
    }
    formData.append('PlanId', userData.planId);
    if (userData.profileImage) {
      formData.append('ProfileImage', userData.profileImage);
    }
    if (userData.roles && userData.roles.length > 0) {
      userData.roles.forEach((role, index) => {
        formData.append(`Roles[${index}]`, role);
      });
    }

    return this.request<User>('/api/admin/User/register', {
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * GET /api/admin/User/{id}
   * Obtiene un usuario específico por ID
   */
  async getUserById(id: string): Promise<ApiResponse<User>> {
    return this.get<User>(`/api/admin/User/${id}`);
  }

  /**
   * PUT /api/admin/User/{id}
   * Actualiza un usuario específico
   */
  async updateUser(id: string, userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.put<User>(`/api/admin/User/${id}`, userData);
  }

  /**
   * DELETE /api/admin/User/{id}
   * Elimina un usuario específico
   */
  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/api/admin/User/${id}`);
  }

  /**
   * GET /api/admin/UserControllerPaginated/stats
   * Obtiene estadísticas de los usuarios
   */
  async getUserStats(): Promise<ApiResponse<UserStats>> {
    return this.get<UserStats>('/api/admin/UserControllerPaginated/stats');
  }

  /**
   * GET /api/admin/User/merchants
   * Obtiene usuarios con roles merchant y admin_merchant
   */
  async getMerchantUsers(): Promise<ApiResponse<MerchantUser[]>> {
    return this.get<MerchantUser[]>('/api/admin/User/merchants');
  }

  // ==========================================
  // MÉTODOS PARA FRANCHISE REPORT
  // ==========================================

  /**
   * GET /api/admin/FranchiseReport/{businessId}
   * Obtiene el reporte de ventas de una franquicia
   */
  async getFranchiseSalesReport(
    businessId: string,
    startDate?: string,
    endDate?: string
  ): Promise<ApiResponse<FranchiseReportData>> {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    return this.get<FranchiseReportData>(`/api/admin/FranchiseReport/${businessId}`, params);
  }

  /**
   * GET /api/admin/FranchiseReport/businesses
   * Obtiene la lista de franquicias para reportes
   */
  async getBusinessesForReports(): Promise<ApiResponse<BusinessForReport[]>> {
    return this.get<BusinessForReport[]>('/api/admin/FranchiseReport/businesses');
  }

  // ==========================================
  // MÉTODOS PARA DELIVERY PERSON
  // ==========================================

  /**
   * GET /api/admin/DeliveryPerson
   * Obtiene todos los delivery persons con paginación
   */
  async getAllDeliveryPersons(params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<DeliveryPerson> | DeliveryPerson[]>> {
    return this.get<PaginatedResponse<DeliveryPerson> | DeliveryPerson[]>('/api/admin/DeliveryPerson', params);
  }

  /**
   * POST /api/admin/DeliveryPerson
   * Crea un nuevo delivery person
   */
  async createDeliveryPerson(deliveryPersonData: CreateDeliveryPersonRequest): Promise<ApiResponse<DeliveryPerson>> {
    return this.post<DeliveryPerson>('/api/admin/DeliveryPerson', deliveryPersonData);
  }

  /**
   * GET /api/admin/DeliveryPerson/{id}
   * Obtiene un delivery person específico por ID
   */
  async getDeliveryPersonById(id: string): Promise<ApiResponse<DeliveryPerson>> {
    return this.get<DeliveryPerson>(`/api/admin/DeliveryPerson/${id}`);
  }

  /**
   * PUT /api/admin/DeliveryPerson/{id}
   * Actualiza un delivery person específico
   */
  async updateDeliveryPerson(id: string, deliveryPersonData: UpdateDeliveryPersonRequest): Promise<ApiResponse<DeliveryPerson>> {
    return this.put<DeliveryPerson>(`/api/admin/DeliveryPerson/${id}`, deliveryPersonData);
  }

  // ==========================================
  // MÉTODOS PARA BANNERS (PROMOTIONS)
  // ==========================================

  /**
   * GET /api/Banners/paginated
   * Obtiene todos los banners con paginación
   */
  async getAllBanners(params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Banner> | Banner[]>> {
    return this.get<PaginatedResponse<Banner> | Banner[]>('/api/Banners/paginated', params);
  }

  /**
   * GET /api/Banners/stats
   * Obtiene estadísticas de los banners
   */
  async getBannerStats(): Promise<ApiResponse<BannerStats>> {
    return this.get<BannerStats>('/api/Banners/stats');
  }

  /**
   * GET /api/Banners/{id}
   * Obtiene un banner específico por ID
   */
  async getBannerById(id: string): Promise<ApiResponse<Banner>> {
    return this.get<Banner>(`/api/Banners/${id}`);
  }

  /**
   * POST /api/Banners
   * Crea un nuevo banner
   */
  async createBanner(bannerData: CreateBannerRequest): Promise<ApiResponse<Banner>> {
    const formData = new FormData();
    formData.append('Title', bannerData.title);
    if (bannerData.description) {
      formData.append('Description', bannerData.description);
    }
    if (bannerData.actionUrl) {
      formData.append('ActionUrl', bannerData.actionUrl);
    }
    if (bannerData.businessId) {
      formData.append('BusinessId', bannerData.businessId);
    }
    formData.append('StartDate', bannerData.startDate);
    formData.append('EndDate', bannerData.endDate);
    formData.append('Priority', bannerData.priority.toString());
    formData.append('ImageFile', bannerData.imageFile);

    return this.request<Banner>('/api/Banners', {
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * PUT /api/Banners/{id}
   * Actualiza un banner específico
   */
  async updateBanner(id: string, bannerData: UpdateBannerRequest): Promise<ApiResponse<Banner>> {
    const formData = new FormData();
    formData.append('Id', bannerData.id);
    formData.append('Title', bannerData.title);
    if (bannerData.description) {
      formData.append('Description', bannerData.description);
    }
    if (bannerData.actionUrl) {
      formData.append('ActionUrl', bannerData.actionUrl);
    }
    if (bannerData.businessId) {
      formData.append('BusinessId', bannerData.businessId);
    }
    formData.append('StartDate', bannerData.startDate);
    formData.append('EndDate', bannerData.endDate);
    formData.append('Priority', bannerData.priority.toString());
    if (bannerData.imageFile) {
      formData.append('ImageFile', bannerData.imageFile);
    }

    return this.request<Banner>(`/api/Banners/${id}`, {
      method: 'PUT',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * DELETE /api/Banners/{id}
   * Elimina un banner específico
   */
  async deleteBanner(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/api/Banners/${id}`);
  }

  /**
   * GET /api/Banners/active
   * Obtiene banners activos actuales
   */
  async getActiveBanners(): Promise<ApiResponse<Banner[]>> {
    return this.get<Banner[]>('/api/Banners/active');
  }

  /**
   * POST /api/Banners/disable-expired
   * Deshabilita banners expirados
   */
  async disableExpiredBanners(): Promise<ApiResponse<{ message: string; count: number }>> {
    return this.post<{ message: string; count: number }>('/api/Banners/disable-expired');
  }
}

// Instancia singleton del servicio
export const apiService = new ApiService();

// Aliases para compatibilidad con el businessStore
export const api = {
  getBusinesses: (activeOnly?: boolean) => apiService.getAllBusinesses({ activeOnly }),
  getBusiness: (id: string) => apiService.getBusinessById(id),
  createBusiness: (businessData: CreateBusinessRequest) => apiService.createBusiness(businessData),
  updateBusiness: (id: string, businessData: Partial<CreateBusinessRequest>) => apiService.updateBusiness(id, businessData),
  deleteBusiness: (id: string) => apiService.deleteBusiness(id),
};