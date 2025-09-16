import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, TrendingUp, DollarSign, Users, Calendar, Store, Pizza, Coffee, ShoppingCart, Pill, Building2 } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { MetricCard } from '../components/MetricCard';
import { CustomBarChart } from '../components/CustomBarChart';
import { apiService } from '../services/api';
import type { BusinessForReport, FranchiseReportData } from '../services/api';

export const SalesReport = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFranchise, setSelectedFranchise] = useState<BusinessForReport | null>(null);
  const [businesses, setBusinesses] = useState<BusinessForReport[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<BusinessForReport[]>([]);
  const [reportData, setReportData] = useState<FranchiseReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);

  useEffect(() => {
    loadBusinesses();
  }, []);

  useEffect(() => {
    const filtered = businesses.filter(business =>
      business.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.businessTypeName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBusinesses(filtered);
  }, [businesses, searchTerm]);

  const loadBusinesses = async () => {
    setLoading(true);
    try {
      const response = await apiService.getBusinessesForReports();
      if (response.success && response.data) {
        setBusinesses(response.data);
        setFilteredBusinesses(response.data);
      }
    } catch (error) {
      console.error('Error loading businesses for reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFranchiseReport = async (businessId: string) => {
    setReportLoading(true);
    try {
      const response = await apiService.getFranchiseSalesReport(businessId);
      if (response.success && response.data) {
        setReportData(response.data);
      }
    } catch (error) {
      console.error('Error loading franchise report:', error);
    } finally {
      setReportLoading(false);
    }
  };

  const handleFranchiseSelect = async (business: BusinessForReport) => {
    setSelectedFranchise(business);
    await loadFranchiseReport(business.id);
  };

  const getFranchiseIcon = (businessType?: string) => {
    const type = businessType?.toLowerCase() || '';

    if (type.includes('pizza')) return <Pizza className="w-6 h-6 text-orange-500" />;
    if (type.includes('coffee') || type.includes('café')) return <Coffee className="w-6 h-6 text-amber-600" />;
    if (type.includes('supermarket') || type.includes('grocery')) return <ShoppingCart className="w-6 h-6 text-green-600" />;
    if (type.includes('drugstore') || type.includes('pharmacy') || type.includes('farmacia')) return <Pill className="w-6 h-6 text-blue-600" />;
    if (type.includes('restaurant') || type.includes('burger') || type.includes('food')) return <Building2 className="w-6 h-6 text-red-500" />;

    return <Store className="w-6 h-6 text-teal-600" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <PageHeader
        franchiseName="Sales Report"
        businessType="Franchise sales analytics and reporting"
        onBack={() => navigate('/')}
        showShare={false}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Franquicias */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Franquicias</h2>

              {/* Búsqueda */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar franquicia..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              {/* Lista de franquicias */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="text-center py-4">Cargando...</div>
                ) : filteredBusinesses.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">No se encontraron franquicias</div>
                ) : (
                  filteredBusinesses.map((business) => (
                    <div
                      key={business.id}
                      onClick={() => handleFranchiseSelect(business)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedFranchise?.id === business.id
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-50 rounded-lg">
                          {getFranchiseIcon(business.businessTypeName)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">{business.name}</h3>
                          <p className="text-sm text-gray-500">{business.businessTypeName}</p>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${business.isActive ? 'bg-green-400' : 'bg-red-400'}`} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Panel de Reportes */}
          <div className="lg:col-span-2">
            {selectedFranchise ? (
              <div className="space-y-6">
                {/* Header de la franquicia seleccionada */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-gray-50 rounded-xl">
                      {getFranchiseIcon(selectedFranchise.businessTypeName)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{selectedFranchise.name}</h2>
                      <p className="text-gray-600">{selectedFranchise.businessTypeName}</p>
                    </div>
                  </div>
                </div>

                {/* Métricas */}
                {reportLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : reportData ? (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <MetricCard
                      title="Ventas Totales"
                      value={reportData.metrics.totalSales}
                      icon={<DollarSign className="w-6 h-6" />}
                      trend={reportData.metrics.trend}
                    />
                    <MetricCard
                      title="Pedidos"
                      value={reportData.metrics.totalOrders.toString()}
                      icon={<TrendingUp className="w-6 h-6" />}
                      trend="+8%"
                    />
                    <MetricCard
                      title="Clientes"
                      value={reportData.metrics.uniqueCustomers.toString()}
                      icon={<Users className="w-6 h-6" />}
                      trend="+12%"
                    />
                    <MetricCard
                      title="Promedio/Día"
                      value={reportData.metrics.averagePerDay}
                      icon={<Calendar className="w-6 h-6" />}
                      trend="+6%"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <MetricCard
                      title="Ventas Totales"
                      value="€0"
                      icon={<DollarSign className="w-6 h-6" />}
                      trend="0%"
                    />
                    <MetricCard
                      title="Pedidos"
                      value="0"
                      icon={<TrendingUp className="w-6 h-6" />}
                      trend="0%"
                    />
                    <MetricCard
                      title="Clientes"
                      value="0"
                      icon={<Users className="w-6 h-6" />}
                      trend="0%"
                    />
                    <MetricCard
                      title="Promedio/Día"
                      value="€0"
                      icon={<Calendar className="w-6 h-6" />}
                      trend="0%"
                    />
                  </div>
                )}

                {/* Gráfico personalizado */}
                {reportLoading ? (
                  <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                  </div>
                ) : reportData ? (
                  <CustomBarChart
                    data={reportData.chartData}
                    title={`Ventas de ${selectedFranchise.name}`}
                    subtitle="Últimos 7 días"
                  />
                ) : (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Gráfico de Ventas</h3>
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      No hay datos para mostrar
                    </div>
                  </div>
                )}

                {/* Tabla de transacciones recientes */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Transacciones Recientes</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 rounded-t-lg">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {reportLoading ? (
                          Array.from({ length: 4 }).map((_, index) => (
                            <tr key={index} className="animate-pulse">
                              <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                              <td className="px-4 py-3">
                                <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                                <div className="h-3 bg-gray-200 rounded w-16"></div>
                              </td>
                              <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-8"></div></td>
                              <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
                              <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
                            </tr>
                          ))
                        ) : reportData && reportData.recentTransactions.length > 0 ? (
                          reportData.recentTransactions.map((transaction, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-900">{transaction.date}</td>
                              <td className="px-4 py-3">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{transaction.product}</div>
                                  <div className="text-sm text-gray-500">{transaction.category}</div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">{transaction.quantity}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{transaction.price}</td>
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">{transaction.total}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                              No hay transacciones para mostrar
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-teal-50 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Selecciona una Franquicia</h3>
                <p className="text-gray-600">Elige una franquicia de la lista para ver sus reportes de ventas</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 