import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Lock, Shield, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { apiService } from '../services/api';
import type { User as UserType, UserRegisterRequest } from '../services/api';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  user: UserType | null;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSave, user }) => {
  const [formData, setFormData] = useState<UserRegisterRequest>({
    productCode: 'FASTLYGO',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    planId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    profileImage: undefined
  });
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const availableRoleOptions = [
    { value: 'Admin', label: 'Administrator' },
    { value: 'Manager', label: 'Manager' },
    { value: 'DeliveryPerson', label: 'Delivery Person' },
    { value: 'Customer', label: 'Customer' },
    { value: 'BusinessOwner', label: 'Business Owner' },
    { value: 'Staff', label: 'Staff Member' }
  ];

  useEffect(() => {
    if (user) {
      const nameParts = user.fullName.split(' ');
      setFormData({
        productCode: 'FASTLYGO',
        email: user.email || '',
        password: '',
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        phoneNumber: user.phone || '',
        planId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        profileImage: undefined
      });
      setSelectedRoles(user.roles || []);
    } else {
      setFormData({
        productCode: 'FASTLYGO',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        planId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        profileImage: undefined
      });
      setSelectedRoles(['Customer']);
    }
    setErrors({});
  }, [user]);

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

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.length > 50) {
      newErrors.firstName = 'First name must be 50 characters or less';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.length > 50) {
      newErrors.lastName = 'Last name must be 50 characters or less';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (selectedRoles.length === 0) {
      newErrors.roles = 'Please select at least one role';
    }

    if (formData.phoneNumber) {
      const digitsOnly = formData.phoneNumber.replace(/\D/g, '');
      if (digitsOnly.length > 0 && digitsOnly.length < 7) {
        newErrors.phoneNumber = 'Phone number must have at least 7 digits';
      } else if (digitsOnly.length > 15) {
        newErrors.phoneNumber = 'Phone number must have no more than 15 digits';
      }
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
      if (user) {
        const updateData = {
          fullName: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phoneNumber?.replace(/\D/g, '') || '',
          roles: selectedRoles,
          isActive: true
        };
        response = await apiService.updateUser(user.id, updateData);
      } else {
        const registrationData = {
          ...formData,
          phoneNumber: formData.phoneNumber?.replace(/\D/g, '') || ''
        };
        response = await apiService.registerUser(registrationData);
      }

      console.log('Registration response:', response);
      if (response.success) {
        console.log('User registered successfully');
        onSave();
      } else {
        console.error('Registration failed:', response);
        alert('Failed to save user: ' + (response.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Failed to save user. Please try again. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleRoleSelect = (role: string) => {
    if (!selectedRoles.includes(role)) {
      setSelectedRoles(prev => [...prev, role]);
      
      if (errors.roles) {
        setErrors(prev => ({
          ...prev,
          roles: ''
        }));
      }
    }
    setIsRoleDropdownOpen(false);
  };

  const handleRoleRemove = (roleToRemove: string) => {
    setSelectedRoles(prev => prev.filter(role => role !== roleToRemove));
  };

  const getAvailableRoles = () => {
    return availableRoleOptions.filter(option => !selectedRoles.includes(option.value));
  };

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
              <User className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {user ? 'Edit User' : 'Register New User'}
            </h2>
          </div>
          <button onClick={onClose} className="w-10 h-10 hover:bg-gray-100 rounded-xl transition-colors flex items-center justify-center">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="px-8 pb-8">
          <div className="space-y-6">
            {/* User Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-teal-500" />
                User Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      maxLength={50}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 text-gray-900 ${
                        errors.firstName 
                          ? 'border-red-300 focus:border-red-500 bg-red-50' 
                          : 'border-gray-200 focus:border-teal-500 focus:shadow-lg focus:shadow-teal-500/20'
                      }`}
                      placeholder="Enter first name"
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                      {errors.firstName}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      maxLength={50}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 text-gray-900 ${
                        errors.lastName 
                          ? 'border-red-300 focus:border-red-500 bg-red-50' 
                          : 'border-gray-200 focus:border-teal-500 focus:shadow-lg focus:shadow-teal-500/20'
                      }`}
                      placeholder="Enter last name"
                    />
                  </div>
                  {errors.lastName && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                      {errors.lastName}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
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
                      placeholder="user@example.com"
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
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      maxLength={20}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 text-gray-900 ${
                        errors.phoneNumber 
                          ? 'border-red-300 focus:border-red-500 bg-red-50' 
                          : 'border-gray-200 focus:border-teal-500 focus:shadow-lg focus:shadow-teal-500/20'
                      }`}
                      placeholder="+1 (234) 567-8900"
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

                {/* Password - Always show */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 text-gray-900 ${
                        errors.password 
                          ? 'border-red-300 focus:border-red-500 bg-red-50' 
                          : 'border-gray-200 focus:border-teal-500 focus:shadow-lg focus:shadow-teal-500/20'
                      }`}
                      placeholder={user ? "Enter new password (min 6 characters)" : "Enter password (min 6 characters)"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Roles Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-teal-500" />
                User Roles
              </h3>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Assign Roles *
                </label>
                <div className="relative role-dropdown-container">
                  <Shield className="absolute left-4 top-4 w-5 h-5 text-gray-400 z-10" />
                  <div
                    onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                    className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl transition-all duration-200 text-gray-900 min-h-[3rem] flex flex-wrap items-center gap-2 cursor-pointer hover:shadow-md ${
                      errors.roles 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-200 hover:border-teal-300'
                    }`}
                  >
                    {/* Selected Roles as Bubbles */}
                    {selectedRoles.map(role => {
                      const roleOption = availableRoleOptions.find(opt => opt.value === role);
                      return (
                        <span
                          key={role}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium"
                        >
                          {roleOption?.label || role}
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
                      );
                    })}
                    
                    {/* Placeholder text */}
                    {selectedRoles.length === 0 && (
                      <span className="text-gray-400">Select roles...</span>
                    )}
                  </div>
                  
                  {/* Dropdown Arrow */}
                  <ChevronDown 
                    className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform duration-200 ${
                      isRoleDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                  
                  {/* Dropdown Options */}
                  {isRoleDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg z-[9999] max-h-48 overflow-y-auto">
                      {getAvailableRoles().length > 0 ? (
                        getAvailableRoles().map((role) => (
                          <div
                            key={role.value}
                            onClick={() => handleRoleSelect(role.value)}
                            className="px-4 py-3 hover:bg-teal-50 cursor-pointer transition-colors flex items-center gap-3 text-gray-900 border-b border-gray-100 last:border-b-0"
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
                {errors.roles && (
                  <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                    <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                    {errors.roles}
                  </p>
                )}
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
                  {user ? 'Update User' : 'Register User'}
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

export default UserModal;