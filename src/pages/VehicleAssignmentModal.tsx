import React, { useState, useEffect } from 'react';
import { X, Users, Truck, Calendar, FileText, ChevronDown, User, MapPin, Shield } from 'lucide-react';
import { apiService } from '../services/api';

enum AssignmentStatus {
  Active = 1,
  Returned = 2,
  Transferred = 3,
  Maintenance = 4,
  Damaged = 5
}

interface VehicleAssignment {
  id?: string;
  deliveryPersonId: string;
  vehicleId: string;
  assignmentStatus: AssignmentStatus;
  assignedAt: string;
  returnedAt?: string;
  assignmentReason?: string;
  returnReason?: string;
  comments?: string;
  conditionAtAssignment?: string;
  conditionAtReturn?: string;
  mileageAtAssignment?: number;
  mileageAtReturn?: number;
  assignedBy?: string;
  returnedBy?: string;
}

interface VehicleAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  assignment: VehicleAssignment | null;
}

interface DeliveryPerson {
  id: string;
  name: string;
  email: string;
}

interface Vehicle {
  id: string;
  brand?: string;
  model?: string;
  plate: string;
  isAvailable: boolean;
}

const VehicleAssignmentModal: React.FC<VehicleAssignmentModalProps> = ({ isOpen, onClose, onSave, assignment }) => {
  const [formData, setFormData] = useState<VehicleAssignment>({
    deliveryPersonId: '',
    vehicleId: '',
    assignmentStatus: AssignmentStatus.Active,
    assignedAt: new Date().toISOString().split('T')[0],
    returnedAt: '',
    assignmentReason: '',
    returnReason: '',
    comments: '',
    conditionAtAssignment: '',
    conditionAtReturn: '',
    mileageAtAssignment: undefined,
    mileageAtReturn: undefined,
    assignedBy: '',
    returnedBy: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  // Dropdown states
  const [isPersonDropdownOpen, setIsPersonDropdownOpen] = useState(false);
  const [isVehicleDropdownOpen, setIsVehicleDropdownOpen] = useState(false);
  const [isAssignedByDropdownOpen, setIsAssignedByDropdownOpen] = useState(false);
  const [isReturnedByDropdownOpen, setIsReturnedByDropdownOpen] = useState(false);
  
  // Data states
  const [deliveryPersons, setDeliveryPersons] = useState<DeliveryPerson[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [users, setUsers] = useState<{ id: string; name: string; email: string }[]>([]);

  const statusOptions = [
    { value: AssignmentStatus.Active, label: 'Active', color: 'text-green-700 bg-green-100' },
    { value: AssignmentStatus.Returned, label: 'Returned', color: 'text-blue-700 bg-blue-100' },
    { value: AssignmentStatus.Transferred, label: 'Transferred', color: 'text-purple-700 bg-purple-100' },
    { value: AssignmentStatus.Maintenance, label: 'Maintenance', color: 'text-orange-700 bg-orange-100' },
    { value: AssignmentStatus.Damaged, label: 'Damaged', color: 'text-red-700 bg-red-100' }
  ];

  useEffect(() => {
    if (assignment) {
      setFormData({
        ...assignment,
        assignedAt: assignment.assignedAt ? assignment.assignedAt.split('T')[0] : new Date().toISOString().split('T')[0],
        returnedAt: assignment.returnedAt ? assignment.returnedAt.split('T')[0] : ''
      });
    } else {
      // Test data
      setFormData({
        deliveryPersonId: '550e8400-e29b-41d4-a716-446655440001',
        vehicleId: '550e8400-e29b-41d4-a716-446655440001',
        assignmentStatus: AssignmentStatus.Active,
        assignedAt: '2024-01-15',
        returnedAt: '',
        assignmentReason: 'Regular delivery assignment for downtown coverage',
        returnReason: '',
        comments: 'Initial assignment for new delivery person',
        conditionAtAssignment: 'good',
        conditionAtReturn: '',
        mileageAtAssignment: 15000,
        mileageAtReturn: undefined,
        assignedBy: '550e8400-e29b-41d4-a716-446655440003',
        returnedBy: ''
      });
    }
    setErrors({});
    loadData();
  }, [assignment]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isPersonDropdownOpen && !target.closest('.person-dropdown-container')) {
        setIsPersonDropdownOpen(false);
      }
      if (isVehicleDropdownOpen && !target.closest('.vehicle-dropdown-container')) {
        setIsVehicleDropdownOpen(false);
      }
      if (isAssignedByDropdownOpen && !target.closest('.assigned-by-dropdown-container')) {
        setIsAssignedByDropdownOpen(false);
      }
      if (isReturnedByDropdownOpen && !target.closest('.returned-by-dropdown-container')) {
        setIsReturnedByDropdownOpen(false);
      }
    };

    if (isPersonDropdownOpen || isVehicleDropdownOpen || isAssignedByDropdownOpen || isReturnedByDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPersonDropdownOpen, isVehicleDropdownOpen, isAssignedByDropdownOpen, isReturnedByDropdownOpen]);

  const loadData = async () => {
    try {
      // Mock data - in real app these would be API calls
      setDeliveryPersons([
        { id: '550e8400-e29b-41d4-a716-446655440001', name: 'Carlos Rodriguez', email: 'carlos@example.com' },
        { id: '550e8400-e29b-41d4-a716-446655440002', name: 'Maria Garcia', email: 'maria@example.com' },
        { id: '550e8400-e29b-41d4-a716-446655440003', name: 'Juan Martinez', email: 'juan@example.com' },
        { id: '550e8400-e29b-41d4-a716-446655440004', name: 'Ana Lopez', email: 'ana@example.com' }
      ]);

      setVehicles([
        { id: '550e8400-e29b-41d4-a716-446655440001', brand: 'Honda', model: 'CB190R', plate: 'ABC-123', isAvailable: true },
        { id: '550e8400-e29b-41d4-a716-446655440002', brand: 'Yamaha', model: 'XTZ150', plate: 'DEF-456', isAvailable: true },
        { id: '550e8400-e29b-41d4-a716-446655440003', brand: 'Bajaj', model: 'Pulsar 180', plate: 'GHI-789', isAvailable: false },
        { id: '550e8400-e29b-41d4-a716-446655440004', brand: 'TVS', model: 'Apache 160', plate: 'JKL-012', isAvailable: true }
      ]);

      setUsers([
        { id: '550e8400-e29b-41d4-a716-446655440001', name: 'Admin User', email: 'admin@fastlygo.com' },
        { id: '550e8400-e29b-41d4-a716-446655440002', name: 'Manager López', email: 'manager@fastlygo.com' },
        { id: '550e8400-e29b-41d4-a716-446655440003', name: 'Supervisor García', email: 'supervisor@fastlygo.com' }
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.deliveryPersonId) {
      newErrors.deliveryPersonId = 'Delivery person is required';
    }

    if (!formData.vehicleId) {
      newErrors.vehicleId = 'Vehicle is required';
    }

    if (!formData.assignedAt) {
      newErrors.assignedAt = 'Assignment date is required';
    }

    if (formData.mileageAtAssignment !== undefined && formData.mileageAtAssignment < 0) {
      newErrors.mileageAtAssignment = 'Mileage cannot be negative';
    }

    if (formData.mileageAtReturn !== undefined && formData.mileageAtReturn < 0) {
      newErrors.mileageAtReturn = 'Return mileage cannot be negative';
    }

    if (formData.mileageAtAssignment !== undefined && 
        formData.mileageAtReturn !== undefined && 
        formData.mileageAtReturn < formData.mileageAtAssignment) {
      newErrors.mileageAtReturn = 'Return mileage cannot be less than assignment mileage';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      let response;
      if (assignment) {
        response = await apiService.put(`/api/admin/VehicleAssignment/${assignment.id}`, formData);
      } else {
        response = await apiService.post('/api/admin/VehicleAssignment', formData);
      }

      if (response.success) {
        onSave();
      }
    } catch (error) {
      console.error('Error saving assignment:', error);
      alert('Failed to save assignment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let inputValue: any = value;
    
    if (type === 'number') {
      inputValue = value === '' ? undefined : parseInt(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: inputValue
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleDropdownSelect = (name: string, value: string, closeDropdown: () => void) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    closeDropdown();
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const getSelectedPerson = () => deliveryPersons.find(p => p.id === formData.deliveryPersonId);
  const getSelectedVehicle = () => vehicles.find(v => v.id === formData.vehicleId);
  const getAssignedByUser = () => users.find(u => u.id === formData.assignedBy);
  const getReturnedByUser = () => users.find(u => u.id === formData.returnedBy);
  const getSelectedStatus = () => statusOptions.find(s => s.value === formData.assignmentStatus);

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-screen overflow-y-auto"
        style={{
          animation: 'slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          maxHeight: '90vh'
        }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {assignment ? 'Edit Vehicle Assignment' : 'Create Vehicle Assignment'}
            </h2>
          </div>
          <button onClick={onClose} className="w-10 h-10 hover:bg-gray-100 rounded-xl transition-colors flex items-center justify-center">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="px-8 pb-8">
          <div className="space-y-6">
            {/* Basic Assignment Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-500" />
                Basic Assignment Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Delivery Person Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Delivery Person *
                  </label>
                  <div className="relative person-dropdown-container">
                    <User className="absolute left-4 top-4 w-5 h-5 text-gray-400 z-10" />
                    <div
                      onClick={() => setIsPersonDropdownOpen(!isPersonDropdownOpen)}
                      className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl transition-all duration-200 text-gray-900 min-h-[3rem] flex items-center cursor-pointer hover:shadow-md ${
                        errors.deliveryPersonId 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-gray-200 hover:border-teal-300'
                      }`}
                    >
                      {getSelectedPerson() ? (
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{getSelectedPerson()?.name}</span>
                          <span className="text-gray-500 text-sm">({getSelectedPerson()?.email})</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">Select delivery person...</span>
                      )}
                    </div>
                    
                    <ChevronDown 
                      className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform duration-200 ${
                        isPersonDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                    
                    {isPersonDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg z-[9999] max-h-48 overflow-y-auto">
                        {deliveryPersons.map((person) => (
                          <div
                            key={person.id}
                            onClick={() => handleDropdownSelect('deliveryPersonId', person.id, () => setIsPersonDropdownOpen(false))}
                            className="px-4 py-3 hover:bg-teal-50 cursor-pointer transition-colors flex items-center gap-3 text-gray-900 border-b border-gray-100 last:border-b-0"
                          >
                            <User className="w-4 h-4 text-teal-500" />
                            <div>
                              <div className="font-medium">{person.name}</div>
                              <div className="text-sm text-gray-500">{person.email}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.deliveryPersonId && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                      {errors.deliveryPersonId}
                    </p>
                  )}
                </div>

                {/* Vehicle Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Vehicle *
                  </label>
                  <div className="relative vehicle-dropdown-container">
                    <Truck className="absolute left-4 top-4 w-5 h-5 text-gray-400 z-10" />
                    <div
                      onClick={() => setIsVehicleDropdownOpen(!isVehicleDropdownOpen)}
                      className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl transition-all duration-200 text-gray-900 min-h-[3rem] flex items-center cursor-pointer hover:shadow-md ${
                        errors.vehicleId 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-gray-200 hover:border-teal-300'
                      }`}
                    >
                      {getSelectedVehicle() ? (
                        <div className="flex items-center gap-3">
                          <span className="font-medium">
                            {getSelectedVehicle()?.brand} {getSelectedVehicle()?.model}
                          </span>
                          <span className="text-gray-500 text-sm">({getSelectedVehicle()?.plate})</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">Select vehicle...</span>
                      )}
                    </div>
                    
                    <ChevronDown 
                      className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform duration-200 ${
                        isVehicleDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                    
                    {isVehicleDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg z-[9999] max-h-48 overflow-y-auto">
                        {vehicles.filter(v => v.isAvailable).map((vehicle) => (
                          <div
                            key={vehicle.id}
                            onClick={() => handleDropdownSelect('vehicleId', vehicle.id, () => setIsVehicleDropdownOpen(false))}
                            className="px-4 py-3 hover:bg-teal-50 cursor-pointer transition-colors flex items-center gap-3 text-gray-900 border-b border-gray-100 last:border-b-0"
                          >
                            <Truck className="w-4 h-4 text-teal-500" />
                            <div>
                              <div className="font-medium">{vehicle.brand} {vehicle.model}</div>
                              <div className="text-sm text-gray-500">Plate: {vehicle.plate}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.vehicleId && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                      {errors.vehicleId}
                    </p>
                  )}
                </div>

                {/* Assignment Status */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Assignment Status *
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      name="assignmentStatus"
                      value={formData.assignmentStatus}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:shadow-lg focus:shadow-teal-500/20 transition-all duration-200 text-gray-900 appearance-none"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Assignment Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Assignment Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      name="assignedAt"
                      value={formData.assignedAt}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 text-gray-900 ${
                        errors.assignedAt 
                          ? 'border-red-300 focus:border-red-500 bg-red-50' 
                          : 'border-gray-200 focus:border-teal-500 focus:shadow-lg focus:shadow-teal-500/20'
                      }`}
                    />
                  </div>
                  {errors.assignedAt && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                      {errors.assignedAt}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Details Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-500" />
                Additional Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Return Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Return Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      name="returnedAt"
                      value={formData.returnedAt || ''}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:shadow-lg focus:shadow-teal-500/20 transition-all duration-200 text-gray-900"
                    />
                  </div>
                </div>

                {/* Assigned By */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Assigned By
                  </label>
                  <div className="relative assigned-by-dropdown-container">
                    <User className="absolute left-4 top-4 w-5 h-5 text-gray-400 z-10" />
                    <div
                      onClick={() => setIsAssignedByDropdownOpen(!isAssignedByDropdownOpen)}
                      className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl transition-all duration-200 text-gray-900 min-h-[3rem] flex items-center cursor-pointer hover:shadow-md hover:border-teal-300"
                    >
                      {getAssignedByUser() ? (
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{getAssignedByUser()?.name}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">Select user...</span>
                      )}
                    </div>
                    
                    <ChevronDown 
                      className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform duration-200 ${
                        isAssignedByDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                    
                    {isAssignedByDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg z-[9999] max-h-48 overflow-y-auto">
                        {users.map((user) => (
                          <div
                            key={user.id}
                            onClick={() => handleDropdownSelect('assignedBy', user.id, () => setIsAssignedByDropdownOpen(false))}
                            className="px-4 py-3 hover:bg-teal-50 cursor-pointer transition-colors flex items-center gap-3 text-gray-900 border-b border-gray-100 last:border-b-0"
                          >
                            <User className="w-4 h-4 text-teal-500" />
                            <span className="font-medium">{user.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Returned By */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Returned By
                  </label>
                  <div className="relative returned-by-dropdown-container">
                    <User className="absolute left-4 top-4 w-5 h-5 text-gray-400 z-10" />
                    <div
                      onClick={() => setIsReturnedByDropdownOpen(!isReturnedByDropdownOpen)}
                      className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl transition-all duration-200 text-gray-900 min-h-[3rem] flex items-center cursor-pointer hover:shadow-md hover:border-teal-300"
                    >
                      {getReturnedByUser() ? (
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{getReturnedByUser()?.name}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">Select user...</span>
                      )}
                    </div>
                    
                    <ChevronDown 
                      className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform duration-200 ${
                        isReturnedByDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                    
                    {isReturnedByDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg z-[9999] max-h-48 overflow-y-auto">
                        {users.map((user) => (
                          <div
                            key={user.id}
                            onClick={() => handleDropdownSelect('returnedBy', user.id, () => setIsReturnedByDropdownOpen(false))}
                            className="px-4 py-3 hover:bg-teal-50 cursor-pointer transition-colors flex items-center gap-3 text-gray-900 border-b border-gray-100 last:border-b-0"
                          >
                            <User className="w-4 h-4 text-teal-500" />
                            <span className="font-medium">{user.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Mileage at Assignment */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mileage at Assignment (Km)
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      name="mileageAtAssignment"
                      value={formData.mileageAtAssignment || ''}
                      onChange={handleChange}
                      min="0"
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 text-gray-900 ${
                        errors.mileageAtAssignment 
                          ? 'border-red-300 focus:border-red-500 bg-red-50' 
                          : 'border-gray-200 focus:border-teal-500 focus:shadow-lg focus:shadow-teal-500/20'
                      }`}
                      placeholder="Current mileage"
                    />
                  </div>
                  {errors.mileageAtAssignment && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                      {errors.mileageAtAssignment}
                    </p>
                  )}
                </div>

                {/* Mileage at Return */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mileage at Return (Km)
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      name="mileageAtReturn"
                      value={formData.mileageAtReturn || ''}
                      onChange={handleChange}
                      min="0"
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 text-gray-900 ${
                        errors.mileageAtReturn 
                          ? 'border-red-300 focus:border-red-500 bg-red-50' 
                          : 'border-gray-200 focus:border-teal-500 focus:shadow-lg focus:shadow-teal-500/20'
                      }`}
                      placeholder="Return mileage"
                    />
                  </div>
                  {errors.mileageAtReturn && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                      {errors.mileageAtReturn}
                    </p>
                  )}
                </div>

                {/* Condition at Assignment */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Condition at Assignment
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="conditionAtAssignment"
                      value={formData.conditionAtAssignment || ''}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:shadow-lg focus:shadow-teal-500/20 transition-all duration-200 text-gray-900"
                      placeholder="Vehicle condition at assignment"
                    />
                  </div>
                </div>

                {/* Condition at Return */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Condition at Return
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="conditionAtReturn"
                      value={formData.conditionAtReturn || ''}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:shadow-lg focus:shadow-teal-500/20 transition-all duration-200 text-gray-900"
                      placeholder="Vehicle condition at return"
                    />
                  </div>
                </div>
              </div>

              {/* Assignment Reason */}
              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Assignment Reason
                </label>
                <div className="relative">
                  <FileText className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <textarea
                    name="assignmentReason"
                    value={formData.assignmentReason || ''}
                    onChange={handleChange}
                    rows={2}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:shadow-lg focus:shadow-teal-500/20 transition-all duration-200 resize-none text-gray-900"
                    placeholder="Reason for this assignment..."
                  />
                </div>
              </div>

              {/* Return Reason */}
              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Return Reason
                </label>
                <div className="relative">
                  <FileText className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <textarea
                    name="returnReason"
                    value={formData.returnReason || ''}
                    onChange={handleChange}
                    rows={2}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:shadow-lg focus:shadow-teal-500/20 transition-all duration-200 resize-none text-gray-900"
                    placeholder="Reason for return (if applicable)..."
                  />
                </div>
              </div>

              {/* Comments */}
              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Comments
                </label>
                <div className="relative">
                  <FileText className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <textarea
                    name="comments"
                    value={formData.comments || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:shadow-lg focus:shadow-teal-500/20 transition-all duration-200 resize-none text-gray-900"
                    placeholder="Additional comments about the assignment..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex gap-4 justify-end mt-8 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all duration-200 font-semibold shadow-lg shadow-teal-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Users className="w-4 h-4" />
                  {assignment ? 'Update Assignment' : 'Create Assignment'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateY(-20px) scale(0.95);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default VehicleAssignmentModal;