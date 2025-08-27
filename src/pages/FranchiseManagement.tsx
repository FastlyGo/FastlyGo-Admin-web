// import React, { useState, useEffect, useCallback } from 'react';
// import { ArrowLeft, Search, Plus, Edit2, Trash2 } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { apiService } from '../services/api';
// import type { Business as ApiBusiness, Vehicle } from '../services/api';
// import type { Business as ModalBusiness } from '../types/business';
// import BusinessModal from '../pages/BusinessModal';

// // Tipos simples para estadísticas locales
// interface LocalBusinessStats {
//   activeBusinesses: number;
//   inactiveBusinesses: number;
//   suspendedBusinesses: number;
// }

// interface LocalVehicleStats {
//   totalVehicles: number;
//   availableVehicles: number;
//   unavailableVehicles: number;
// }

// const FranchiseManagement: React.FC = () => {
//   const navigate = useNavigate();
  
//   type TabType = 'franchise' | 'delivery' | 'vehicles' | 'assignment';
  
//   const [activeTab, setActiveTab] = useState<TabType>('franchise');
  
//   // Business states
//   const [businesses, setBusinesses] = useState<ApiBusiness[]>([]);
//   const [filteredBusinesses, setFilteredBusinesses] = useState<ApiBusiness[]>([]);
//   const [businessStats, setBusinessStats] = useState<LocalBusinessStats>({
//     activeBusinesses: 0,
//     inactiveBusinesses: 0,
//     suspendedBusinesses: 0
//   });
  
//   // Vehicle states
//   const [vehicles, setVehicles] = useState<Vehicle[]>([]);
//   const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
//   const [vehicleStats, setVehicleStats] = useState<LocalVehicleStats>({
//     totalVehicles: 0,
//     availableVehicles: 0,
//     unavailableVehicles: 0
//   });
  
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingBusiness, setEditingBusiness] = useState<ModalBusiness | null>(null);

//   const itemsPerPage = 10;

//   // Filtrar businesses
//   const filterBusinesses = useCallback(() => {
//     if (!searchTerm) {
//       setFilteredBusinesses(businesses);
//     } else {
//       const filtered = businesses.filter(business =>
//         business.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         business.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         business.responsibleUserName?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setFilteredBusinesses(filtered);
//     }
//     setCurrentPage(1);
//   }, [searchTerm, businesses]);

//   // Filtrar vehículos
//   const filterVehicles = useCallback(() => {
//     if (!searchTerm) {
//       setFilteredVehicles(vehicles);
//     } else {
//       const filtered = vehicles.filter(vehicle =>
//         vehicle.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         vehicle.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         vehicle.plate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         vehicle.vehicleTypeName?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setFilteredVehicles(filtered);
//     }
//     setCurrentPage(1);
//   }, [searchTerm, vehicles]);

//   const loadBusinesses = async () => {
//     setIsLoading(true);
//     try {
//       console.log('Loading businesses...');
      
//       if (typeof apiService.get !== 'function') {
//         console.error('get method not available on apiService');
//         throw new Error('get method not found on apiService');
//       }
      
//       const response = await apiService.get<ApiBusiness[]>('/api/admin/Business', { activeOnly: false });
      
//       console.log('API Response:', response);
      
//       if (response.success && response.data) {
//         setBusinesses(response.data);
//         setFilteredBusinesses(response.data);
        
//         // Calcular estadísticas simples desde los datos
//         const activeCount = response.data.filter(b => b.isActive).length;
//         const inactiveCount = response.data.filter(b => !b.isActive).length;
        
//         setBusinessStats({
//           activeBusinesses: activeCount,
//           inactiveBusinesses: inactiveCount,
//           suspendedBusinesses: 0
//         });
        
//         console.log('Businesses loaded successfully:', response.data.length);
//       } else {
//         console.error('API response not successful:', response);
//         setBusinesses([]);
//         setFilteredBusinesses([]);
//       }
//     } catch (error) {
//       console.error('Error loading businesses:', error);
//       setBusinesses([]);
//       setFilteredBusinesses([]);
//       alert(`Error loading businesses: ${error instanceof Error ? error.message : 'Unknown error'}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const loadVehicles = async () => {
//     setIsLoading(true);
//     try {
//       console.log('Loading vehicles...');
      
//       if (typeof apiService.get !== 'function') {
//         console.error('get method not available on apiService');
//         throw new Error('get method not found on apiService');
//       }
      
//       const response = await apiService.get<Vehicle[]>('/api/admin/Vehicle');
      
//       console.log('Vehicle API Response:', response);
      
//       if (response.success && response.data) {
//         setVehicles(response.data);
//         setFilteredVehicles(response.data);
        
//         // Calcular estadísticas simples desde los datos
//         const availableCount = response.data.filter(v => v.isAvailable).length;
//         const unavailableCount = response.data.filter(v => !v.isAvailable).length;
        
//         setVehicleStats({
//           totalVehicles: response.data.length,
//           availableVehicles: availableCount,
//           unavailableVehicles: unavailableCount
//         });
        
//         console.log('Vehicles loaded successfully:', response.data.length);
//       } else {
//         console.error('Vehicle API response not successful:', response);
//         setVehicles([]);
//         setFilteredVehicles([]);
//       }
//     } catch (error) {
//       console.error('Error loading vehicles:', error);
//       setVehicles([]);
//       setFilteredVehicles([]);
//       alert(`Error loading vehicles: ${error instanceof Error ? error.message : 'Unknown error'}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (activeTab === 'franchise') {
//       loadBusinesses();
//     } else if (activeTab === 'vehicles') {
//       loadVehicles();
//     }
//   }, [activeTab]);

//   useEffect(() => {
//     if (activeTab === 'franchise') {
//       filterBusinesses();
//     } else if (activeTab === 'vehicles') {
//       filterVehicles();
//     }
//   }, [filterBusinesses, filterVehicles, activeTab]);

//   const handleEdit = (business: ApiBusiness) => {
//     console.log('Editing business:', business);
    
//     // Convertir ApiBusiness a ModalBusiness
//     const modalBusiness: ModalBusiness = {
//       ...business,
//       id: typeof business.id === 'string' ? parseInt(business.id) : Number(business.id)
//     };
    
//     setEditingBusiness(modalBusiness);
//     setIsModalOpen(true);
//   };

//   const handleModalClose = () => {
//     setIsModalOpen(false);
//     setEditingBusiness(null);
//   };

//   const handleModalSave = async () => {
//     console.log('Business saved, reloading data...');
//     await loadBusinesses();
//     handleModalClose();
//   };

//   // Función que usa businessTypeName si está disponible
//   const getBusinessTypeName = (business: ApiBusiness): string => {
//     if (business.businessTypeName) {
//       return business.businessTypeName.charAt(0).toUpperCase() + business.businessTypeName.slice(1);
//     }
    
//     if (!business.businessType) return 'Unknown';
//     const types: { [key: number]: string } = {
//       1: 'Restaurant',
//       2: 'Drugstore', 
//       3: 'Supermarket'
//     };
//     return types[business.businessType] || 'Unknown';
//   };

//   // Función para obtener el nombre del tipo de vehículo
//   const getVehicleTypeName = (vehicle: Vehicle): string => {
//     if (vehicle.vehicleTypeName) {
//       return vehicle.vehicleTypeName;
//     }
    
//     if (!vehicle.vehicleType) return 'Unknown';
//     const types: { [key: number]: string } = {
//       1: 'Motorcycle',
//       2: 'Car',
//       3: 'Bicycle',
//       4: 'Walking'
//     };
//     return types[vehicle.vehicleType] || 'Unknown';
//   };

//   // Variables de paginación que cambian según el tab activo
//   const currentData = activeTab === 'franchise' ? filteredBusinesses : filteredVehicles;
//   const totalPages = Math.ceil(currentData.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const paginatedData = currentData.slice(startIndex, startIndex + itemsPerPage);

//   const tabs: Array<{id: TabType; label: string}> = [
//     { id: 'franchise', label: 'Franchise' },
//     { id: 'delivery', label: 'Delivery' },
//     { id: 'vehicles', label: 'Vehicles' },
//     { id: 'assignment', label: 'Vehicle Assignment' }
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#1dd1a1] to-[#10ac84]">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-[#1dd1a1] to-[#10ac84] text-white p-6">
//         <div className="flex items-center gap-4 mb-6">
//           <button
//             onClick={() => navigate('/dashboard')}
//             className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
//           >
//             <ArrowLeft className="w-6 h-6" />
//           </button>
//           <h1 className="text-2xl font-semibold">Franchise & Delivery Management</h1>
//         </div>

//         {/* Tabs */}
//         <div className="flex gap-4 border-b border-white/20">
//           {tabs.map(tab => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={`pb-3 px-4 font-medium transition-all ${
//                 activeTab === tab.id
//                   ? 'text-white border-b-2 border-white'
//                   : 'text-white/80 hover:text-white'
//               }`}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Search Section */}
//       <div className="bg-white mx-6 -mt-4 rounded-xl shadow-lg p-6">
//         <div className="flex items-center gap-4">
//           <span className="font-medium text-gray-700">Search</span>
//           <div className="flex-1 relative">
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Search businesses..."
//               className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1dd1a1] focus:outline-none transition-colors"
//             />
//           </div>
//           <button className="p-3 bg-[#1dd1a1] text-white rounded-lg hover:bg-[#10ac84] transition-colors">
//             <Search className="w-5 h-5" />
//           </button>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
//         {activeTab === 'franchise' ? (
//           <>
//             <div className="bg-white rounded-xl shadow-lg p-6 text-center">
//               <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">
//                 Active Franchise
//               </h3>
//               <div className="text-4xl font-bold text-gray-800">{businessStats.activeBusinesses}</div>
//             </div>

//             <div className="bg-white rounded-xl shadow-lg p-6 text-center">
//               <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">
//                 Inactive Franchise
//               </h3>
//               <div className="text-4xl font-bold text-gray-800">{businessStats.inactiveBusinesses}</div>
//             </div>

//             <div className="bg-white rounded-xl shadow-lg p-6 text-center">
//               <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">
//                 Suspended Franchise
//               </h3>
//               <div className="text-4xl font-bold text-gray-800">{businessStats.suspendedBusinesses}</div>
//             </div>
//           </>
//         ) : activeTab === 'vehicles' ? (
//           <>
//             <div className="bg-white rounded-xl shadow-lg p-6 text-center">
//               <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">
//                 Total Vehicles
//               </h3>
//               <div className="text-4xl font-bold text-gray-800">{vehicleStats.totalVehicles}</div>
//             </div>

//             <div className="bg-white rounded-xl shadow-lg p-6 text-center">
//               <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">
//                 Available
//               </h3>
//               <div className="text-4xl font-bold text-gray-800">{vehicleStats.availableVehicles}</div>
//             </div>

//             <div className="bg-white rounded-xl shadow-lg p-6 text-center">
//               <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">
//                 Unavailable
//               </h3>
//               <div className="text-4xl font-bold text-gray-800">{vehicleStats.unavailableVehicles}</div>
//             </div>
//           </>
//         ) : (
//           <>
//             <div className="bg-white rounded-xl shadow-lg p-6 text-center">
//               <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">
//                 Coming Soon
//               </h3>
//               <div className="text-4xl font-bold text-gray-800">0</div>
//             </div>

//             <div className="bg-white rounded-xl shadow-lg p-6 text-center">
//               <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">
//                 Coming Soon
//               </h3>
//               <div className="text-4xl font-bold text-gray-800">0</div>
//             </div>

//             <div className="bg-white rounded-xl shadow-lg p-6 text-center">
//               <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">
//                 Coming Soon
//               </h3>
//               <div className="text-4xl font-bold text-gray-800">0</div>
//             </div>
//           </>
//         )}

//         <div className="bg-white rounded-xl shadow-lg p-6 text-center">
//           <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">
//             Add New
//           </h3>
//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="mt-2 w-16 h-16 bg-[#1dd1a1] text-white rounded-full hover:bg-[#10ac84] transition-colors inline-flex items-center justify-center"
//           >
//             <Plus className="w-8 h-8" />
//           </button>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="mx-6 bg-white rounded-xl shadow-lg overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   #
//                 </th>
//                 {activeTab === 'franchise' ? (
//                   <>
//                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Franchise Name
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Responsible User
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Email
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Phone
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Franchise Type
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </th>
//                   </>
//                 ) : activeTab === 'vehicles' ? (
//                   <>
//                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Brand & Model
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Plate
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Year
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Vehicle Type
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Availability
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </th>
//                   </>
//                 ) : (
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Coming Soon
//                   </th>
//                 )}
//                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {isLoading ? (
//                 <tr>
//                   <td colSpan={8} className="text-center py-8 text-gray-500">
//                     Loading {activeTab}...
//                   </td>
//                 </tr>
//               ) : paginatedData.length === 0 ? (
//                 <tr>
//                   <td colSpan={8} className="text-center py-8 text-gray-500">
//                     No {activeTab} found
//                   </td>
//                 </tr>
//               ) : activeTab === 'franchise' ? (
//                 (paginatedData as ApiBusiness[]).map((business, index) => (
//                   <tr key={business.id || index} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {startIndex + index + 1}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {business.name || '-'}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {business.responsibleUserName || '-'}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {business.email || '-'}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {business.phone || '-'}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {getBusinessTypeName(business)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                         business.isActive
//                           ? 'bg-green-100 text-green-800'
//                           : 'bg-red-100 text-red-800'
//                       }`}>
//                         {business.isActive ? 'Active' : 'Inactive'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => handleEdit(business)}
//                           className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
//                         >
//                           <Edit2 className="w-4 h-4" />
//                         </button>
//                         <button
//                           onClick={() => console.log('Delete functionality removed')}
//                           className="p-2 bg-gray-400 text-white rounded cursor-not-allowed"
//                           disabled
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : activeTab === 'vehicles' ? (
//                 (paginatedData as Vehicle[]).map((vehicle, index) => (
//                   <tr key={vehicle.id || index} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {startIndex + index + 1}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {`${vehicle.brand || ''} ${vehicle.model || ''}`.trim() || '-'}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {vehicle.plate || '-'}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {vehicle.year || '-'}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {getVehicleTypeName(vehicle)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                         vehicle.isAvailable
//                           ? 'bg-green-100 text-green-800'
//                           : 'bg-yellow-100 text-yellow-800'
//                       }`}>
//                         {vehicle.isAvailable ? 'Available' : 'In Use'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
//                         {vehicle.conditionStatus || 'Good'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => console.log('Edit vehicle:', vehicle)}
//                           className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
//                         >
//                           <Edit2 className="w-4 h-4" />
//                         </button>
//                         <button
//                           onClick={() => console.log('Delete functionality removed')}
//                           className="p-2 bg-gray-400 text-white rounded cursor-not-allowed"
//                           disabled
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={8} className="text-center py-8 text-gray-500">
//                     This section is coming soon
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         <div className="flex justify-center items-center gap-4 p-4 border-t">
//           <button
//             onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//             disabled={currentPage === 1}
//             className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-[#1dd1a1] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//           >
//             Previous
//           </button>
//           <span className="text-gray-600 font-medium">
//             Page {currentPage} of {totalPages || 1}
//           </span>
//           <button
//             onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//             disabled={currentPage === totalPages || totalPages === 0}
//             className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-[#1dd1a1] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//           >
//             Next
//           </button>
//         </div>
//       </div>

//       {/* Modal */}
//       <BusinessModal
//         isOpen={isModalOpen}
//         onClose={handleModalClose}
//         onSave={handleModalSave}
//         business={editingBusiness}
//       />
//     </div>
//   );
// };

// export default FranchiseManagement;


import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import type { Business as ApiBusiness, Vehicle, VehicleAssignment } from '../services/api';
import type { Business as ModalBusiness } from '../types/business';
import BusinessModal from '../pages/BusinessModal';
import VehicleModal from '../pages/VehicleModal';
import DeliveryModal from '../pages/DeliveryModal';
import VehicleAssignmentModal from '../pages/VehicleAssignmentModal';

// Tipos simples para estadísticas locales
interface LocalBusinessStats {
  activeBusinesses: number;
  inactiveBusinesses: number;
  suspendedBusinesses: number;
}

interface LocalVehicleStats {
  totalVehicles: number;
  availableVehicles: number;
  unavailableVehicles: number;
}

interface LocalAssignmentStats {
  totalAssignments: number;
  activeAssignments: number;
  returnedAssignments: number;
  otherAssignments: number;
}

const FranchiseManagement: React.FC = () => {
  const navigate = useNavigate();
  
  type TabType = 'franchise' | 'delivery' | 'vehicles' | 'assignment';
  
  const [activeTab, setActiveTab] = useState<TabType>('franchise');
  
  // Business states
  const [businesses, setBusinesses] = useState<ApiBusiness[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<ApiBusiness[]>([]);
  const [businessStats, setBusinessStats] = useState<LocalBusinessStats>({
    activeBusinesses: 0,
    inactiveBusinesses: 0,
    suspendedBusinesses: 0
  });
  
  // Vehicle states
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [vehicleStats, setVehicleStats] = useState<LocalVehicleStats>({
    totalVehicles: 0,
    availableVehicles: 0,
    unavailableVehicles: 0
  });
  
  // Vehicle Assignment states
  const [assignments, setAssignments] = useState<VehicleAssignment[]>([]);
  const [filteredAssignments, setFilteredAssignments] = useState<VehicleAssignment[]>([]);
  const [assignmentStats, setAssignmentStats] = useState<LocalAssignmentStats>({
    totalAssignments: 0,
    activeAssignments: 0,
    returnedAssignments: 0,
    otherAssignments: 0
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<ModalBusiness | null>(null);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [editingDelivery, setEditingDelivery] = useState(null);
  const [editingAssignment, setEditingAssignment] = useState<VehicleAssignment | null>(null);

  const itemsPerPage = 10;

  // Filtrar businesses
  const filterBusinesses = useCallback(() => {
    if (!searchTerm) {
      setFilteredBusinesses(businesses);
    } else {
      const filtered = businesses.filter(business =>
        business.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.responsibleUserName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBusinesses(filtered);
    }
    setCurrentPage(1);
  }, [searchTerm, businesses]);

  // Filtrar vehículos
  const filterVehicles = useCallback(() => {
    if (!searchTerm) {
      setFilteredVehicles(vehicles);
    } else {
      const filtered = vehicles.filter(vehicle =>
        vehicle.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.plate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.vehicleTypeName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredVehicles(filtered);
    }
    setCurrentPage(1);
  }, [searchTerm, vehicles]);

  // Filtrar assignments
  const filterAssignments = useCallback(() => {
    if (!searchTerm) {
      setFilteredAssignments(assignments);
    } else {
      const filtered = assignments.filter(assignment =>
        assignment.deliveryPersonName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.vehicleModel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.vehiclePlate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.assignmentStatusName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAssignments(filtered);
    }
    setCurrentPage(1);
  }, [searchTerm, assignments]);

  const loadBusinesses = async () => {
    setIsLoading(true);
    try {
      console.log('Loading businesses...');
      
      if (typeof apiService.get !== 'function') {
        console.error('get method not available on apiService');
        throw new Error('get method not found on apiService');
      }
      
      const response = await apiService.get<ApiBusiness[]>('/api/admin/Business', { activeOnly: false });
      
      console.log('API Response:', response);
      
      if (response.success && response.data) {
        setBusinesses(response.data);
        setFilteredBusinesses(response.data);
        
        // Calcular estadísticas simples desde los datos
        const activeCount = response.data.filter(b => b.isActive).length;
        const inactiveCount = response.data.filter(b => !b.isActive).length;
        
        setBusinessStats({
          activeBusinesses: activeCount,
          inactiveBusinesses: inactiveCount,
          suspendedBusinesses: 0
        });
        
        console.log('Businesses loaded successfully:', response.data.length);
      } else {
        console.error('API response not successful:', response);
        setBusinesses([]);
        setFilteredBusinesses([]);
      }
    } catch (error) {
      console.error('Error loading businesses:', error);
      setBusinesses([]);
      setFilteredBusinesses([]);
      alert(`Error loading businesses: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const loadVehicles = async () => {
    setIsLoading(true);
    try {
      console.log('Loading vehicles...');
      
      if (typeof apiService.get !== 'function') {
        console.error('get method not available on apiService');
        throw new Error('get method not found on apiService');
      }
      
      const response = await apiService.get<Vehicle[]>('/api/admin/Vehicle');
      
      console.log('Vehicle API Response:', response);
      
      if (response.success && response.data) {
        setVehicles(response.data);
        setFilteredVehicles(response.data);
        
        // Calcular estadísticas simples desde los datos
        const availableCount = response.data.filter(v => v.isAvailable).length;
        const unavailableCount = response.data.filter(v => !v.isAvailable).length;
        
        setVehicleStats({
          totalVehicles: response.data.length,
          availableVehicles: availableCount,
          unavailableVehicles: unavailableCount
        });
        
        console.log('Vehicles loaded successfully:', response.data.length);
      } else {
        console.error('Vehicle API response not successful:', response);
        setVehicles([]);
        setFilteredVehicles([]);
      }
    } catch (error) {
      console.error('Error loading vehicles:', error);
      setVehicles([]);
      setFilteredVehicles([]);
      alert(`Error loading vehicles: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAssignments = async () => {
    setIsLoading(true);
    try {
      console.log('Loading vehicle assignments...');
      
      if (typeof apiService.get !== 'function') {
        console.error('get method not available on apiService');
        throw new Error('get method not found on apiService');
      }
      
      const response = await apiService.get<VehicleAssignment[]>('/api/admin/VehicleAssignment');
      
      console.log('Assignment API Response:', response);
      
      if (response.success && response.data) {
        setAssignments(response.data);
        setFilteredAssignments(response.data);
        
        // Calcular estadísticas simples desde los datos
        const activeCount = response.data.filter(a => a.assignmentStatus === 1).length;
        const returnedCount = response.data.filter(a => a.assignmentStatus === 2).length;
        const otherCount = response.data.filter(a => a.assignmentStatus > 2).length;
        
        setAssignmentStats({
          totalAssignments: response.data.length,
          activeAssignments: activeCount,
          returnedAssignments: returnedCount,
          otherAssignments: otherCount
        });
        
        console.log('Assignments loaded successfully:', response.data.length);
      } else {
        console.error('Assignment API response not successful:', response);
        setAssignments([]);
        setFilteredAssignments([]);
      }
    } catch (error) {
      console.error('Error loading assignments:', error);
      setAssignments([]);
      setFilteredAssignments([]);
      alert(`Error loading assignments: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'franchise') {
      loadBusinesses();
    } else if (activeTab === 'vehicles') {
      loadVehicles();
    } else if (activeTab === 'assignment') {
      loadAssignments();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'franchise') {
      filterBusinesses();
    } else if (activeTab === 'vehicles') {
      filterVehicles();
    } else if (activeTab === 'assignment') {
      filterAssignments();
    }
  }, [filterBusinesses, filterVehicles, filterAssignments, activeTab]);

  const handleEdit = (business: ApiBusiness) => {
    console.log('Editing business:', business);
    
    // Convertir ApiBusiness a ModalBusiness
    const modalBusiness: ModalBusiness = {
      ...business,
      id: typeof business.id === 'string' ? parseInt(business.id) : Number(business.id)
    };
    
    setEditingBusiness(modalBusiness);
    setIsBusinessModalOpen(true);
  };

  const handleVehicleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsVehicleModalOpen(true);
  };

  const handleAssignmentEdit = (assignment: VehicleAssignment) => {
    setEditingAssignment(assignment);
    setIsAssignmentModalOpen(true);
  };

  // Modal close handlers
  const handleBusinessModalClose = () => {
    setIsBusinessModalOpen(false);
    setEditingBusiness(null);
  };

  const handleVehicleModalClose = () => {
    setIsVehicleModalOpen(false);
    setEditingVehicle(null);
  };

  const handleDeliveryModalClose = () => {
    setIsDeliveryModalOpen(false);
    setEditingDelivery(null);
  };

  const handleAssignmentModalClose = () => {
    setIsAssignmentModalOpen(false);
    setEditingAssignment(null);
  };

  // Modal save handlers
  const handleBusinessModalSave = async () => {
    console.log('Business saved, reloading data...');
    await loadBusinesses();
    handleBusinessModalClose();
  };

  const handleVehicleModalSave = async () => {
    console.log('Vehicle saved, reloading data...');
    await loadVehicles();
    handleVehicleModalClose();
  };

  const handleDeliveryModalSave = async () => {
    console.log('Delivery person saved, reloading data...');
    handleDeliveryModalClose();
  };

  const handleAssignmentModalSave = async () => {
    console.log('Assignment saved, reloading data...');
    await loadAssignments();
    handleAssignmentModalClose();
  };

  // Función que usa businessTypeName si está disponible
  const getBusinessTypeName = (business: ApiBusiness): string => {
    if (business.businessTypeName) {
      return business.businessTypeName.charAt(0).toUpperCase() + business.businessTypeName.slice(1);
    }
    
    if (!business.businessType) return 'Unknown';
    const types: { [key: number]: string } = {
      1: 'Restaurant',
      2: 'Drugstore', 
      3: 'Supermarket'
    };
    return types[business.businessType] || 'Unknown';
  };

  // Función para obtener el nombre del tipo de vehículo
  const getVehicleTypeName = (vehicle: Vehicle): string => {
    if (vehicle.vehicleTypeName) {
      return vehicle.vehicleTypeName;
    }
    
    if (!vehicle.vehicleType) return 'Unknown';
    const types: { [key: number]: string } = {
      1: 'Motorcycle',
      2: 'Car',
      3: 'Truck',
      4: 'Bicycle'
    };
    return types[vehicle.vehicleType] || 'Unknown';
  };

  // Función para obtener el nombre del estado de asignación
  const getAssignmentStatusName = (assignment: VehicleAssignment): string => {
    if (assignment.assignmentStatusName) {
      return assignment.assignmentStatusName;
    }
    
    if (!assignment.assignmentStatus) return 'Unknown';
    const statuses: { [key: number]: string } = {
      1: 'Active',
      2: 'Returned',
      3: 'Transferred',
      4: 'Maintenance', 
      5: 'Damaged'
    };
    return statuses[assignment.assignmentStatus] || 'Unknown';
  };

  // Variables de paginación que cambian según el tab activo
  const currentData = activeTab === 'franchise' 
    ? filteredBusinesses 
    : activeTab === 'vehicles' 
    ? filteredVehicles 
    : filteredAssignments;
  const totalPages = Math.ceil(currentData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = currentData.slice(startIndex, startIndex + itemsPerPage);

  const tabs: Array<{id: TabType; label: string}> = [
    { id: 'franchise', label: 'Franchise' },
    { id: 'delivery', label: 'Delivery' },
    { id: 'vehicles', label: 'Vehicles' },
    { id: 'assignment', label: 'Vehicle Assignment' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1dd1a1] to-[#10ac84]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1dd1a1] to-[#10ac84] text-white p-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-semibold">Franchise & Delivery Management</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-white/20">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-4 font-medium transition-all ${
                activeTab === tab.id
                  ? 'text-white border-b-2 border-white'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white mx-6 -mt-4 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-4">
          <span className="font-medium text-gray-700">Search</span>
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search businesses..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1dd1a1] focus:outline-none transition-colors"
            />
          </div>
          <button className="p-3 bg-[#1dd1a1] text-white rounded-lg hover:bg-[#10ac84] transition-colors">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
        {activeTab === 'franchise' ? (
          <>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">
                Active Franchise
              </h3>
              <div className="text-4xl font-bold text-gray-800">{businessStats.activeBusinesses}</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">
                Inactive Franchise
              </h3>
              <div className="text-4xl font-bold text-gray-800">{businessStats.inactiveBusinesses}</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">
                Suspended Franchise
              </h3>
              <div className="text-4xl font-bold text-gray-800">{businessStats.suspendedBusinesses}</div>
            </div>
          </>
        ) : activeTab === 'vehicles' ? (
          <>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">
                Total Vehicles
              </h3>
              <div className="text-4xl font-bold text-gray-800">{vehicleStats.totalVehicles}</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">
                Available
              </h3>
              <div className="text-4xl font-bold text-gray-800">{vehicleStats.availableVehicles}</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">
                Unavailable
              </h3>
              <div className="text-4xl font-bold text-gray-800">{vehicleStats.unavailableVehicles}</div>
            </div>
          </>
        ) : activeTab === 'assignment' ? (
          <>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">
                Total Assignments
              </h3>
              <div className="text-4xl font-bold text-gray-800">{assignmentStats.totalAssignments}</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">
                Active
              </h3>
              <div className="text-4xl font-bold text-gray-800">{assignmentStats.activeAssignments}</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">
                Returned
              </h3>
              <div className="text-4xl font-bold text-gray-800">{assignmentStats.returnedAssignments}</div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">
                Coming Soon
              </h3>
              <div className="text-4xl font-bold text-gray-800">0</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">
                Coming Soon
              </h3>
              <div className="text-4xl font-bold text-gray-800">0</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">
                Coming Soon
              </h3>
              <div className="text-4xl font-bold text-gray-800">0</div>
            </div>
          </>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">
            Add New
          </h3>
          <button
            onClick={() => {
              if (activeTab === 'franchise') {
                setIsBusinessModalOpen(true);
              } else if (activeTab === 'vehicles') {
                setIsVehicleModalOpen(true);
              } else if (activeTab === 'delivery') {
                setIsDeliveryModalOpen(true);
              } else if (activeTab === 'assignment') {
                setIsAssignmentModalOpen(true);
              }
            }}
            className="mt-2 w-16 h-16 bg-[#1dd1a1] text-white rounded-full hover:bg-[#10ac84] transition-colors inline-flex items-center justify-center"
          >
            <Plus className="w-8 h-8" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="mx-6 bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                {activeTab === 'franchise' ? (
                  <>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Franchise Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Responsible User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Franchise Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </>
                ) : activeTab === 'vehicles' ? (
                  <>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Brand & Model
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plate
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Year
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vehicle Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Availability
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </>
                ) : activeTab === 'assignment' ? (
                  <>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Delivery Person
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vehicle
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plate
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registration Date
                    </th>
                  </>
                ) : (
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Coming Soon
                  </th>
                )}
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-500">
                    Loading {activeTab}...
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-500">
                    No {activeTab} found
                  </td>
                </tr>
              ) : activeTab === 'franchise' ? (
                (paginatedData as ApiBusiness[]).map((business, index) => (
                  <tr key={business.id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {business.name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {business.responsibleUserName || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {business.email || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {business.phone || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getBusinessTypeName(business)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        business.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {business.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(business)}
                          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => console.log('Delete functionality removed')}
                          className="p-2 bg-gray-400 text-white rounded cursor-not-allowed"
                          disabled
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : activeTab === 'assignment' ? (
                (paginatedData as VehicleAssignment[]).map((assignment, index) => (
                  <tr key={assignment.id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {assignment.deliveryPersonName || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {assignment.vehicleModel || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {assignment.vehiclePlate || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {assignment.assignedAt ? new Date(assignment.assignedAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        assignment.assignmentStatus === 1
                          ? 'bg-green-100 text-green-800'
                          : assignment.assignmentStatus === 2
                          ? 'bg-blue-100 text-blue-800'
                          : assignment.assignmentStatus === 3
                          ? 'bg-purple-100 text-purple-800'
                          : assignment.assignmentStatus === 4
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {getAssignmentStatusName(assignment)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {assignment.registrationDate || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAssignmentEdit(assignment)}
                          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => console.log('Delete functionality removed')}
                          className="p-2 bg-gray-400 text-white rounded cursor-not-allowed"
                          disabled
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : activeTab === 'vehicles' ? (
                (paginatedData as Vehicle[]).map((vehicle, index) => (
                  <tr key={vehicle.id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {`${vehicle.brand || ''} ${vehicle.model || ''}`.trim() || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vehicle.plate || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vehicle.year || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getVehicleTypeName(vehicle)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        vehicle.isAvailable
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {vehicle.isAvailable ? 'Available' : 'In Use'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {vehicle.conditionStatus || 'Good'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleVehicleEdit(vehicle)}
                          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => console.log('Delete functionality removed')}
                          className="p-2 bg-gray-400 text-white rounded cursor-not-allowed"
                          disabled
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-500">
                    This section is coming soon
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 p-4 border-t">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-[#1dd1a1] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="text-gray-600 font-medium">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-[#1dd1a1] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modals */}
      <BusinessModal
        isOpen={isBusinessModalOpen}
        onClose={handleBusinessModalClose}
        onSave={handleBusinessModalSave}
        business={editingBusiness}
      />
      
      <VehicleModal
        isOpen={isVehicleModalOpen}
        onClose={handleVehicleModalClose}
        onSave={handleVehicleModalSave}
        vehicle={editingVehicle}
      />
      
      <DeliveryModal
        isOpen={isDeliveryModalOpen}
        onClose={handleDeliveryModalClose}
        onSave={handleDeliveryModalSave}
        deliveryPerson={editingDelivery}
      />
      
      <VehicleAssignmentModal
        isOpen={isAssignmentModalOpen}
        onClose={handleAssignmentModalClose}
        onSave={handleAssignmentModalSave}
        assignment={editingAssignment}
      />
    </div>
  );
};

export default FranchiseManagement;