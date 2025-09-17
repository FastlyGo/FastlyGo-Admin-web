import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import {
  FileText,
  HelpCircle,
  MessageCircle,
  TrendingUp,
  Users,
  AlertCircle,
  Download,
  Filter,
  Search,
  Calendar,
  BarChart3,
  PieChart,
  FileBarChart
} from 'lucide-react';

export const SupportReports = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const supportStats = [
    {
      title: "Open Tickets",
      value: "23",
      change: "+3 today",
      icon: <HelpCircle className="w-6 h-6" />,
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600"
    },
    {
      title: "Resolved Today",
      value: "15",
      change: "+67% vs yesterday",
      icon: <MessageCircle className="w-6 h-6" />,
      bgColor: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      title: "Customer Rating",
      value: "4.8",
      change: "Excellent",
      icon: <TrendingUp className="w-6 h-6" />,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      title: "Active Users",
      value: "1,247",
      change: "+12% this month",
      icon: <Users className="w-6 h-6" />,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600"
    }
  ];

  const recentTickets = [
    {
      id: "TKT-001",
      customer: "Juan Pérez",
      subject: "Payment issue with order #1234",
      status: "open",
      priority: "high",
      created: "2 hours ago"
    },
    {
      id: "TKT-002",
      customer: "María García",
      subject: "Delivery delay complaint",
      status: "in-progress",
      priority: "medium",
      created: "4 hours ago"
    },
    {
      id: "TKT-003",
      customer: "Carlos López",
      subject: "App not loading properly",
      status: "resolved",
      priority: "low",
      created: "1 day ago"
    }
  ];

  const reportTemplates = [
    {
      title: "Daily Support Summary",
      description: "Complete overview of daily support activities",
      icon: <FileBarChart className="w-8 h-8" />,
      bgColor: "bg-gradient-to-br from-blue-400 to-blue-600"
    },
    {
      title: "Customer Satisfaction Report",
      description: "Analysis of customer feedback and ratings",
      icon: <PieChart className="w-8 h-8" />,
      bgColor: "bg-gradient-to-br from-green-400 to-green-600"
    },
    {
      title: "Performance Analytics",
      description: "Team performance and response time metrics",
      icon: <BarChart3 className="w-8 h-8" />,
      bgColor: "bg-gradient-to-br from-purple-400 to-purple-600"
    },
    {
      title: "Monthly Report",
      description: "Comprehensive monthly support overview",
      icon: <FileText className="w-8 h-8" />,
      bgColor: "bg-gradient-to-br from-orange-400 to-orange-600"
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      'open': 'bg-red-100 text-red-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      'resolved': 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'high': 'bg-red-100 text-red-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'low': 'bg-green-100 text-green-800'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        franchiseName="Support & Reports"
        businessType="Manage customer support and generate reports"
        onBack={() => navigate('/')}
        showShare={false}
        actionButton={{
          label: 'Export Report',
          onClick: () => console.log('Export report'),
          icon: <Download className="w-4 h-4" />
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {supportStats.map((stat, index) => (
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Recent Support Tickets */}
          <div className="bg-white rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Support Tickets</h3>
                <button className="text-teal-600 hover:text-teal-700 text-sm font-medium">
                  View All
                </button>
              </div>

              {/* Search and Filter */}
              <div className="flex gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tickets..."
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
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {recentTickets.map((ticket) => (
                  <div key={ticket.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-900">{ticket.id}</span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                            {ticket.status.replace('-', ' ')}
                          </span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{ticket.subject}</p>
                        <p className="text-xs text-gray-500">by {ticket.customer}</p>
                      </div>
                      <span className="text-xs text-gray-500">{ticket.created}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Report Templates */}
          <div className="bg-white rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Report Templates</h3>
              <p className="text-sm text-gray-600 mt-1">Generate comprehensive reports</p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 gap-4">
                {reportTemplates.map((template, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-teal-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${template.bgColor} rounded-lg flex items-center justify-center text-white`}>
                        {template.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">{template.title}</h4>
                        <p className="text-xs text-gray-600">{template.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 text-gray-400 hover:text-teal-600 transition-colors">
                          <Calendar className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-teal-600 transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-400 hover:bg-teal-50 transition-all">
              <AlertCircle className="w-5 h-5 text-teal-600" />
              <span className="text-sm font-medium text-gray-700">Create Support Ticket</span>
            </button>
            <button className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-400 hover:bg-teal-50 transition-all">
              <FileText className="w-5 h-5 text-teal-600" />
              <span className="text-sm font-medium text-gray-700">Generate Custom Report</span>
            </button>
            <button className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-400 hover:bg-teal-50 transition-all">
              <MessageCircle className="w-5 h-5 text-teal-600" />
              <span className="text-sm font-medium text-gray-700">Contact Support Team</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 