import React, { useState, useEffect } from 'react';
import { X, Truck, Calendar, Palette, FileText, Wrench, Shield, DollarSign, Activity, ChevronDown } from 'lucide-react';
import { apiService } from '../services/api';

enum VehicleType {
  Motorcycle = 1,
  Car = 2,
  Bicycle = 3,
  Walking = 4
}

interface Vehicle {
  id?: string;
  vehicleType: VehicleType;
  brand?: string;
  model?: string;
  year?: number;
  plate: string;
  capacityKg: number;
  avgSpeedKmh: number;
  fuelCostPerKm: number;
  isAvailable: boolean;
  conditionStatus: string;
  color?: string;
  vinNumber?: string;
  insuranceExpiry?: string;
  maintenanceDueDate?: string;
  notes?: string;
}

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  vehicle: Vehicle | null;
}

const VehicleModal: React.FC<VehicleModalProps> = ({ isOpen, onClose, onSave, vehicle }) => {
  const [formData, setFormData] = useState<Vehicle>({
    vehicleType: VehicleType.Motorcycle,
    brand: '',
    model: '',
    year: undefined,
    plate: '',
    capacityKg: 0,
    avgSpeedKmh: 0,
    fuelCostPerKm: 0,
    isAvailable: true,
    conditionStatus: 'good',
    color: '',
    vinNumber: '',
    insuranceExpiry: '',
    maintenanceDueDate: '',
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isVehicleTypeDropdownOpen, setIsVehicleTypeDropdownOpen] = useState(false);

  const vehicleTypeOptions = [
    { value: VehicleType.Motorcycle, label: 'Motorcycle', icon: '🏍️' },
    { value: VehicleType.Car, label: 'Car', icon: '🚗' },
    { value: VehicleType.Bicycle, label: 'Bicycle', icon: '🚲' },
    { value: VehicleType.Walking, label: 'Walking', icon: '🚶' }
  ];

  const conditionStatusOptions = [
    'excellent',
    'good', 
    'fair',
    'poor',
    'maintenance'
  ];

  useEffect(() => {
    if (vehicle) {
      setFormData({
        ...vehicle
      });
    } else {
      // Test data
      setFormData({
        vehicleType: VehicleType.Motorcycle,
        brand: 'Honda',
        model: 'CB190R',
        year: 2023,
        plate: 'ABC-123',
        capacityKg: 15.5,
        avgSpeedKmh: 45.0,
        fuelCostPerKm: 0.08,
        isAvailable: true,
        conditionStatus: 'good',
        color: 'Red',
        vinNumber: 'VIN123456789',
        insuranceExpiry: '2025-12-31',
        maintenanceDueDate: '2024-12-31',
        notes: 'New motorcycle for delivery service'
      });
    }
    setErrors({});
  }, [vehicle]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isVehicleTypeDropdownOpen && !target.closest('.vehicle-type-dropdown-container')) {
        setIsVehicleTypeDropdownOpen(false);
      }
    };

    if (isVehicleTypeDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVehicleTypeDropdownOpen]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.plate.trim()) {
      newErrors.plate = 'Plate number is required';
    } else if (formData.plate.length > 20) {
      newErrors.plate = 'Plate number must be 20 characters or less';
    }

    if (formData.capacityKg <= 0) {
      newErrors.capacityKg = 'Capacity must be greater than 0';
    }

    if (formData.avgSpeedKmh <= 0) {
      newErrors.avgSpeedKmh = 'Average speed must be greater than 0';
    }

    if (formData.fuelCostPerKm < 0) {
      newErrors.fuelCostPerKm = 'Fuel cost cannot be negative';
    }

    if (formData.year && (formData.year < 1990 || formData.year > 2030)) {
      newErrors.year = 'Year must be between 1990 and 2030';
    }

    if (formData.brand && formData.brand.length > 50) {
      newErrors.brand = 'Brand must be 50 characters or less';
    }

    if (formData.model && formData.model.length > 50) {
      newErrors.model = 'Model must be 50 characters or less';
    }

    if (formData.color && formData.color.length > 30) {
      newErrors.color = 'Color must be 30 characters or less';
    }

    if (formData.vinNumber && formData.vinNumber.length > 50) {
      newErrors.vinNumber = 'VIN number must be 50 characters or less';
    }

    if (formData.conditionStatus.length > 20) {
      newErrors.conditionStatus = 'Condition status must be 20 characters or less';
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
      if (vehicle) {
        response = await apiService.put(`/api/admin/Vehicle/${vehicle.id}`, formData);
      } else {
        response = await apiService.post('/api/admin/Vehicle', formData);
      }

      if (response.success) {
        onSave();
      }
    } catch (error) {
      console.error('Error saving vehicle:', error);
      alert('Failed to save vehicle. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let inputValue: any = value;
    
    if (type === 'checkbox') {
      inputValue = (e.target as HTMLInputElement).checked;
    } else if (type === 'number') {
      inputValue = value === '' ? undefined : parseFloat(value);
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

  const handleVehicleTypeSelect = (vehicleType: VehicleType) => {
    setFormData(prev => ({
      ...prev,
      vehicleType
    }));
    setIsVehicleTypeDropdownOpen(false);
    
    if (errors.vehicleType) {
      setErrors(prev => ({
        ...prev,
        vehicleType: ''
      }));
    }
  };

  const getSelectedVehicleType = () => {
    return vehicleTypeOptions.find(option => option.value === formData.vehicleType);
  };

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
              <Truck className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {vehicle ? 'Edit Vehicle' : 'Register New Vehicle'}
            </h2>
          </div>
          <button onClick={onClose} className="w-10 h-10 hover:bg-gray-100 rounded-xl transition-colors flex items-center justify-center">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="px-8 pb-8">
          <div className="space-y-6">
            {/* Basic Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-teal-500" />
                Basic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Vehicle Type */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Vehicle Type *
                  </label>
                  <div className="relative vehicle-type-dropdown-container">
                    <Truck className="absolute left-4 top-4 w-5 h-5 text-gray-400 z-10" />
                    <div
                      onClick={() => setIsVehicleTypeDropdownOpen(!isVehicleTypeDropdownOpen)}
                      className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl transition-all duration-200 text-gray-900 min-h-[3rem] flex items-center cursor-pointer hover:shadow-md ${
                        errors.vehicleType 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-gray-200 hover:border-teal-300'
                      }`}
                    >
                      {getSelectedVehicleType() ? (
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{getSelectedVehicleType()?.icon}</span>
                          <span className="font-medium">{getSelectedVehicleType()?.label}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">Select vehicle type...</span>
                      )}
                    </div>
                    
                    <ChevronDown 
                      className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform duration-200 ${
                        isVehicleTypeDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                    
                    {isVehicleTypeDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg z-[9999] max-h-48 overflow-y-auto">
                        {vehicleTypeOptions.map((option) => (
                          <div
                            key={option.value}
                            onClick={() => handleVehicleTypeSelect(option.value)}
                            className="px-4 py-3 hover:bg-teal-50 cursor-pointer transition-colors flex items-center gap-3 text-gray-900 border-b border-gray-100 last:border-b-0"
                          >
                            <span className="text-xl">{option.icon}</span>
                            <span className="font-medium">{option.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.vehicleType && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                      {errors.vehicleType}
                    </p>
                  )}
                </div>

                {/* Brand */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Brand
                  </label>
                  <div className="relative">
                    <Truck className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand || ''}
                      onChange={handleChange}
                      maxLength={50}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 text-gray-900 ${
                        errors.brand 
                          ? 'border-red-300 focus:border-red-500 bg-red-50' 
                          : 'border-gray-200 focus:border-teal-500 focus:shadow-lg focus:shadow-teal-500/20'
                      }`}
                      placeholder="Enter vehicle brand (max 50 chars)"
                    />
                  </div>
                  {errors.brand && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                      {errors.brand}
                    </p>
                  )}
                </div>

                {/* Model */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Model
                  </label>
                  <div className="relative">
                    <Truck className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="model"
                      value={formData.model || ''}
                      onChange={handleChange}
                      maxLength={50}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 text-gray-900 ${
                        errors.model 
                          ? 'border-red-300 focus:border-red-500 bg-red-50' 
                          : 'border-gray-200 focus:border-teal-500 focus:shadow-lg focus:shadow-teal-500/20'
                      }`}
                      placeholder="Enter vehicle model (max 50 chars)"
                    />
                  </div>
                  {errors.model && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                      {errors.model}
                    </p>
                  )}
                </div>

                {/* Year */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Year
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      name="year"
                      value={formData.year || ''}
                      onChange={handleChange}
                      min="1990"
                      max="2030"
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 text-gray-900 ${
                        errors.year 
                          ? 'border-red-300 focus:border-red-500 bg-red-50' 
                          : 'border-gray-200 focus:border-teal-500 focus:shadow-lg focus:shadow-teal-500/20'
                      }`}
                      placeholder="Enter year (1990-2030)"
                    />
                  </div>
                  {errors.year && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                      {errors.year}
                    </p>
                  )}
                </div>

                {/* Plate */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Plate Number *
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="plate"
                      value={formData.plate}
                      onChange={handleChange}
                      maxLength={20}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 text-gray-900 ${
                        errors.plate 
                          ? 'border-red-300 focus:border-red-500 bg-red-50' 
                          : 'border-gray-200 focus:border-teal-500 focus:shadow-lg focus:shadow-teal-500/20'
                      }`}
                      placeholder="Enter plate number (max 20 chars)"
                    />
                  </div>
                  {errors.plate && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                      {errors.plate}
                    </p>
                  )}
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Color
                  </label>
                  <div className="relative">
                    <Palette className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="color"
                      value={formData.color || ''}
                      onChange={handleChange}
                      maxLength={30}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 text-gray-900 ${
                        errors.color 
                          ? 'border-red-300 focus:border-red-500 bg-red-50' 
                          : 'border-gray-200 focus:border-teal-500 focus:shadow-lg focus:shadow-teal-500/20'
                      }`}
                      placeholder="Enter vehicle color (max 30 chars)"
                    />
                  </div>
                  {errors.color && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                      {errors.color}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Technical Specifications Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-teal-500" />
                Technical Specifications
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Capacity */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Capacity (Kg) *
                  </label>
                  <div className="relative">
                    <Activity className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      name="capacityKg"
                      value={formData.capacityKg || ''}
                      onChange={handleChange}
                      min="0.01"
                      step="0.01"
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 text-gray-900 ${
                        errors.capacityKg 
                          ? 'border-red-300 focus:border-red-500 bg-red-50' 
                          : 'border-gray-200 focus:border-teal-500 focus:shadow-lg focus:shadow-teal-500/20'
                      }`}
                      placeholder="Load capacity in kg"
                    />
                  </div>
                  {errors.capacityKg && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                      {errors.capacityKg}
                    </p>
                  )}
                </div>

                {/* Average Speed */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Avg Speed (Km/h) *
                  </label>
                  <div className="relative">
                    <Activity className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      name="avgSpeedKmh"
                      value={formData.avgSpeedKmh || ''}
                      onChange={handleChange}
                      min="0.1"
                      step="0.1"
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 text-gray-900 ${
                        errors.avgSpeedKmh 
                          ? 'border-red-300 focus:border-red-500 bg-red-50' 
                          : 'border-gray-200 focus:border-teal-500 focus:shadow-lg focus:shadow-teal-500/20'
                      }`}
                      placeholder="Average speed in km/h"
                    />
                  </div>
                  {errors.avgSpeedKmh && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                      {errors.avgSpeedKmh}
                    </p>
                  )}
                </div>

                {/* Fuel Cost */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Fuel Cost (per Km)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      name="fuelCostPerKm"
                      value={formData.fuelCostPerKm || ''}
                      onChange={handleChange}
                      min="0"
                      step="0.001"
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 text-gray-900 ${
                        errors.fuelCostPerKm 
                          ? 'border-red-300 focus:border-red-500 bg-red-50' 
                          : 'border-gray-200 focus:border-teal-500 focus:shadow-lg focus:shadow-teal-500/20'
                      }`}
                      placeholder="Cost per kilometer"
                    />
                  </div>
                  {errors.fuelCostPerKm && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                      {errors.fuelCostPerKm}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-500" />
                Additional Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* VIN Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    VIN Number
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="vinNumber"
                      value={formData.vinNumber || ''}
                      onChange={handleChange}
                      maxLength={50}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 text-gray-900 ${
                        errors.vinNumber 
                          ? 'border-red-300 focus:border-red-500 bg-red-50' 
                          : 'border-gray-200 focus:border-teal-500 focus:shadow-lg focus:shadow-teal-500/20'
                      }`}
                      placeholder="Vehicle Identification Number (max 50 chars)"
                    />
                  </div>
                  {errors.vinNumber && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                      {errors.vinNumber}
                    </p>
                  )}
                </div>

                {/* Condition Status */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Condition Status
                  </label>
                  <div className="relative">
                    <Wrench className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      name="conditionStatus"
                      value={formData.conditionStatus}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 text-gray-900 appearance-none ${
                        errors.conditionStatus 
                          ? 'border-red-300 focus:border-red-500 bg-red-50' 
                          : 'border-gray-200 focus:border-teal-500 focus:shadow-lg focus:shadow-teal-500/20'
                      }`}
                    >
                      {conditionStatusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.conditionStatus && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                      {errors.conditionStatus}
                    </p>
                  )}
                </div>

                {/* Insurance Expiry */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Insurance Expiry
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      name="insuranceExpiry"
                      value={formData.insuranceExpiry || ''}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:shadow-lg focus:shadow-teal-500/20 transition-all duration-200 text-gray-900"
                    />
                  </div>
                </div>

                {/* Maintenance Due Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Maintenance Due Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      name="maintenanceDueDate"
                      value={formData.maintenanceDueDate || ''}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:shadow-lg focus:shadow-teal-500/20 transition-all duration-200 text-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notes
                </label>
                <div className="relative">
                  <FileText className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <textarea
                    name="notes"
                    value={formData.notes || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:shadow-lg focus:shadow-teal-500/20 transition-all duration-200 resize-none text-gray-900"
                    placeholder="Additional notes about the vehicle..."
                  />
                </div>
              </div>

              {/* Availability Toggle */}
              <div className="mt-6">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleChange}
                    className="w-5 h-5 text-teal-600 border-2 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                  />
                  <span className="text-sm font-semibold text-gray-700">Vehicle is available for assignments</span>
                </label>
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
                  <Truck className="w-4 h-4" />
                  {vehicle ? 'Update Vehicle' : 'Register Vehicle'}
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

export default VehicleModal;