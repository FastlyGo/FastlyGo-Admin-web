import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserDropdown } from './UserDropdown';
import { ThemeToggle } from './ThemeToggle';
import { useAuthStore } from '../stores/authStore';
import logo from '../assets/images/logo.png';

interface NavBarHeaderProps {
  children: ReactNode;
}

const NavBarHeader = ({ children }: NavBarHeaderProps) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="bg-header text-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-start">
            <div className="text-header flex items-center space-x-4">
              <img 
                src={logo} 
                alt="Logo" 
                className="h-20 w-auto cursor-pointer hover:opacity-80 transition-opacity" 
                onClick={handleLogoClick}
              />
              <div>
                <h1 className="text-2xl font-bold mb-1">Good Morning</h1>
                <p className="text-lg opacity-90">{user?.name || 'Manuel Perez'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <UserDropdown />
            </div>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};

export default NavBarHeader;
