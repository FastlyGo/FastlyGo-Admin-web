import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { CreateUserModal } from '../components/CreateUserModal';
import { useAuthStore } from '../stores/authStore';
import { MetricCard } from '../components/MetricCard';
import { SalesChart } from '../components/SalesChart';
import { PageHeader } from '../components/PageHeader';
import { Store, TrendingUp, Megaphone, ClipboardList, DollarSign, Users, MessageSquare, Target, ChevronRight } from 'lucide-react';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);

  const menuItems = [
    {
      title: "Franchise & delivery Management",
      icon: <Store className="w-6 h-6" />,
      path: "franchise-management",
    },
    {
      title: "Franchise Sales Report",
      icon: <TrendingUp className="w-6 h-6" />,
      path: "sales-report",
    },
    {
      title: "Franchise Promotions",
      icon: <Megaphone className="w-6 h-6" />,
      path: "promotions",
    },
    {
      title: "Activity Log",
      icon: <ClipboardList className="w-6 h-6" />,
      path: "activity-log",
    },
    {
      title: "Salary & Transfers",
      icon: <DollarSign className="w-6 h-6" />,
      path: "salary-transfers",
    },
    {
      title: "User Management",
      icon: <Users className="w-6 h-6" />,
      path: "user-management",
    },
    {
      title: "Notices & Communications",
      icon: <MessageSquare className="w-6 h-6" />,
      path: "notices-communications",
    },
    {
      title: "Support & Reports",
      icon: <Target className="w-6 h-6" />,
      path: "support-reports",
    },
  ];

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header unificado súper simple */}
      <PageHeader
        franchiseName="Panel de Administración"
        businessType={`Bienvenido, ${user?.name || 'Usuario'}`}
        showUserProfile={true}
        showShare={false}
      />

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Total Sales"
            value="$12,400"
            trend="+12% this week"
          />
          <MetricCard
            title="Number of Sales"
            value="231"
            trend="+8% this week"
          />
          <MetricCard
            title="New Customers"
            value="20"
            trend="+15% this week"
          />
        </div>

        {/* Menu Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-teal-400 to-teal-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              onClick={() => handleCardClick(item.path)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-white">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                  <div className="text-white">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sales Chart */}
        <div className="mb-12">
          <SalesChart />
        </div>
      </div>
      
      {/* Modal para crear usuarios */}
      <CreateUserModal
        isOpen={isCreateUserModalOpen}
        onClose={() => setIsCreateUserModalOpen(false)}
        onUserCreated={() => {
          // Opcional: Refrescar datos o mostrar notificación
          console.log('Usuario creado exitosamente');
        }}
      />
    </div>
  );
};
