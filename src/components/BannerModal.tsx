import React, { useState, useEffect } from 'react';
import { X, Upload, Calendar, Hash, Link, FileText, Image as ImageIcon } from 'lucide-react';
import { apiService } from '../services/api';
import type { Banner, CreateBannerRequest, UpdateBannerRequest } from '../services/api';

interface BannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  banner?: Banner | null;
}

export const BannerModal: React.FC<BannerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  banner
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    actionUrl: '',
    businessId: '',
    startDate: '',
    endDate: '',
    priority: 1,
    imageFile: null as File | null
  });

  // Reset form when modal opens/closes or banner changes
  useEffect(() => {
    if (isOpen) {
      if (banner) {
        // Edit mode - populate with existing banner data
        setFormData({
          title: banner.title,
          description: banner.description || '',
          actionUrl: banner.actionUrl || '',
          businessId: banner.businessId || '',
          startDate: banner.startDate.split('T')[0], // Convert to YYYY-MM-DD format
          endDate: banner.endDate.split('T')[0],
          priority: banner.priority,
          imageFile: null
        });
        setPreviewUrl(banner.imageUrl);
      } else {
        // Create mode - empty form
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        setFormData({
          title: '',
          description: '',
          actionUrl: '',
          businessId: '',
          startDate: tomorrow.toISOString().split('T')[0],
          endDate: nextMonth.toISOString().split('T')[0],
          priority: 1,
          imageFile: null
        });
        setPreviewUrl('');
      }
      setErrors({});
    }
  }, [isOpen, banner]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, imageFile: 'Please select a valid image file' }));
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, imageFile: 'Image size must be less than 5MB' }));
        return;
      }

      setFormData(prev => ({ ...prev, imageFile: file }));

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Clear any existing file errors
      setErrors(prev => ({ ...prev, imageFile: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    if (formData.priority < 0) {
      newErrors.priority = 'Priority must be a positive number';
    }

    // Image validation
    if (!banner && !formData.imageFile) {
      newErrors.imageFile = 'Image is required for new banners';
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
      if (banner) {
        // Update existing banner
        const updateData: UpdateBannerRequest = {
          id: banner.id,
          title: formData.title,
          description: formData.description,
          actionUrl: formData.actionUrl,
          businessId: formData.businessId || undefined,
          startDate: formData.startDate,
          endDate: formData.endDate,
          priority: formData.priority,
          imageFile: formData.imageFile || undefined
        };

        const response = await apiService.updateBanner(banner.id, updateData);
        if (response.success) {
          onSave();
          onClose();
        } else {
          setErrors({ submit: 'Failed to update banner. Please try again.' });
        }
      } else {
        // Create new banner
        const createData: CreateBannerRequest = {
          title: formData.title,
          description: formData.description,
          actionUrl: formData.actionUrl,
          businessId: formData.businessId || undefined,
          startDate: formData.startDate,
          endDate: formData.endDate,
          priority: formData.priority,
          imageFile: formData.imageFile!
        };

        const response = await apiService.createBanner(createData);
        if (response.success) {
          onSave();
          onClose();
        } else {
          setErrors({ submit: 'Failed to create banner. Please try again.' });
        }
      }
    } catch (error) {
      console.error('Error saving banner:', error);
      setErrors({ submit: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {banner ? 'Edit Banner' : 'Create New Banner'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter banner title"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter banner description (optional)"
            />
          </div>

          {/* Action URL */}
          <div>
            <label htmlFor="actionUrl" className="block text-sm font-medium text-gray-700 mb-2">
              <Link className="w-4 h-4 inline mr-2" />
              Action URL
            </label>
            <input
              type="url"
              id="actionUrl"
              name="actionUrl"
              value={formData.actionUrl}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="https://example.com/promotion"
            />
          </div>

          {/* Priority */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
              <Hash className="w-4 h-4 inline mr-2" />
              Priority *
            </label>
            <input
              type="number"
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              min="0"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                errors.priority ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="0"
            />
            {errors.priority && <p className="mt-1 text-sm text-red-600">{errors.priority}</p>}
            <p className="mt-1 text-sm text-gray-500">Higher numbers have higher priority</p>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Start Date *
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  errors.startDate ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                End Date *
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  errors.endDate ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <ImageIcon className="w-4 h-4 inline mr-2" />
              Banner Image {!banner && '*'}
            </label>

            {/* Current/Preview Image */}
            {previewUrl && (
              <div className="mb-4">
                <img
                  src={previewUrl}
                  alt="Banner preview"
                  className="w-full h-48 object-cover rounded-lg border border-gray-300"
                />
              </div>
            )}

            {/* File Input */}
            <div className="relative">
              <input
                type="file"
                id="imageFile"
                name="imageFile"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className={`w-full px-3 py-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
                errors.imageFile ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-teal-400 hover:bg-teal-50'
              }`}>
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  {banner ? 'Click to change image' : 'Click to upload image'} or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
            </div>
            {errors.imageFile && <p className="mt-1 text-sm text-red-600">{errors.imageFile}</p>}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-teal-500 rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : banner ? 'Update Banner' : 'Create Banner'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};