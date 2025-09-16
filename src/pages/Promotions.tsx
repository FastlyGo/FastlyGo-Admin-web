import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Edit2, Trash2, Tag, Calendar, Users, TrendingUp, Image as ImageIcon, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { MetricCard } from '../components/MetricCard';
import { BannerModal } from '../components/BannerModal';
import { apiService } from '../services/api';
import type { Banner, BannerStats, PaginatedResponse } from '../services/api';

export const Promotions = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });
  const [stats, setStats] = useState<BannerStats>({
    totalBanners: 0,
    activeBanners: 0,
    inactiveBanners: 0,
    currentActiveBanners: 0,
    expiredBanners: 0,
    scheduledBanners: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  useEffect(() => {
    loadBanners();
    if (pagination.page === 1) {
      loadStats();
    }
  }, [pagination.page, searchTerm]);

  const loadBanners = async () => {
    try {
      setLoading(true);
      console.log('🔍 Loading banners with pagination...');

      const response = await apiService.getAllBanners({
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: searchTerm || undefined
      });

      console.log('📊 Banners API Response:', response);

      if (response.success) {
        if (Array.isArray(response.data)) {
          // Backend devuelve array directo - paginación del lado cliente
          const startIndex = (pagination.page - 1) * pagination.pageSize;
          const endIndex = startIndex + pagination.pageSize;
          const paginatedBanners = response.data.slice(startIndex, endIndex);

          setBanners(paginatedBanners);
          setPagination(prev => ({
            ...prev,
            totalCount: response.data.length,
            totalPages: Math.ceil(response.data.length / pagination.pageSize),
            hasNextPage: endIndex < response.data.length,
            hasPreviousPage: pagination.page > 1
          }));
        } else {
          // Backend soporta paginación real
          setBanners(response.data.data);
          setPagination(prev => ({
            ...prev,
            totalCount: response.data.totalCount,
            totalPages: response.data.totalPages,
            hasNextPage: response.data.hasNextPage,
            hasPreviousPage: response.data.hasPreviousPage
          }));
        }
      } else {
        console.warn('⚠️ API returned success: false', response);
        setBanners([]);
      }
    } catch (error) {
      console.error('❌ Error loading banners:', error);
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await apiService.getBannerStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('❌ Error loading banner stats:', error);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPagination(prev => ({ ...prev, page: 1, pageSize: newPageSize }));
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setIsCreateModalOpen(true);
  };

  const handleModalSave = async () => {
    setIsCreateModalOpen(false);
    setEditingBanner(null);
    await loadBanners();
    await loadStats();
  };

  const handleDelete = async (bannerId: string) => {
    if (confirm('Are you sure you want to delete this banner?')) {
      try {
        const response = await apiService.deleteBanner(bannerId);
        if (response.success) {
          await loadBanners();
          await loadStats();
        }
      } catch (error) {
        console.error('❌ Error deleting banner:', error);
        alert('Failed to delete banner. Please try again.');
      }
    }
  };

  const toggleBannerStatus = async (bannerId: string) => {
    // Note: This would require a specific API endpoint to toggle status
    // For now, we'll just reload the data
    console.log('Toggle banner status:', bannerId);
    // await loadBanners();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isCurrentlyActive = (banner: Banner) => {
    const now = new Date();
    const start = new Date(banner.startDate);
    const end = new Date(banner.endDate);
    return banner.isActive && start <= now && end >= now;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <PageHeader
        franchiseName="Franchise Promotions"
        businessType="Manage promotional campaigns and discounts"
        onBack={() => navigate('/')}
        showShare={false}
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
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search banners by title or description..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition-colors"
              />
            </div>
            <button className="p-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <MetricCard
            title="Total Banners"
            value={stats.totalBanners}
            icon={<Tag className="w-6 h-6" />}
          />
          <MetricCard
            title="Active Banners"
            value={stats.activeBanners}
            icon={<TrendingUp className="w-6 h-6" />}
          />
          <MetricCard
            title="Currently Live"
            value={stats.currentActiveBanners}
            icon={<Calendar className="w-6 h-6" />}
          />
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">
              Add New Banner
            </h3>
            <button
              onClick={() => {
                setEditingBanner(null);
                setIsCreateModalOpen(true);
              }}
              className="mt-2 w-16 h-16 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-colors inline-flex items-center justify-center"
            >
              <Plus className="w-8 h-8" />
            </button>
          </div>
        </div>

        {/* Banners Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Banner Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Period
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      <div className="flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mr-3"></div>
                        Loading banners...
                      </div>
                    </td>
                  </tr>
                ) : banners.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      No banners found
                    </td>
                  </tr>
                ) : (
                  banners.map((banner, index) => (
                    <tr key={banner.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(pagination.page - 1) * pagination.pageSize + index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <div className="text-sm font-medium text-gray-900 truncate">{banner.title}</div>
                          <div className="text-sm text-gray-500 truncate">{banner.description || 'No description'}</div>
                          {banner.actionUrl && (
                            <div className="text-xs text-blue-600 truncate mt-1">
                              <a href={banner.actionUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                {banner.actionUrl}
                              </a>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                          {banner.imageUrl ? (
                            <img
                              src={banner.imageUrl}
                              alt={banner.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {banner.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div>{formatDate(banner.startDate)}</div>
                          <div className="text-gray-500">to {formatDate(banner.endDate)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${
                            banner.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {banner.isActive ? 'Active' : 'Inactive'}
                          </span>
                          {banner.isActive && (
                            <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${
                              isCurrentlyActive(banner)
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {isCurrentlyActive(banner) ? 'Live' : 'Scheduled'}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => window.open(banner.imageUrl, '_blank')}
                            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            title="View Image"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(banner)}
                            className="p-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
                            title="Edit Banner"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(banner.id)}
                            className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                            title="Delete Banner"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && banners.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-600">
                    Showing {(pagination.page - 1) * pagination.pageSize + 1} to{' '}
                    {Math.min(pagination.page * pagination.pageSize, pagination.totalCount)} of{' '}
                    {pagination.totalCount} banners
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Show:</span>
                    <select
                      value={pagination.pageSize}
                      onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                    <span className="text-sm text-gray-600">per page</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.hasPreviousPage}
                    className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      const startPage = Math.max(1, pagination.page - 2);
                      const pageNumber = startPage + i;
                      if (pageNumber > pagination.totalPages) return null;

                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`px-3 py-2 text-sm font-medium rounded-md ${
                            pageNumber === pagination.page
                              ? 'bg-teal-500 text-white'
                              : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasNextPage}
                    className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Banner Modal */}
      <BannerModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingBanner(null);
        }}
        onSave={handleModalSave}
        banner={editingBanner}
      />
    </div>
  );
}; 