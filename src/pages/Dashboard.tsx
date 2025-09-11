import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useBusinessStore } from '../stores/businessStore';
import { CreateUserModal } from '../components/CreateUserModal';
import { useAuthStore } from '../stores/authStore';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { businesses, loading, error, fetchBusinesses } = useBusinessStore();
  const { user } = useAuthStore();
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);

  useEffect(() => {
    fetchBusinesses(true);
  }, [fetchBusinesses]);

  const menuItems = [
    {
      title: "Franchise & delivery Management",
      icon: "🏪",
      path: "franchise-management",
    },
    {
      title: "Franchise Sales Report",
      icon: "📊",
      path: "sales-report",
    },
    {
      title: "Franchise Promotions",
      icon: "📢",
      path: "promotions",
    },
    {
      title: "Activity Log",
      icon: "📋",
      path: "activity-log",
    },
    {
      title: "Salary & Transfers",
      icon: "💰",
      path: "salary-transfers",
    },
    {
      title: "User Management",
      icon: "👥",
      path: "user-management",
    },
    {
      title: "Notices & Communications",
      icon: "📢",
      path: "notices-communications",
    },
    {
      title: "Support & Reports",
      icon: "🎯",
      path: "support-reports",
    },
  ];

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header con bienvenida y botón de crear usuario */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Panel de Administración</h1>
            <p className="text-muted-foreground mt-1">
              Bienvenido, {user?.name || 'Usuario'}
            </p>
          </div>
          <button
            onClick={() => setIsCreateUserModalOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Crear Usuario
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="bg-dashboard-card text-dashboard-card-foreground hover:bg-dashboard-card/90 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-border"
              onClick={() => handleCardClick(item.path)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-dashboard-card-foreground text-2xl">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-dashboard-card-foreground">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                  <div className="text-dashboard-card-foreground">
                    <span className="text-lg">→</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sección de datos de API */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Datos de FastlyGo API</h2>
          
          {loading && (
            <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-6">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="text-muted-foreground">Cargando datos de la API...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 text-destructive rounded-lg border border-destructive/20 p-4 mb-6">
              <p className="font-medium">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && businesses.length > 0 && (
            <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Businesses Data (JSON)</h3>
              <div className="bg-muted rounded-lg p-4 overflow-auto max-h-96">
                <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {JSON.stringify(businesses, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {!loading && !error && businesses.length === 0 && (
            <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-6">
              <p className="text-muted-foreground">No se encontraron datos de businesses.</p>
            </div>
          )}
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
