import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import {
  MessageSquare,
  Bell,
  Megaphone,
  Send,
  Eye,
  Users,
  Calendar,
  Edit,
  Trash2,
  Plus,
  Filter,
  Search,
  AlertTriangle,
  Info,
  CheckCircle,
  Clock
} from 'lucide-react';

export const NoticesCommunications = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [activeTab, setActiveTab] = useState('notices');

  const communicationStats = [
    {
      title: "Active Notices",
      value: "12",
      change: "3 scheduled",
      icon: <Bell className="w-6 h-6" />,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      title: "Messages Sent",
      value: "1,847",
      change: "Today",
      icon: <MessageSquare className="w-6 h-6" />,
      bgColor: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      title: "Reach Rate",
      value: "94.5%",
      change: "+2.3% vs last week",
      icon: <Users className="w-6 h-6" />,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      title: "Campaigns",
      value: "8",
      change: "Active campaigns",
      icon: <Megaphone className="w-6 h-6" />,
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600"
    }
  ];

  const notices = [
    {
      id: "NOT-001",
      title: "System Maintenance Schedule",
      content: "Planned maintenance on September 20th from 2:00 AM to 4:00 AM",
      type: "maintenance",
      priority: "high",
      status: "active",
      recipients: 1245,
      created: "2 hours ago",
      scheduled: "Sep 20, 2:00 AM"
    },
    {
      id: "NOT-002",
      title: "New Feature Release",
      content: "Exciting new features are now available in the mobile app",
      type: "announcement",
      priority: "medium",
      status: "scheduled",
      recipients: 890,
      created: "1 day ago",
      scheduled: "Sep 18, 10:00 AM"
    },
    {
      id: "NOT-003",
      title: "Holiday Schedule Update",
      content: "Updated delivery schedule for upcoming holidays",
      type: "info",
      priority: "low",
      status: "draft",
      recipients: 567,
      created: "3 days ago",
      scheduled: "Not scheduled"
    }
  ];

  const communications = [
    {
      id: "COM-001",
      title: "Weekly Newsletter",
      type: "newsletter",
      recipients: 2340,
      openRate: "68%",
      clickRate: "12%",
      status: "sent",
      sentAt: "2 days ago"
    },
    {
      id: "COM-002",
      title: "Promotional Campaign - Summer Sale",
      type: "promotion",
      recipients: 1890,
      openRate: "72%",
      clickRate: "18%",
      status: "sent",
      sentAt: "1 week ago"
    },
    {
      id: "COM-003",
      title: "Customer Survey",
      type: "survey",
      recipients: 1200,
      openRate: "45%",
      clickRate: "8%",
      status: "scheduled",
      sentAt: "Scheduled for tomorrow"
    }
  ];

  const getTypeColor = (type: string) => {
    const colors = {
      'maintenance': 'bg-red-100 text-red-800',
      'announcement': 'bg-blue-100 text-blue-800',
      'info': 'bg-gray-100 text-gray-800',
      'newsletter': 'bg-green-100 text-green-800',
      'promotion': 'bg-purple-100 text-purple-800',
      'survey': 'bg-orange-100 text-orange-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'medium': return <Info className="w-4 h-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'active': 'bg-green-100 text-green-800',
      'scheduled': 'bg-blue-100 text-blue-800',
      'draft': 'bg-gray-100 text-gray-800',
      'sent': 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        franchiseName="Notices & Communications"
        businessType="Manage notifications and communication campaigns"
        onBack={() => navigate('/')}
        showShare={false}
        actionButton={{
          label: 'Create Notice',
          onClick: () => console.log('Create notice'),
          icon: <Plus className="w-4 h-4" />
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {communicationStats.map((stat, index) => (
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
                onClick={() => setActiveTab('notices')}
                className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'notices'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Notices
                </div>
              </button>
              <button
                onClick={() => setActiveTab('communications')}
                className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'communications'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Communications
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
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">All Types</option>
                {activeTab === 'notices' ? (
                  <>
                    <option value="maintenance">Maintenance</option>
                    <option value="announcement">Announcement</option>
                    <option value="info">Information</option>
                  </>
                ) : (
                  <>
                    <option value="newsletter">Newsletter</option>
                    <option value="promotion">Promotion</option>
                    <option value="survey">Survey</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6">
            {activeTab === 'notices' ? (
              <div className="space-y-4">
                {notices.map((notice) => (
                  <div key={notice.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{notice.title}</h3>
                          {getPriorityIcon(notice.priority)}
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(notice.type)}`}>
                            {notice.type}
                          </span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(notice.status)}`}>
                            {notice.status}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{notice.content}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            {notice.recipients} recipients
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Created {notice.created}
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {notice.scheduled}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {communications.map((comm) => (
                  <div key={comm.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{comm.title}</h3>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(comm.type)}`}>
                            {comm.type}
                          </span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(comm.status)}`}>
                            {comm.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            {comm.recipients} recipients
                          </div>
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            {comm.openRate} open rate
                          </div>
                          <div className="flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            {comm.clickRate} click rate
                          </div>
                          <div className="flex items-center gap-2">
                            <Send className="w-4 h-4" />
                            {comm.sentAt}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
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
              <Bell className="w-5 h-5 text-teal-600" />
              <span className="text-sm font-medium text-gray-700">Create Notice</span>
            </button>
            <button className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-400 hover:bg-teal-50 transition-all">
              <MessageSquare className="w-5 h-5 text-teal-600" />
              <span className="text-sm font-medium text-gray-700">Send Message</span>
            </button>
            <button className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-400 hover:bg-teal-50 transition-all">
              <Megaphone className="w-5 h-5 text-teal-600" />
              <span className="text-sm font-medium text-gray-700">Start Campaign</span>
            </button>
            <button className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-400 hover:bg-teal-50 transition-all">
              <Calendar className="w-5 h-5 text-teal-600" />
              <span className="text-sm font-medium text-gray-700">Schedule</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 