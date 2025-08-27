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
  address: string;
  isActive: boolean;
  responsibleUserName?: string;
  createdAt: string;
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

class ApiService {
  private api: AxiosInstance;
  private readonly BASE_URL = 'https://localhost:7283';

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
        return response;
      },
      (error) => {
        console.error('❌ Response Error:', error.response?.status, error.response?.data);
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
}

// Instancia singleton del servicio
export const apiService = new ApiService();