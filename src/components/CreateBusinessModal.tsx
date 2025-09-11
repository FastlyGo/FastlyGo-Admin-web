import React, { useState, useEffect } from 'react';
import { X, Building, Mail, Phone, Globe, Hash, Image, FileText, ChevronDown, User } from 'lucide-react';
import { useBusinessStore } from '../stores/businessStore';
import { useAuthStore } from '../stores/authStore';
import { apiService } from '../services/api';
import type { CreateBusinessRequest, MerchantUser } from '../services/api';

interface CreateBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBusinessCreated?: () => void;
}

// Available business types - these should come from the backend
const BUSINESS_TYPES = [
  { value: 1, label: 'Restaurant' },
  { value: 2, label: 'Store' },
  { value: 3, label: 'Pharmacy' },
  { value: 4, label: 'Supermarket' },
  { value: 5, label: 'Other' }
];

export const CreateBusinessModal = ({ isOpen, onClose, onBusinessCreated }: CreateBusinessModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    email: '',
    phone: '',
    website: '',
    taxId: '',
    businessType: 1,
    userId: '',
    logoUrl: '',
    coverUrl: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isBusinessTypeDropdownOpen, setIsBusinessTypeDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [merchantUsers, setMerchantUsers] = useState<MerchantUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  
  const { createBusiness } = useBusinessStore();
  const { user } = useAuthStore();

  // Fetch merchant users when modal opens
  useEffect(() => {
    if (isOpen && merchantUsers.length === 0) {
      setIsLoadingUsers(true);
      apiService.getMerchantUsers()
        .then(response => {
          if (response.success && response.data) {
            setMerchantUsers(response.data);
          }
        })
        .catch(error => {
          console.error('Error fetching merchant users:', error);
        })
        .finally(() => {
          setIsLoadingUsers(false);
        });
    }
  }, [isOpen, merchantUsers.length]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isBusinessTypeDropdownOpen && !target.closest('.business-type-dropdown-container')) {
        setIsBusinessTypeDropdownOpen(false);
      }
      if (isUserDropdownOpen && !target.closest('.user-dropdown-container')) {
        setIsUserDropdownOpen(false);
      }
    };

    if (isBusinessTypeDropdownOpen || isUserDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isBusinessTypeDropdownOpen, isUserDropdownOpen]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Business name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.website.trim()) {
      newErrors.website = 'Website is required';
    }

    if (!formData.taxId.trim()) {
      newErrors.taxId = 'Tax ID is required';
    }

    if (!formData.userId) {
      newErrors.userId = 'Please select a responsible user';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBusinessTypeSelect = (businessType: number) => {
    setFormData(prev => ({
      ...prev,
      businessType
    }));
    setIsBusinessTypeDropdownOpen(false);
    
    if (errors.businessType) {
      setErrors(prev => ({
        ...prev,
        businessType: ''
      }));
    }
  };

  const getSelectedBusinessType = () => {
    return BUSINESS_TYPES.find(type => type.value === formData.businessType);
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
    return merchantUsers.find(user => user.id === formData.userId);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      email: '',
      phone: '',
      website: '',
      taxId: '',
      businessType: 1,
      userId: '',
      logoUrl: '',
      coverUrl: ''
    });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const businessData: CreateBusinessRequest = {
        name: formData.name,
        description: formData.description,
        email: formData.email,
        phone: formData.phone,
        website: formData.website.startsWith('http') ? formData.website : `https://${formData.website}`,
        taxId: formData.taxId,
        businessType: formData.businessType,
        userId: formData.userId,
        statusId: 1, // Active status by default
        logoUrl: formData.logoUrl || '',
        coverUrl: formData.coverUrl || '',
      };

      await createBusiness(businessData);
      
      // Success
      resetForm();
      onBusinessCreated?.();
      onClose();
    } catch (err: any) {
      setErrors({ submit: err.message || 'Error creating business' });
    } finally {
      setIsLoading(false);
    }
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
              <Building className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Create New Business
            </h2>
          </div>
          <button onClick={handleClose} className="w-10 h-10 hover:bg-gray-100 rounded-xl transition-colors flex items-center justify-center">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="px-8 pb-8">
          <div className="space-y-6">
            {/* Basic Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Building className="w-5 h-5 text-teal-500" />
                Basic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Business Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Business Name *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 text-gray-900 ${
                        errors.name 
                          ? 'border-red-300 focus:border-red-500 bg-red-50' 
                          : 'border-gray-200 focus:border-teal-500 focus:shadow-lg focus:shadow-teal-500/20'
                      }`}
                      placeholder="e.g., El Buen Sabor Restaurant"
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
                  <div className="relative business-type-dropdown-container">
                    <Building className="absolute left-4 top-4 w-5 h-5 text-gray-400 z-10" />
                    <div
                      onClick={() => setIsBusinessTypeDropdownOpen(!isBusinessTypeDropdownOpen)}
                      className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl transition-all duration-200 text-gray-900 min-h-[3rem] flex items-center cursor-pointer hover:shadow-md ${
                        errors.businessType 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-gray-200 hover:border-teal-300'
                      }`}
                    >
                      <span className="font-medium">{getSelectedBusinessType()?.label}</span>
                    </div>
                    
                    <ChevronDown 
                      className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform duration-200 ${
                        isBusinessTypeDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                    
                    {isBusinessTypeDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg z-[9999] max-h-48 overflow-y-auto">
                        {BUSINESS_TYPES.map((type) => (
                          <div
                            key={type.value}
                            onClick={() => handleBusinessTypeSelect(type.value)}
                            className="px-4 py-3 hover:bg-teal-50 cursor-pointer transition-colors flex items-center gap-3 text-gray-900 border-b border-gray-100 last:border-b-0"
                          >
                            <Building className="w-4 h-4 text-teal-500" />
                            <div className="font-medium">{type.label}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.businessType && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                      {errors.businessType}
                    </p>
                  )}
                </div>

                {/* Tax ID */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tax ID / RUC *
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="taxId"
                      value={formData.taxId}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 text-gray-900 ${
                        errors.taxId 
                          ? 'border-red-300 focus:border-red-500 bg-red-50' 
                          : 'border-gray-200 focus:border-teal-500 focus:shadow-lg focus:shadow-teal-500/20'
                      }`}
                      placeholder="12345678901"
                    />
                  </div>
                  {errors.taxId && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                      {errors.taxId}
                    </p>
                  )}
                </div>

                {/* Responsible User */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Responsible User *
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
                      {isLoadingUsers ? (
                        <span className="text-gray-500">Loading users...</span>
                      ) : getSelectedUser() ? (
                        <div>
                          <span className="font-medium">{getSelectedUser()?.fullName}</span>
                          <span className="text-gray-500 text-sm ml-2">({getSelectedUser()?.email})</span>
                        </div>
                      ) : (
                        <span className="text-gray-500">Select a responsible user</span>
                      )}
                    </div>
                    
                    <ChevronDown 
                      className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform duration-200 ${
                        isUserDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                    
                    {isUserDropdownOpen && !isLoadingUsers && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg z-[9999] max-h-48 overflow-y-auto">
                        {merchantUsers.length === 0 ? (
                          <div className="px-4 py-3 text-gray-500 text-center">
                            No merchant users available
                          </div>
                        ) : (
                          merchantUsers.map((user) => (
                            <div
                              key={user.id}
                              onClick={() => handleUserSelect(user.id)}
                              className="px-4 py-3 hover:bg-teal-50 cursor-pointer transition-colors flex items-center gap-3 text-gray-900 border-b border-gray-100 last:border-b-0"
                            >
                              <User className="w-4 h-4 text-teal-500" />
                              <div>
                                <div className="font-medium">{user.fullName}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                                {user.phone && (
                                  <div className="text-xs text-gray-400">{user.phone}</div>
                                )}
                              </div>
                            </div>
                          ))
                        )}
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
              </div>
            </div>

            {/* Description Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-500" />
                Description
              </h3>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Business Description *
                </label>
                <div className="relative">
                  <FileText className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 text-gray-900 resize-none ${
                      errors.description 
                        ? 'border-red-300 focus:border-red-500 bg-red-50' 
                        : 'border-gray-200 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20'
                    }`}
                    placeholder="Describe the business, its specialties, hours, etc."
                  />
                </div>
                {errors.description && (
                  <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                    <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                    {errors.description}
                  </p>
                )}
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-teal-500" />
                Contact Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      onChange={handleInputChange}
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
                    Phone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 text-gray-900 ${
                        errors.phone 
                          ? 'border-red-300 focus:border-red-500 bg-red-50' 
                          : 'border-gray-200 focus:border-teal-500 focus:shadow-lg focus:shadow-teal-500/20'
                      }`}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Website */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Website *
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 text-gray-900 ${
                        errors.website 
                          ? 'border-red-300 focus:border-red-500 bg-red-50' 
                          : 'border-gray-200 focus:border-teal-500 focus:shadow-lg focus:shadow-teal-500/20'
                      }`}
                      placeholder="www.mybusiness.com"
                    />
                  </div>
                  {errors.website && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                      {errors.website}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Media Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Image className="w-5 h-5 text-teal-500" />
                Media (Optional)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Logo URL */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Logo URL
                  </label>
                  <div className="relative">
                    <Image className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      name="logoUrl"
                      value={formData.logoUrl}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:shadow-lg focus:shadow-teal-500/20 transition-all duration-200 text-gray-900"
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                </div>

                {/* Cover URL */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cover URL
                  </label>
                  <div className="relative">
                    <Image className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      name="coverUrl"
                      value={formData.coverUrl}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:shadow-lg focus:shadow-teal-500/20 transition-all duration-200 text-gray-900"
                      placeholder="https://example.com/cover.png"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm">{errors.submit}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex gap-4 justify-end mt-8 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={handleClose}
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
                  Creating...
                </>
              ) : (
                <>
                  <Building className="w-4 h-4" />
                  Create Business
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