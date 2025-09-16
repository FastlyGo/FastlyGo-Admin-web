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
      <div className="bg-gradient-to-r from-teal-400 to-teal-500 dark:from-gray-800 dark:to-gray-900 text-white shadow-lg" style={{borderBottomLeftRadius: '4rem'}}>
        {/* Top Section - estructura del ejemplo HTML */}
        <div className="max-w-7xl mx-auto px-6 pt-5 pb-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <img
                  src={logo}
                  alt="Logo"
                  className="h-6 w-6 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={handleLogoClick}
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-1">Good Morning</h1>
                <p className="text-sm text-teal-100">{user?.name || 'Manuel Perez'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <div className="bg-white/15 border border-white/30 px-4 py-3 rounded-xl flex items-center gap-3 cursor-pointer backdrop-blur-sm hover:bg-white/25 transition-colors">
                <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center font-bold text-sm">
                  {(user?.name || 'MP').charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium">{user?.name || 'Manuel Perez'}</span>
                <UserDropdown />
              </div>
            </div>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};

export default NavBarHeader;
