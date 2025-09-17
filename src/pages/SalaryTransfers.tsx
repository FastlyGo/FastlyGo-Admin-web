import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import {
  DollarSign,
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  User,
  Building,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  Filter,
  Search,
  Download,
  Upload,
  Wallet,
  TrendingUp
} from 'lucide-react';

export const SalaryTransfers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [activeTab, setActiveTab] = useState('salaries');

  const financeStats = [
    {
      title: "Total Payroll",
      value: "$89,450",
      change: "This month",
      icon: <DollarSign className="w-6 h-6" />,
      bgColor: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      title: "Pending Transfers",
      value: "23",
      change: "$12,340 total",
      icon: <Clock className="w-6 h-6" />,
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600"
    },
    {
      title: "Completed Today",
      value: "18",
      change: "$8,920 processed",
      icon: <CheckCircle className="w-6 h-6" />,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      title: "Available Balance",
      value: "$156,780",
      change: "Company account",
      icon: <Wallet className="w-6 h-6" />,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600"
    }
  ];

  const salaryRecords = [
    {
      id: "SAL-001",
      employee: "Juan Pérez",
      role: "Delivery Manager",
      department: "Operations",
      amount: "$3,200",
      period: "September 2024",
      status: "paid",
      paidDate: "Sep 15, 2024",
      method: "Bank Transfer"
    },
    {
      id: "SAL-002",
      employee: "María García",
      role: "Customer Service",
      department: "Support",
      amount: "$2,800",
      period: "September 2024",
      status: "pending",
      paidDate: "Pending",
      method: "Bank Transfer"
    },
    {
      id: "SAL-003",
      employee: "Carlos López",
      role: "Delivery Driver",
      department: "Operations",
      amount: "$2,400",
      period: "September 2024",
      status: "processing",
      paidDate: "Processing",
      method: "Digital Wallet"
    }
  ];

  const transferRecords = [
    {
      id: "TXN-001",
      type: "outgoing",
      recipient: "FastlyGo Franchise #12",
      amount: "$15,600",
      purpose: "Commission Payment",
      status: "completed",
      date: "Sep 16, 2024",
      reference: "COM-202409-12"
    },
    {
      id: "TXN-002",
      type: "incoming",
      recipient: "Customer Payments",
      amount: "$45,200",
      purpose: "Order Payments",
      status: "completed",
      date: "Sep 16, 2024",
      reference: "PAY-202409-001"
    },
    {
      id: "TXN-003",
      type: "outgoing",
      recipient: "Tax Authority",
      amount: "$8,900",
      purpose: "Tax Payment",
      status: "pending",
      date: "Sep 17, 2024",
      reference: "TAX-202409-001"
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      'paid': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'failed': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'processing':
        return <TrendingUp className="w-4 h-4 text-blue-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTransferIcon = (type: string) => {
    return type === 'incoming' ?
      <ArrowDownLeft className="w-4 h-4 text-green-500" /> :
      <ArrowUpRight className="w-4 h-4 text-red-500" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        franchiseName="Salary & Transfers"
        businessType="Manage employee salaries and financial transfers"
        onBack={() => navigate('/')}
        showShare={false}
        actionButton={{
          label: 'New Payment',
          onClick: () => console.log('New payment'),
          icon: <Plus className="w-4 h-4" />
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {financeStats.map((stat, index) => (
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

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('salaries')}
                className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'salaries'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Employee Salaries
                </div>
              </button>
              <button
                onClick={() => setActiveTab('transfers')}
                className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'transfers'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Financial Transfers
                </div>
              </button>
            </nav>
          </div>

          {/* Search and Filter */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6">
            {activeTab === 'salaries' ? (
              <div className="space-y-4">
                {salaryRecords.map((salary) => (
                  <div key={salary.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{salary.employee}</h3>
                            <p className="text-sm text-gray-600">{salary.role} • {salary.department}</p>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            {getStatusIcon(salary.status)}
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(salary.status)}`}>
                              {salary.status}
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-500 mt-4">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            {salary.amount}
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {salary.period}
                          </div>
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            {salary.method}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {salary.paidDate}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {transferRecords.map((transfer) => (
                  <div key={transfer.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transfer.type === 'incoming' ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            {getTransferIcon(transfer.type)}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{transfer.recipient}</h3>
                            <p className="text-sm text-gray-600">{transfer.purpose}</p>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            {getStatusIcon(transfer.status)}
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transfer.status)}`}>
                              {transfer.status}
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-500 mt-4">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            {transfer.amount}
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {transfer.date}
                          </div>
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4" />
                            {transfer.type}
                          </div>
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            {transfer.reference}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-400 hover:bg-teal-50 transition-all">
              <DollarSign className="w-5 h-5 text-teal-600" />
              <span className="text-sm font-medium text-gray-700">Process Salary</span>
            </button>
            <button className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-400 hover:bg-teal-50 transition-all">
              <CreditCard className="w-5 h-5 text-teal-600" />
              <span className="text-sm font-medium text-gray-700">New Transfer</span>
            </button>
            <button className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-400 hover:bg-teal-50 transition-all">
              <Upload className="w-5 h-5 text-teal-600" />
              <span className="text-sm font-medium text-gray-700">Import Records</span>
            </button>
            <button className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-400 hover:bg-teal-50 transition-all">
              <Download className="w-5 h-5 text-teal-600" />
              <span className="text-sm font-medium text-gray-700">Export Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 