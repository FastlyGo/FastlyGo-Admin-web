import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import {
  ClipboardList,
  User,
  Shield,
  Truck,
  ShoppingCart,
  CreditCard,
  Settings,
  Eye,
  Calendar,
  Clock,
  MapPin,
  Smartphone,
  Monitor,
  Filter,
  Search,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';

export const ActivityLog = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [dateRange, setDateRange] = useState('today');

  const activityStats = [
    {
      title: "Total Actions",
      value: "2,847",
      change: "Today",
      icon: <ClipboardList className="w-6 h-6" />,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      title: "Users Active",
      value: "89",
      change: "Last 24h",
      icon: <User className="w-6 h-6" />,
      bgColor: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      title: "System Events",
      value: "156",
      change: "This hour",
      icon: <Settings className="w-6 h-6" />,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      title: "Security Events",
      value: "12",
      change: "Needs attention",
      icon: <Shield className="w-6 h-6" />,
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600"
    }
  ];

  const activityLogs = [
    {
      id: "LOG-001",
      timestamp: "2024-09-16 14:32:15",
      user: "admin@fastlygo.com",
      action: "User Login",
      type: "authentication",
      details: "Successful login from web dashboard",
      ip: "192.168.1.100",
      device: "Chrome Browser",
      location: "Mexico City, MX",
      severity: "info",
      module: "Auth"
    },
    {
      id: "LOG-002",
      timestamp: "2024-09-16 14:30:42",
      user: "delivery@fastlygo.com",
      action: "Order Status Updated",
      type: "order",
      details: "Order #12345 status changed to 'Delivered'",
      ip: "192.168.1.101",
      device: "Mobile App",
      location: "Guadalajara, MX",
      severity: "success",
      module: "Orders"
    },
    {
      id: "LOG-003",
      timestamp: "2024-09-16 14:28:17",
      user: "merchant@fastlygo.com",
      action: "Payment Processed",
      type: "payment",
      details: "Payment of $25.50 processed successfully",
      ip: "192.168.1.102",
      device: "Web Browser",
      location: "Monterrey, MX",
      severity: "success",
      module: "Payments"
    },
    {
      id: "LOG-004",
      timestamp: "2024-09-16 14:25:33",
      user: "system",
      action: "Failed Login Attempt",
      type: "security",
      details: "Multiple failed login attempts detected",
      ip: "45.123.67.89",
      device: "Unknown",
      location: "Unknown",
      severity: "warning",
      module: "Security"
    },
    {
      id: "LOG-005",
      timestamp: "2024-09-16 14:22:08",
      user: "admin@fastlygo.com",
      action: "User Created",
      type: "user_management",
      details: "New delivery driver account created: John Doe",
      ip: "192.168.1.100",
      device: "Chrome Browser",
      location: "Mexico City, MX",
      severity: "info",
      module: "Users"
    },
    {
      id: "LOG-006",
      timestamp: "2024-09-16 14:20:15",
      user: "customer@email.com",
      action: "Order Placed",
      type: "order",
      details: "New order #12346 placed for $18.75",
      ip: "192.168.1.103",
      device: "Mobile App",
      location: "Puebla, MX",
      severity: "info",
      module: "Orders"
    }
  ];

  const getActivityIcon = (type: string) => {
    const icons = {
      'authentication': <User className="w-4 h-4" />,
      'order': <ShoppingCart className="w-4 h-4" />,
      'payment': <CreditCard className="w-4 h-4" />,
      'security': <Shield className="w-4 h-4" />,
      'user_management': <User className="w-4 h-4" />,
      'delivery': <Truck className="w-4 h-4" />,
      'system': <Settings className="w-4 h-4" />
    };
    return icons[type as keyof typeof icons] || <ClipboardList className="w-4 h-4" />;
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      'info': 'bg-blue-100 text-blue-800',
      'success': 'bg-green-100 text-green-800',
      'warning': 'bg-yellow-100 text-yellow-800',
      'error': 'bg-red-100 text-red-800'
    };
    return colors[severity as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getDeviceIcon = (device: string) => {
    if (device.toLowerCase().includes('mobile') || device.toLowerCase().includes('app')) {
      return <Smartphone className="w-4 h-4 text-gray-500" />;
    }
    return <Monitor className="w-4 h-4 text-gray-500" />;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        franchiseName="Activity Log"
        businessType="Monitor system activities and user actions"
        onBack={() => navigate('/')}
        showShare={false}
        actionButton={{
          label: 'Export Log',
          onClick: () => console.log('Export log'),
          icon: <Download className="w-4 h-4" />
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {activityStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <div className={stat.iconColor}>
                    {stat.icon}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.change}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">All Activities</option>
              <option value="authentication">Authentication</option>
              <option value="order">Orders</option>
              <option value="payment">Payments</option>
              <option value="security">Security</option>
              <option value="user_management">User Management</option>
              <option value="delivery">Delivery</option>
              <option value="system">System</option>
            </select>
            <select
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">All Users</option>
              <option value="admin">Administrators</option>
              <option value="merchant">Merchants</option>
              <option value="delivery">Delivery</option>
              <option value="customer">Customers</option>
              <option value="system">System</option>
            </select>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
        </div>

        {/* Activity Log */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
              <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-teal-600 transition-colors">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {activityLogs.map((log) => (
              <div key={log.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">

                  {/* Activity Icon */}
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    {getActivityIcon(log.type)}
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-medium text-gray-900">{log.action}</h4>
                          {getSeverityIcon(log.severity)}
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(log.severity)}`}>
                            {log.severity}
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {log.module}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{log.details}</p>

                        {/* Metadata */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {log.user}
                          </div>
                          <div className="flex items-center gap-1">
                            {getDeviceIcon(log.device)}
                            {log.device}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {log.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {log.ip}
                          </div>
                        </div>
                      </div>

                      {/* Timestamp */}
                      <div className="text-right flex-shrink-0 ml-4">
                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                          <Clock className="w-3 h-3" />
                          {formatTimestamp(log.timestamp)}
                        </div>
                        <div className="text-xs text-gray-400">
                          {log.timestamp.split(' ')[1]}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="p-6 border-t border-gray-200 text-center">
            <button className="px-4 py-2 text-sm text-teal-600 hover:text-teal-700 font-medium">
              Load More Activities
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-400 hover:bg-teal-50 transition-all">
              <Download className="w-5 h-5 text-teal-600" />
              <span className="text-sm font-medium text-gray-700">Export Logs</span>
            </button>
            <button className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-400 hover:bg-teal-50 transition-all">
              <Filter className="w-5 h-5 text-teal-600" />
              <span className="text-sm font-medium text-gray-700">Advanced Filter</span>
            </button>
            <button className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-400 hover:bg-teal-50 transition-all">
              <Shield className="w-5 h-5 text-teal-600" />
              <span className="text-sm font-medium text-gray-700">Security Report</span>
            </button>
            <button className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-400 hover:bg-teal-50 transition-all">
              <Calendar className="w-5 h-5 text-teal-600" />
              <span className="text-sm font-medium text-gray-700">Schedule Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 