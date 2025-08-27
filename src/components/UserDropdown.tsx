import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

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
        className="flex items-center space-x-2 text-header hover:text-header/80 transition-colors"
      >
        <div className="w-10 h-10 bg-header/20 rounded-full flex items-center justify-center border-2 border-black dark:border-white">
          <span className="text-lg">👤</span>
        </div>
        <span className="hidden md:block font-medium">{user?.name || 'Manuel Perez'}</span>
        <span className="text-lg">▼</span>
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
              <span>👤</span>
              <span>Perfil</span>
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center space-x-2 text-destructive"
            >
              <span>🚪</span>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 