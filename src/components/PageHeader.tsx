import { ChevronLeft, Share, Plus } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { UserDropdown } from './UserDropdown';
import { ThemeToggle } from './ThemeToggle';
import logo from '../assets/images/logo.png';

interface TabItem {
  id: string;
  label: string;
}

interface PageHeaderProps {
  franchiseName: string;
  businessType: string;
  onBack?: () => void;
  showShare?: boolean;
  onShare?: () => void;
  tabs?: TabItem[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  showUserProfile?: boolean;
  actionButton?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
}

export const PageHeader = ({
  franchiseName,
  businessType,
  onBack,
  showShare = true,
  onShare,
  tabs,
  activeTab,
  onTabChange,
  showUserProfile = false,
  actionButton
}: PageHeaderProps) => {
  const { user } = useAuthStore();

  return (
    <div className="bg-gradient-to-r from-teal-400 to-teal-500 text-white shadow-lg" style={{borderBottomLeftRadius: '4rem'}}>
      <div className="px-6 pt-6 pb-6">
        <div className="flex justify-between items-center">
          {/* Lado izquierdo: Logo + Título o Solo Navegación + Título */}
          <div className="flex items-center gap-4">
            {showUserProfile && (
              <img src={logo} alt="Logo" className="h-12 w-12" />
            )}

            {onBack && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            <div>
              <h2 className="text-2xl font-bold mb-1">{franchiseName}</h2>
              <p className="text-sm text-teal-100">{businessType}</p>
            </div>
          </div>

          {/* Lado derecho: Pestañas + Controles de Usuario */}
          <div className="flex items-center gap-4">
            {/* Pestañas */}
            {tabs && tabs.length > 0 && (
              <nav className="flex gap-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange?.(tab.id)}
                    className={`px-5 py-3 text-sm font-medium rounded-t-lg border-b-2 transition-all ${
                      activeTab === tab.id
                        ? 'bg-white/20 text-white border-white'
                        : 'bg-transparent text-white/80 hover:text-white hover:bg-white/10 border-transparent'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            )}

            {/* Controles de usuario (solo si showUserProfile está activo) */}
            {showUserProfile && (
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <UserDropdown />
              </div>
            )}

            {/* Botón de acción personalizado */}
            {actionButton && (
              <button
                onClick={actionButton.onClick}
                className="bg-white/15 border border-white/30 px-4 py-2 rounded-lg hover:bg-white/25 transition-colors flex items-center gap-2 backdrop-blur-sm"
              >
                {actionButton.icon}
                {actionButton.label}
              </button>
            )}

            {/* Botón Share si está habilitado */}
            {showShare && !showUserProfile && !actionButton && (
              <button
                onClick={onShare}
                className="bg-white/15 border border-white/30 px-4 py-2 rounded-lg hover:bg-white/25 transition-colors flex items-center gap-2 backdrop-blur-sm"
              >
                <Share className="w-4 h-4" />
                Share
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};