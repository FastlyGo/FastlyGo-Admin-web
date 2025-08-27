import React, { useState, useEffect } from 'react';
import { X, Building2, Mail, Phone, MapPin, User, Shield, ChevronDown } from 'lucide-react';
import { apiService } from '../services/api';
import type { Business } from '../types/business';

interface BusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  business: Business | null;
}

const BusinessModal: React.FC<BusinessModalProps> = ({ isOpen, onClose, onSave, business }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessType: '',
    description: '',
    address: '',
    isActive: true,
    responsibleUserEmail: 'test@example.com',
    responsibleUserRoles: ['Admin', 'Manager']
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  useEffect(() => {
    if (business) {
      setFormData({
        name: business.name || '',
        email: business.email || '',
        phone: business.phone || '',
        businessType: business.businessType?.toString() || '',
        description: business.description || '',
        address: business.address || '',
        isActive: business.isActive !== undefined ? business.isActive : true,
        responsibleUserEmail: 'test@example.com',
        responsibleUserRoles: ['Admin', 'Manager']
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        businessType: '',
        description: '',
        address: '',
        isActive: true,
        responsibleUserEmail: 'test@example.com',
        responsibleUserRoles: ['Admin', 'Manager']
      });
    }
    setErrors({});
  }, [business]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isRoleDropdownOpen && !target.closest('.role-dropdown-container')) {
        setIsRoleDropdownOpen(false);
      }
    };

    if (isRoleDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isRoleDropdownOpen]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Business name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.businessType) {
      newErrors.businessType = 'Business type is required';
    }

    if (!business && formData.responsibleUserEmail && formData.responsibleUserRoles.length === 0) {
      newErrors.responsibleUserRoles = 'Please select at least one role for the user';
    }

    if (!business && formData.responsibleUserEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.responsibleUserEmail)) {
      newErrors.responsibleUserEmail = 'Please enter a valid email for the responsible user';
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
      const payload = {
        ...formData,
        businessType: parseInt(formData.businessType),
        responsibleUserRoles: formData.responsibleUserRoles
      };

      let response;
      if (business) {
        response = await apiService.put(`/Business/${business.id}`, payload);
      } else {
        response = await apiService.post('/Business', payload);
      }

      if (response.success) {
        onSave();
      }
    } catch (error) {
      console.error('Error saving business:', error);
      alert('Failed to save business. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleRoleSelect = (role: string) => {
    if (!formData.responsibleUserRoles.includes(role)) {
      setFormData(prev => ({
        ...prev,
        responsibleUserRoles: [...prev.responsibleUserRoles, role]
      }));
      
      // Clear error when user selects roles
      if (errors.responsibleUserRoles) {
        setErrors(prev => ({
          ...prev,
          responsibleUserRoles: ''
        }));
      }
    }
    setIsRoleDropdownOpen(false);
  };

  const handleRoleRemove = (roleToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      responsibleUserRoles: prev.responsibleUserRoles.filter(role => role !== roleToRemove)
    }));
  };

  const availableRoles = [
    { value: 'Admin', label: 'Administrator' },
    { value: 'Manager', label: 'Manager' },
    { value: 'Staff', label: 'Staff Member' },
    { value: 'Owner', label: 'Business Owner' }
  ].filter(role => !formData.responsibleUserRoles.includes(role.value));

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-screen overflow-y-auto"
        style={{
          animation: 'slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          maxHeight: '90vh'
        }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {business ? 'Edit Business' : 'Register New Business'}
            </h2>
          </div>
          <button onClick={onClose} className="w-10 h-10 hover:bg-gray-100 rounded-xl transition-colors flex items-center justify-center">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="px-8 pb-8">
          <div className="space-y-6">
            {/* Business Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-teal-500" />
                Business Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Business Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Business Name *
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 text-gray-900 ${
                        errors.name 
                          ? 'border-red-300 focus:border-red-500 bg-red-50' 
                          : 'border-gray-200 focus:border-teal-500 focus:shadow-lg focus:shadow-teal-500/20'
                      }`}
                      placeholder="Enter business name"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Business Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Business Type *
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 appearance-none text-gray-900 ${
                        errors.businessType 
                          ? 'border-red-300 focus:border-red-500 bg-red-50' 
                          : 'border-gray-200 focus:border-teal-500 focus:shadow-lg focus:shadow-teal-500/20'
                      }`}
                    >
                      <option value="">Select a type</option>
                      <option value="1">Restaurant</option>
                      <option value="2">Drugstore</option>
                      <option value="3">Supermarket</option>
                    </select>
                  </div>
                  {errors.businessType && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                      {errors.businessType}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Business Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 text-gray-900 ${
                        errors.email 
                          ? 'border-red-300 focus:border-red-500 bg-red-50' 
                          : 'border-gray-200 focus:border-teal-500 focus:shadow-lg focus:shadow-teal-500/20'
                      }`}
                      placeholder="business@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:shadow-lg focus:shadow-teal-500/20 transition-all duration-200 text-gray-900"
                      placeholder="+1 (234) 567-8900"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Business Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:shadow-lg focus:shadow-teal-500/20 transition-all duration-200 text-gray-900"
                    placeholder="123 Main Street, City, State 12345"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:shadow-lg focus:shadow-teal-500/20 transition-all duration-200 resize-none text-gray-900"
                  placeholder="Brief description of the business..."
                />
              </div>
            </div>

            {/* User Assignment Section - Only for new businesses */}
            {!business && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-teal-500" />
                  Assign Responsible User (Optional)
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* User Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      User Email
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="responsibleUserEmail"
                        value={formData.responsibleUserEmail}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 text-gray-900 ${
                          errors.responsibleUserEmail 
                            ? 'border-red-300 focus:border-red-500 bg-red-50' 
                            : 'border-gray-200 focus:border-teal-500 focus:shadow-lg focus:shadow-teal-500/20'
                        }`}
                        placeholder="user@example.com"
                      />
                    </div>
                    {errors.responsibleUserEmail && (
                      <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                        {errors.responsibleUserEmail}
                      </p>
                    )}
                  </div>

                  {/* User Roles */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      User Roles
                    </label>
                    <div className="relative role-dropdown-container">
                      <Shield className="absolute left-4 top-4 w-5 h-5 text-gray-400 z-10" />
                      <div
                        onClick={() => {
                          console.log('Dropdown clicked, email:', formData.responsibleUserEmail);
                          console.log('Current dropdown state:', isRoleDropdownOpen);
                          if (formData.responsibleUserEmail) {
                            const newState = !isRoleDropdownOpen;
                            console.log('Setting dropdown to:', newState);
                            setIsRoleDropdownOpen(newState);
                          }
                        }}
                        className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl transition-all duration-200 text-gray-900 min-h-[3rem] flex flex-wrap items-center gap-2 ${
                          errors.responsibleUserRoles 
                            ? 'border-red-300 bg-red-50' 
                            : 'border-gray-200 hover:border-teal-300'
                        } ${!formData.responsibleUserEmail ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}`}
                      >
                        {/* Selected Roles as Bubbles */}
                        {formData.responsibleUserRoles.map(role => (
                          <span
                            key={role}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium"
                          >
                            {role}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRoleRemove(role);
                              }}
                              className="hover:bg-teal-200 rounded-full p-0.5 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                        
                        {/* Placeholder text */}
                        {formData.responsibleUserRoles.length === 0 && (
                          <span className="text-gray-400">Select roles...</span>
                        )}
                      </div>
                      
                      {/* Dropdown Arrow */}
                      <ChevronDown 
                        className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform duration-200 ${
                          isRoleDropdownOpen ? 'rotate-180' : ''
                        } ${!formData.responsibleUserEmail ? 'opacity-50' : ''}`}
                      />
                      
                      {/* Dropdown Options */}
                      {console.log('Rendering dropdown check:', isRoleDropdownOpen, formData.responsibleUserEmail)}
                      {isRoleDropdownOpen && formData.responsibleUserEmail && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg z-[9999] max-h-48 overflow-y-auto">
                          {console.log('Available roles:', availableRoles)}
                          {availableRoles.length > 0 ? (
                            availableRoles.map((role) => (
                              <div
                                key={role.value}
                                onClick={() => {
                                  console.log('Role selected:', role.value);
                                  handleRoleSelect(role.value);
                                }}
                                className="px-4 py-3 hover:bg-teal-50 cursor-pointer transition-colors flex items-center gap-3 text-gray-900"
                              >
                                <Shield className="w-4 h-4 text-teal-500" />
                                <span className="font-medium">{role.label}</span>
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-gray-500 text-center">
                              All roles selected
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {errors.responsibleUserRoles && (
                      <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                        {errors.responsibleUserRoles}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
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
                  <Building2 className="w-4 h-4" />
                  {business ? 'Update Business' : 'Register Business'}
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

export default BusinessModal;