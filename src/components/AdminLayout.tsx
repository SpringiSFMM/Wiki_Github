import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, LogOut, AlertTriangle, Tag, Bell } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Fetch maintenance mode status
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await axios.get('/api/admin/settings');
      return response.data;
    },
  });

  const navigation = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: 'Articles',
      path: '/admin/articles',
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: 'Updates',
      path: '/admin/updates',
      icon: <Bell className="h-5 w-5" />,
    },
    {
      name: 'Categories',
      path: '/admin/categories',
      icon: <Tag className="h-5 w-5" />,
    },
    {
      name: 'Settings',
      path: '/admin/settings',
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Top Navigation */}
      <nav className="bg-dark-900 border-b border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/admin" className="text-2xl font-bold text-neon-400">
                Admin Panel
              </Link>
            </div>

            {/* Maintenance Mode Indicator */}
            {settings?.maintenanceMode && (
              <div className="flex items-center px-3 py-1.5 bg-yellow-500/10 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                <span className="text-sm text-yellow-500">Maintenance Mode Active</span>
              </div>
            )}

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <span className="text-dark-200">{user?.username}</span>
              <button
                onClick={handleLogout}
                className="p-2 text-dark-300 hover:text-neon-400 rounded-lg"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Side Navigation */}
      <div className="flex">
        <div className="w-64 bg-dark-900 border-r border-dark-800 min-h-[calc(100vh-4rem)] p-4">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.path ||
                (item.path === '/admin/articles' && location.pathname.startsWith('/admin/articles/'));
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-neon-500/10 text-neon-400'
                      : 'text-dark-200 hover:text-neon-400 hover:bg-dark-800'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-[calc(100vh-4rem)]">
          {children}
        </div>
      </div>
    </div>
  );
}