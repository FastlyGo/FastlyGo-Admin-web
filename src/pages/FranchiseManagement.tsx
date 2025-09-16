import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBusinessStore } from '../stores/businessStore';
import { CreateBusinessModal } from '../components/CreateBusinessModal';
import { PageHeader } from '../components/PageHeader';
import { MetricCard } from '../components/MetricCard';
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
  
  // Business store integration
  const { 
    businesses, 
    loading: businessLoading, 
    error: businessError, 
    fetchBusinesses, 
    deleteBusiness,
    clearError 
  } = useBusinessStore();
  
  const [filteredBusinesses, setFilteredBusinesses] = useState<ApiBusiness[]>([]);
  const [businessStats, setBusinessStats] = useState<LocalBusinessStats>({
    activeBusinesses: 0,
    inactiveBusinesses: 0,
    suspendedBusinesses: 0
  });
  
  // Modal state for CreateBusinessModal
  const [isCreateBusinessModalOpen, setIsCreateBusinessModalOpen] = useState(false);
  
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

  // Delivery Person states
  const [deliveryPersons, setDeliveryPersons] = useState<any[]>([]);
  const [filteredDeliveryPersons, setFilteredDeliveryPersons] = useState<any[]>([]);
  const [deliveryPersonStats, setDeliveryPersonStats] = useState({
    totalDeliveryPersons: 0,
    activeDeliveryPersons: 0,
    onlineDeliveryPersons: 0
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
  
  // Delete confirmation state
  const [deleteBusinessId, setDeleteBusinessId] = useState<string | null>(null);

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

  // Filtrar delivery persons
  const filterDeliveryPersons = useCallback(() => {
    if (!searchTerm) {
      setFilteredDeliveryPersons(deliveryPersons);
    } else {
      const filtered = deliveryPersons.filter(person =>
        person.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.licenseNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDeliveryPersons(filtered);
    }
    setCurrentPage(1);
  }, [searchTerm, deliveryPersons]);

  const loadBusinesses = async () => {
    try {
      await fetchBusinesses();
    } catch (error) {
      console.error('Error loading businesses:', error);
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

  const loadDeliveryPersons = async () => {
    setIsLoading(true);
    try {
      console.log('Loading delivery persons...');

      const response = await apiService.getAllDeliveryPersons();

      console.log('Delivery Persons API Response:', response);

      if (response.success && response.data) {
        const dataArray = Array.isArray(response.data) ? response.data : response.data.data || [];
        setDeliveryPersons(dataArray);
        setFilteredDeliveryPersons(dataArray);

        // Calcular estadísticas
        const activeCount = dataArray.filter(p => p.isActive).length;
        const onlineCount = dataArray.filter(p => p.isOnline).length;

        setDeliveryPersonStats({
          totalDeliveryPersons: dataArray.length,
          activeDeliveryPersons: activeCount,
          onlineDeliveryPersons: onlineCount
        });

        console.log('Delivery persons loaded successfully:', dataArray.length);
      } else {
        console.error('Delivery persons API response not successful:', response);
        setDeliveryPersons([]);
        setFilteredDeliveryPersons([]);
      }
    } catch (error) {
      console.error('Error loading delivery persons:', error);
      setDeliveryPersons([]);
      setFilteredDeliveryPersons([]);
      alert(`Error loading delivery persons: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
    } else if (activeTab === 'delivery') {
      loadDeliveryPersons();
    }
  }, [activeTab]);

  // Update business stats when businesses change
  useEffect(() => {
    const activeCount = businesses.filter(b => b.isActive).length;
    const inactiveCount = businesses.filter(b => !b.isActive).length;
    
    setBusinessStats({
      activeBusinesses: activeCount,
      inactiveBusinesses: inactiveCount,
      suspendedBusinesses: 0
    });
    setFilteredBusinesses(businesses);
  }, [businesses]);

  useEffect(() => {
    if (activeTab === 'franchise') {
      filterBusinesses();
    } else if (activeTab === 'vehicles') {
      filterVehicles();
    } else if (activeTab === 'assignment') {
      filterAssignments();
    } else if (activeTab === 'delivery') {
      filterDeliveryPersons();
    }
  }, [filterBusinesses, filterVehicles, filterAssignments, filterDeliveryPersons, activeTab]);

  // Clear business error after 5 seconds
  useEffect(() => {
    if (businessError) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [businessError, clearError]);

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
    await loadDeliveryPersons();
    handleDeliveryModalClose();
  };

  const handleDeliveryPersonEdit = (deliveryPerson: any) => {
    setEditingDelivery(deliveryPerson);
    setIsDeliveryModalOpen(true);
  };

  const handleAssignmentModalSave = async () => {
    console.log('Assignment saved, reloading data...');
    await loadAssignments();
    handleAssignmentModalClose();
  };

  // Handle business deletion
  const handleDeleteBusiness = async (businessId: string) => {
    try {
      await deleteBusiness(businessId);
      setDeleteBusinessId(null);
    } catch (error) {
      console.error('Error deleting business:', error);
    }
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
    : activeTab === 'assignment'
    ? filteredAssignments
    : filteredDeliveryPersons;
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
    <div className="min-h-screen bg-gray-50">
      {/* Header con pestañas integradas */}
      <PageHeader
        franchiseName="Franchise & Delivery Management"
        businessType="FastlyGo Admin System"
        onBack={() => navigate('/')}
        showShare={false}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-4">
            <span className="font-medium text-gray-700">Search</span>
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Search ${activeTab}...`}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition-colors"
              />
            </div>
            <button className="p-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

      {/* Error Alert */}
      {businessError && (
        <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">{businessError}</p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  onClick={clearError}
                  className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
                >
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {activeTab === 'franchise' ? (
            <>
              <MetricCard
                title="Active Franchise"
                value={businessStats.activeBusinesses}
              />
              <MetricCard
                title="Inactive Franchise"
                value={businessStats.inactiveBusinesses}
              />
              <MetricCard
                title="Suspended Franchise"
                value={businessStats.suspendedBusinesses}
              />
            </>
          ) : activeTab === 'vehicles' ? (
            <>
              <MetricCard
                title="Total Vehicles"
                value={vehicleStats.totalVehicles}
              />
              <MetricCard
                title="Available"
                value={vehicleStats.availableVehicles}
              />
              <MetricCard
                title="Unavailable"
                value={vehicleStats.unavailableVehicles}
              />
            </>
          ) : activeTab === 'assignment' ? (
            <>
              <MetricCard
                title="Total Assignments"
                value={assignmentStats.totalAssignments}
              />
              <MetricCard
                title="Active"
                value={assignmentStats.activeAssignments}
              />
              <MetricCard
                title="Returned"
                value={assignmentStats.returnedAssignments}
              />
            </>
          ) : activeTab === 'delivery' ? (
            <>
              <MetricCard
                title="Total Delivery Persons"
                value={deliveryPersonStats.totalDeliveryPersons}
              />
              <MetricCard
                title="Active"
                value={deliveryPersonStats.activeDeliveryPersons}
              />
              <MetricCard
                title="Online"
                value={deliveryPersonStats.onlineDeliveryPersons}
              />
            </>
          ) : (
            <>
              <MetricCard title="Coming Soon" value="0" />
              <MetricCard title="Coming Soon" value="0" />
              <MetricCard title="Coming Soon" value="0" />
            </>
          )}

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">
              Add New
            </h3>
            <button
              onClick={() => {
                if (activeTab === 'franchise') {
                  setIsCreateBusinessModalOpen(true);
                } else if (activeTab === 'vehicles') {
                  setIsVehicleModalOpen(true);
                } else if (activeTab === 'delivery') {
                  setIsDeliveryModalOpen(true);
                } else if (activeTab === 'assignment') {
                  setIsAssignmentModalOpen(true);
                }
              }}
              className="mt-2 w-16 h-16 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-colors inline-flex items-center justify-center"
            >
              <Plus className="w-8 h-8" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
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
                ) : activeTab === 'delivery' ? (
                  <>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Delivery Person
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      License Number
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Online
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
              {(isLoading || businessLoading) ? (
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
                          className="p-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteBusinessId(business.id)}
                          className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
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
                          className="p-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
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
                          className="p-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
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
              ) : activeTab === 'delivery' ? (
                (paginatedData as any[]).map((deliveryPerson, index) => (
                  <tr key={deliveryPerson.id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {deliveryPerson.userName || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {deliveryPerson.email || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {deliveryPerson.licenseNumber || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {deliveryPerson.rating ? `${deliveryPerson.rating}/5` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        deliveryPerson.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {deliveryPerson.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        deliveryPerson.isOnline
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {deliveryPerson.isOnline ? 'Online' : 'Offline'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDeliveryPersonEdit(deliveryPerson)}
                          className="p-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
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
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="text-gray-600 font-medium">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <BusinessModal
        isOpen={isBusinessModalOpen}
        onClose={handleBusinessModalClose}
        onSave={handleBusinessModalSave}
        business={editingBusiness}
      />
      
      <CreateBusinessModal
        isOpen={isCreateBusinessModalOpen}
        onClose={() => setIsCreateBusinessModalOpen(false)}
        onBusinessCreated={() => {
          loadBusinesses();
          setIsCreateBusinessModalOpen(false);
        }}
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
      
      {/* Delete Business Confirmation Modal */}
      {deleteBusinessId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this business? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteBusinessId(null)}
                className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteBusiness(deleteBusinessId)}
                className="flex-1 bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FranchiseManagement;