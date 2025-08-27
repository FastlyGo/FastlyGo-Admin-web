import React, { useState, useEffect } from 'react';
import { X, User, Shield, Calendar, Star, Activity, MapPin, Clock, ChevronDown } from 'lucide-react';
import { apiService } from '../services/api';

interface DeliveryPerson {
  id?: string;
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

interface DeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  deliveryPerson: DeliveryPerson | null;
}

const DeliveryModal: React.FC<DeliveryModalProps> = ({ isOpen, onClose, onSave, deliveryPerson }) => {
  const [formData, setFormData] = useState<DeliveryPerson>({
    userId: '',
    licenseNumber: '',
    licenseExpiryDate: '',
    rating: undefined,
    maxActiveDeliveries: 3,
    currentLat: undefined,
    currentLng: undefined,
    isActive: true,
    isOnline: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  // Dropdown states
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // Available users (this would normally come from an API)
  const availableUsers = [
    { id: '550e8400-e29b-41d4-a716-446655440001', name: 'Carlos Rodriguez', email: 'carlos.rodriguez@example.com' },
    { id: '550e8400-e29b-41d4-a716-446655440002', name: 'Maria Garcia', email: 'maria.garcia@example.com' },
    { id: '550e8400-e29b-41d4-a716-446655440003', name: 'Juan Martinez', email: 'juan.martinez@example.com' },
    { id: '550e8400-e29b-41d4-a716-446655440004', name: 'Ana Fernandez', email: 'ana.fernandez@example.com' },
  ];

  useEffect(() => {
    if (deliveryPerson) {
      setFormData({
        ...deliveryPerson
      });
    } else {
      // Test data
      setFormData({
        userId: '550e8400-e29b-41d4-a716-446655440001',
        licenseNumber: 'DL123456789',
        licenseExpiryDate: '2026-05-15',
        rating: 4.5,
        maxActiveDeliveries: 3,
        currentLat: 10.4806,
        currentLng: -66.9036,
        isActive: true,
        isOnline: false
      });
    }
    setErrors({});
  }, [deliveryPerson]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isUserDropdownOpen && !target.closest('.user-dropdown-container')) {
        setIsUserDropdownOpen(false);
      }
    };

    if (isUserDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserDropdownOpen]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.userId.trim()) {
      newErrors.userId = 'User selection is required';
    }

    if (!formData.licenseNumber.trim()) {
      newErrors.licenseNumber = 'License number is required';
    } else if (formData.licenseNumber.length > 50) {
      newErrors.licenseNumber = 'License number must be 50 characters or less';
    }

    if (!formData.licenseExpiryDate) {
      newErrors.licenseExpiryDate = 'License expiry date is required';
    }

    if (formData.rating !== undefined && (formData.rating < 0 || formData.rating > 5)) {
      newErrors.rating = 'Rating must be between 0 and 5';
    }

    if (formData.currentLat !== undefined && (formData.currentLat < -90 || formData.currentLat > 90)) {
      newErrors.currentLat = 'Latitude must be between -90 and 90';
    }

    if (formData.currentLng !== undefined && (formData.currentLng < -180 || formData.currentLng > 180)) {
      newErrors.currentLng = 'Longitude must be between -180 and 180';
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
      if (deliveryPerson) {
        response = await apiService.put(`/api/admin/DeliveryPerson/${deliveryPerson.id}`, formData);
      } else {
        response = await apiService.post('/api/admin/DeliveryPerson', formData);
      }

      if (response.success) {
        onSave();
      }
    } catch (error) {
      console.error('Error saving delivery person:', error);
      alert('Failed to save delivery person. Please try again.');
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

  const handleUserSelect = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      userId
    }));
    setIsUserDropdownOpen(false);
    
    if (errors.userId) {
      setErrors(prev => ({
        ...prev,
        userId: ''
      }));
    }
  };

  const getSelectedUser = () => {
    return availableUsers.find(user => user.id === formData.userId);
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
              <User className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {deliveryPerson ? 'Edit Delivery Person' : 'Register New Delivery Person'}
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
                <User className="w-5 h-5 text-teal-500" />
                Basic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User Selection */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    User *
                  </label>
                  <div className="relative user-dropdown-container">
                    <User className="absolute left-4 top-4 w-5 h-5 text-gray-400 z-10" />
                    <div
                      onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                      className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl transition-all duration-200 text-gray-900 min-h-[3rem] flex items-center cursor-pointer hover:shadow-md ${
                        errors.userId 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-gray-200 hover:border-teal-300'
                      }`}
                    >
                      {getSelectedUser() ? (
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{getSelectedUser()?.name}</span>
                          <span className="text-gray-500 text-sm">({getSelectedUser()?.email})</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">Select a user...</span>
                      )}
                    </div>
                    
                    <ChevronDown 
                      className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform duration-200 ${
                        isUserDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                    
                    {isUserDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg z-[9999] max-h-48 overflow-y-auto">
                        {availableUsers.map((user) => (
                          <div
                            key={user.id}
                            onClick={() => handleUserSelect(user.id)}
                            className="px-4 py-3 hover:bg-teal-50 cursor-pointer transition-colors flex items-center gap-3 text-gray-900 border-b border-gray-100 last:border-b-0"
                          >
                            <User className="w-4 h-4 text-teal-500" />
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.userId && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                      {errors.userId}
                    </p>
                  )}
                </div>

                {/* License Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    License Number *
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      maxLength={50}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 text-gray-900 ${
                        errors.licenseNumber 
                          ? 'border-red-300 focus:border-red-500 bg-red-50' 
                          : 'border-gray-200 focus:border-teal-500 focus:shadow-lg focus:shadow-teal-500/20'
                      }`}
                      placeholder="Driver's license number (max 50 chars)"
                    />
                  </div>
                  {errors.licenseNumber && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                      {errors.licenseNumber}
                    </p>
                  )}
                </div>

                {/* License Expiry Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    License Expiry Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      name="licenseExpiryDate"
                      value={formData.licenseExpiryDate}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 text-gray-900 ${
                        errors.licenseExpiryDate 
                          ? 'border-red-300 focus:border-red-500 bg-red-50' 
                          : 'border-gray-200 focus:border-teal-500 focus:shadow-lg focus:shadow-teal-500/20'
                      }`}
                    />
                  </div>
                  {errors.licenseExpiryDate && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                      {errors.licenseExpiryDate}
                    </p>
                  )}
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Rating (0-5)
                  </label>
                  <div className="relative">
                    <Star className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      name="rating"
                      value={formData.rating || ''}
                      onChange={handleChange}
                      step="0.1"
                      min="0"
                      max="5"
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 text-gray-900 ${
                        errors.rating 
                          ? 'border-red-300 focus:border-red-500 bg-red-50' 
                          : 'border-gray-200 focus:border-teal-500 focus:shadow-lg focus:shadow-teal-500/20'
                      }`}
                      placeholder="Current rating (0-5)"
                    />
                  </div>
                  {errors.rating && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                      {errors.rating}
                    </p>
                  )}
                </div>

                {/* Max Active Deliveries */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Max Active Deliveries
                  </label>
                  <div className="relative">
                    <Activity className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      name="maxActiveDeliveries"
                      value={formData.maxActiveDeliveries}
                      onChange={handleChange}
                      min="1"
                      max="10"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:shadow-lg focus:shadow-teal-500/20 transition-all duration-200 text-gray-900"
                      placeholder="Maximum active deliveries"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-teal-500" />
                Current Location
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Current Latitude */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Latitude
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      name="currentLat"
                      value={formData.currentLat || ''}
                      onChange={handleChange}
                      step="any"
                      min="-90"
                      max="90"
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 text-gray-900 ${
                        errors.currentLat 
                          ? 'border-red-300 focus:border-red-500 bg-red-50' 
                          : 'border-gray-200 focus:border-teal-500 focus:shadow-lg focus:shadow-teal-500/20'
                      }`}
                      placeholder="Latitude (-90 to 90)"
                    />
                  </div>
                  {errors.currentLat && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                      {errors.currentLat}
                    </p>
                  )}
                </div>

                {/* Current Longitude */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Longitude
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      name="currentLng"
                      value={formData.currentLng || ''}
                      onChange={handleChange}
                      step="any"
                      min="-180"
                      max="180"
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 text-gray-900 ${
                        errors.currentLng 
                          ? 'border-red-300 focus:border-red-500 bg-red-50' 
                          : 'border-gray-200 focus:border-teal-500 focus:shadow-lg focus:shadow-teal-500/20'
                      }`}
                      placeholder="Longitude (-180 to 180)"
                    />
                  </div>
                  {errors.currentLng && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                      {errors.currentLng}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Status Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-teal-500" />
                Status Configuration
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Is Active */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Active Status
                  </label>
                  <div className="relative">
                    <Activity className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      name="isActive"
                      value={formData.isActive.toString()}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:shadow-lg focus:shadow-teal-500/20 transition-all duration-200 text-gray-900 appearance-none"
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Is Online */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Online Status
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      name="isOnline"
                      value={formData.isOnline.toString()}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:shadow-lg focus:shadow-teal-500/20 transition-all duration-200 text-gray-900 appearance-none"
                    >
                      <option value="true">Online</option>
                      <option value="false">Offline</option>
                    </select>
                  </div>
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
                  <User className="w-4 h-4" />
                  {deliveryPerson ? 'Update Person' : 'Register Person'}
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

export default DeliveryModal;