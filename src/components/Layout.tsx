import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Menu, X, ChevronDown, Sun, Moon, User, LogOut, Book, Home, Server as ServerIcon, Mail, Settings, Users, FolderOpen } from 'lucide-react';
import { ServerStatus } from './ServerStatus';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

export function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isDarkMode } = useTheme();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  
  // Player count query
  const { data: playerCount } = useQuery({
    queryKey: ['playerCount'],
    queryFn: async () => {
      try {
        const response = await axios.get('/api/player-count');
        return response.data;
      } catch (error) {
        console.error('Error fetching player count:', error);
        return { online: 0, max: 0, percentage: 0 };
      }
    },
    refetchInterval: 60000, // Refresh every minute
  });
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);
  
  const navLinks = [
    { name: 'Startseite', path: '/', icon: <Home className="h-5 w-5" /> },
    { name: 'Wiki', path: '/wiki', icon: <Book className="h-5 w-5" /> },
    { name: 'FW-Sites', path: '/fwsites', icon: <ServerIcon className="h-5 w-5" /> },
    { name: 'Kontakt', path: '/contact', icon: <Mail className="h-5 w-5" /> },
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/admin', icon: <Home className="h-5 w-5" /> },
    { name: 'Artikel', path: '/admin/articles', icon: <Book className="h-5 w-5" /> },
    { name: 'Kategorien', path: '/admin/categories', icon: <FolderOpen className="h-5 w-5" /> },
    { name: 'Einstellungen', path: '/admin/settings', icon: <Settings className="h-5 w-5" /> },
  ];

  const isAdminRoute = location.pathname.startsWith('/admin');
  const activeLinks = isAdminRoute ? adminLinks : navLinks;

  return (
    <div className={`min-h-screen bg-${isDarkMode ? 'dark-950' : 'white'} text-${isDarkMode ? 'dark-200' : 'dark-900'} flex flex-col`}>
      <header 
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? `bg-${isDarkMode ? 'dark-900/80' : 'white'} backdrop-blur-md shadow-md shadow-${isDarkMode ? 'dark-950/20' : 'dark-200/20'}` 
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className={`h-8 w-8 bg-gradient-to-br from-cyto-500 to-cyto-700 rounded-lg flex items-center justify-center shadow-md shadow-cyto-600/10 group-hover:shadow-lg group-hover:shadow-cyto-600/20 transition-all duration-300 transform group-hover:scale-105`}>
                <img src="/images/logo.png" alt="Cytooxien Logo" className="h-5 w-5" />
              </div>
              <span className={`font-bold text-lg text-${isDarkMode ? 'white' : 'dark-900'}`}>
                {isAdminRoute ? 'Admin Panel' : 'Cytooxien'}
              </span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-1">
              {activeLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300
                    ${isDarkMode 
                      ? 'text-dark-200 hover:text-cyto-400 hover:bg-dark-800' 
                      : 'text-dark-900 hover:text-cyto-600 hover:bg-dark-200'} ${
                    location.pathname === link.path
                      ? `bg-cyto-600/10 text-cyto-400`
                      : ''
                  }`}
                >
                  {React.cloneElement(link.icon, { 
                    className: `h-4 w-4 ${location.pathname === link.path ? 'text-cyto-400' : `text-${isDarkMode ? 'dark-300' : 'dark-500'}`}` 
                  })}
                  <span className="ml-2">{link.name}</span>
                </Link>
              ))}
            </nav>
            
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle variant="icon" />
              
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-${isDarkMode ? 'dark-800/70' : 'dark-200/70'} transition-all duration-300`}
                  >
                    <div className={`h-8 w-8 bg-gradient-to-br from-cyto-600 to-cyto-700 rounded-full flex items-center justify-center text-${isDarkMode ? 'white' : 'dark-900'}`}>
                      <User className="h-4 w-4" />
                    </div>
                    <span className={`text-${isDarkMode ? 'dark-200' : 'dark-900'}`}>Admin</span>
                    <ChevronDown className={`h-4 w-4 text-${isDarkMode ? 'dark-400' : 'dark-500'} transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className={`absolute right-0 mt-2 w-48 bg-${isDarkMode ? 'dark-900/95' : 'white'} backdrop-blur-sm border border-${isDarkMode ? 'dark-800/50' : 'dark-200/50'} rounded-xl shadow-xl shadow-${isDarkMode ? 'dark-950/20' : 'dark-200/20'} py-2 z-50`}>
                      {!isAdminRoute && (
                        <Link
                          to="/admin"
                          className={`block px-4 py-2 text-${isDarkMode ? 'dark-200' : 'dark-900'} hover:bg-${isDarkMode ? 'dark-800/70' : 'dark-200/70'} hover:text-${isDarkMode ? 'dark-100' : 'dark-900'} transition-colors duration-300 flex items-center`}
                        >
                          <Settings className={`h-4 w-4 mr-2 text-${isDarkMode ? 'dark-400' : 'dark-500'}`} />
                          Admin Panel
                        </Link>
                      )}
                      {isAdminRoute && (
                        <Link
                          to="/"
                          className={`block px-4 py-2 text-${isDarkMode ? 'dark-200' : 'dark-900'} hover:bg-${isDarkMode ? 'dark-800/70' : 'dark-200/70'} hover:text-${isDarkMode ? 'dark-100' : 'dark-900'} transition-colors duration-300 flex items-center`}
                        >
                          <Home className={`h-4 w-4 mr-2 text-${isDarkMode ? 'dark-400' : 'dark-500'}`} />
                          Zur Website
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          window.location.href = '/login';
                        }}
                        className={`w-full text-left px-4 py-2 text-${isDarkMode ? 'dark-200' : 'dark-900'} hover:bg-${isDarkMode ? 'dark-800/70' : 'dark-200/70'} hover:text-${isDarkMode ? 'dark-100' : 'dark-900'} transition-colors duration-300 flex items-center`}
                      >
                        <LogOut className={`h-4 w-4 mr-2 text-${isDarkMode ? 'dark-400' : 'dark-500'}`} />
                        Abmelden
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="relative px-4 py-2 rounded-lg overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyto-600 to-cyto-700 transition-transform duration-300 group-hover:scale-105"></div>
                  <div className="absolute inset-0 opacity-0 bg-gradient-to-r from-cyto-500 to-cyto-600 transition-opacity duration-300 group-hover:opacity-100"></div>
                  <span className="relative z-10 text-white font-medium">Anmelden</span>
                </Link>
              )}
            </div>
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden p-2 rounded-lg bg-${isDarkMode ? 'dark-800/50' : 'dark-200/50'} hover:bg-${isDarkMode ? 'dark-800' : 'dark-200'} text-${isDarkMode ? 'dark-300' : 'dark-500'} hover:text-${isDarkMode ? 'dark-100' : 'dark-900'} transition-all duration-300`}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        
        {isMenuOpen && (
          <div className={`md:hidden bg-${isDarkMode ? 'dark-900/95' : 'white'} backdrop-blur-sm border-t border-${isDarkMode ? 'dark-800/50' : 'dark-200/50'} shadow-lg shadow-${isDarkMode ? 'dark-950/10' : 'dark-200/10'}`}>
            <div className="container mx-auto px-4 py-3 space-y-2">
              {activeLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-3 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300
                    ${isDarkMode 
                      ? 'text-dark-200 hover:text-cyto-400 hover:bg-dark-800' 
                      : 'text-dark-900 hover:text-cyto-600 hover:bg-dark-200'} ${
                    location.pathname === link.path
                      ? 'bg-cyto-600/10 text-cyto-400'
                      : ''
                  }`}
                >
                  {React.cloneElement(link.icon, { 
                    className: `h-5 w-5 ${location.pathname === link.path ? 'text-cyto-400' : `text-${isDarkMode ? 'dark-300' : 'dark-500'}`}` 
                  })}
                  <span>{link.name}</span>
                </Link>
              ))}
              
              <div className="pt-2 border-t border-${isDarkMode ? 'dark-800/50' : 'dark-200/50'} mt-2 flex items-center justify-between">
                <ThemeToggle variant="button" />
                
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      logout();
                      window.location.href = '/login';
                    }}
                    className={`px-3 py-2 rounded-lg flex items-center space-x-2 text-${isDarkMode ? 'dark-200' : 'dark-900'} hover:bg-${isDarkMode ? 'dark-800/70' : 'dark-200/70'} hover:text-${isDarkMode ? 'dark-100' : 'dark-900'} transition-colors duration-300`}
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Abmelden</span>
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className={`px-3 py-2 rounded-lg flex items-center space-x-2 text-${isDarkMode ? 'dark-200' : 'dark-900'} hover:bg-${isDarkMode ? 'dark-800/70' : 'dark-200/70'} hover:text-${isDarkMode ? 'dark-100' : 'dark-900'} transition-colors duration-300`}
                  >
                    <User className="h-5 w-5" />
                    <span>Anmelden</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className={`bg-${isDarkMode ? 'dark-900' : 'white'} border-t border-${isDarkMode ? 'dark-800' : 'dark-200'}`}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <Link to="/impressum" className={`text-sm text-${isDarkMode ? 'dark-400' : 'dark-500'} hover:text-${isDarkMode ? 'dark-200' : 'dark-700'} transition-colors duration-300`}>
                Impressum
              </Link>
              
              {/* Player Count */}
              <div className={`flex items-center text-sm ${isDarkMode ? 'text-dark-400' : 'text-dark-500'}`}>
                <Users className="h-4 w-4 mr-1.5" />
                <span className={`font-medium ${isDarkMode ? 'text-cyto-400' : 'text-cyto-600'}`}>
                  {playerCount?.online || 0}
                </span>
                <span className="mx-1">/</span>
                <span>{playerCount?.max || 0}</span>
                <span className="ml-1.5">Spieler online</span>
              </div>
            </div>
            <div className={`text-sm text-${isDarkMode ? 'dark-400' : 'dark-500'}`}>
              &copy; {new Date().getFullYear()} Alle Rechte vorbehalten.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}