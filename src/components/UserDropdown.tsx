import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { User, LogOut, ChevronDown } from 'lucide-react';

export const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleProfileClick = () => {
    setIsOpen(false);
    navigate('/profile');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/15 border border-white/30 px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer backdrop-blur-sm hover:bg-white/25 transition-colors text-white"
      >
        <div className="w-6 h-6 bg-white/30 rounded-full flex items-center justify-center font-bold text-xs">
          {(user?.name || 'U').charAt(0).toUpperCase()}
        </div>
        <span className="hidden md:block font-medium text-sm">{user?.name || 'Usuario'}</span>
        <ChevronDown className="w-3 h-3" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 bg-card text-card-foreground rounded-lg border shadow-lg z-50">
          <div className="py-1">
            <div className="px-4 py-2 border-b border-border">
              <p className="text-sm font-medium">{user?.name || 'Manuel Perez'}</p>
              <p className="text-xs text-muted-foreground">{user?.email || 'manuel.perez@example.com'}</p>
            </div>
            
            <button
              onClick={handleProfileClick}
              className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center space-x-2"
            >
              <User className="w-4 h-4" />
              <span>Perfil</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center space-x-2 text-destructive"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 