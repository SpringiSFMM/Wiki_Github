import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Menu, X, ChevronDown, Sun, Moon, User, LogOut, Book, Home, Server as ServerIcon, Mail } from 'lucide-react';
import { ServerStatus } from './ServerStatus';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';
import InfoBanner from './InfoBanner';

interface LayoutProps {
  children?: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();
  
  // Überprüfe Scroll-Position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Schließe Menü bei Routenwechsel
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);
  
  // Simuliere einen eingeloggten Benutzer
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  // Navigation-Links
  const navLinks = [
    { name: 'Startseite', path: '/', icon: <Home className="h-5 w-5" /> },
    { name: 'Wiki', path: '/wiki', icon: <Book className="h-5 w-5" /> },
    { name: 'FW-Sites', path: '/fwsites', icon: <ServerIcon className="h-5 w-5" /> },
    { name: 'Kontakt', path: '/contact', icon: <Mail className="h-5 w-5" /> },
  ];

  return (
    <div className={`min-h-screen bg-${isDarkMode ? 'dark-950' : 'white'} text-${isDarkMode ? 'dark-200' : 'dark-900'} flex flex-col`}>
      {/* Header */}
      <header 
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? `bg-${isDarkMode ? 'dark-900/80' : 'white'} backdrop-blur-md shadow-md shadow-${isDarkMode ? 'dark-950/20' : 'dark-200/20'}` 
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 group"
            >
              <div className={`h-8 w-8 bg-gradient-to-br from-cyto-500 to-cyto-700 rounded-lg flex items-center justify-center shadow-md shadow-cyto-600/10 group-hover:shadow-lg group-hover:shadow-cyto-600/20 transition-all duration-300 transform group-hover:scale-105`}>
                <img src="/images/logo.png" alt="Cytooxien Logo" className="h-5 w-5" />
              </div>
              <span className={`font-bold text-lg text-${isDarkMode ? 'white' : 'dark-900'}`}>Cytooxien</span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-lg flex items-center space-x-1 transition-all duration-300 ${
                    location.pathname === link.path
                      ? `bg-cyto-600/10 text-cyto-400`
                      : `text-${isDarkMode ? 'dark-200' : 'dark-900'} hover:bg-${isDarkMode ? 'dark-800/70' : 'dark-200/70'} hover:text-${isDarkMode ? 'dark-100' : 'dark-900'}`
                  }`}
                >
                  {React.cloneElement(link.icon, { 
                    className: `h-4 w-4 ${location.pathname === link.path ? 'text-cyto-400' : `text-${isDarkMode ? 'dark-300' : 'dark-500'}`}` 
                  })}
                  <span>{link.name}</span>
                </Link>
              ))}
            </nav>
            
            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Theme Toggle */}
              <ThemeToggle variant="icon" />
              
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-${isDarkMode ? 'dark-800/70' : 'dark-200/70'} transition-all duration-300"
                  >
                    <div className={`h-8 w-8 bg-gradient-to-br from-cyto-600 to-cyto-700 rounded-full flex items-center justify-center text-${isDarkMode ? 'white' : 'dark-900'}`}>
                      <User className="h-4 w-4" />
                    </div>
                    <span className={`text-${isDarkMode ? 'dark-200' : 'dark-900'}`}>Spieler</span>
                    <ChevronDown className={`h-4 w-4 text-${isDarkMode ? 'dark-400' : 'dark-500'} transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className={`absolute right-0 mt-2 w-48 bg-${isDarkMode ? 'dark-900/95' : 'white'} backdrop-blur-sm border border-${isDarkMode ? 'dark-800/50' : 'dark-200/50'} rounded-xl shadow-xl shadow-${isDarkMode ? 'dark-950/20' : 'dark-200/20'} py-2 z-50 transform origin-top-right transition-all duration-300`}>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-${isDarkMode ? 'dark-200' : 'dark-900'} hover:bg-${isDarkMode ? 'dark-800/70' : 'dark-200/70'} hover:text-${isDarkMode ? 'dark-100' : 'dark-900'} transition-colors duration-300 flex items-center"
                      >
                        <User className="h-4 w-4 mr-2 text-${isDarkMode ? 'dark-400' : 'dark-500'}" />
                        Profil
                      </Link>
                      <button
                        onClick={() => {
                          localStorage.removeItem('isLoggedIn');
                          window.location.href = '/login';
                        }}
                        className="w-full text-left px-4 py-2 text-${isDarkMode ? 'dark-200' : 'dark-900'} hover:bg-${isDarkMode ? 'dark-800/70' : 'dark-200/70'} hover:text-${isDarkMode ? 'dark-100' : 'dark-900'} transition-colors duration-300 flex items-center"
                      >
                        <LogOut className="h-4 w-4 mr-2 text-${isDarkMode ? 'dark-400' : 'dark-500'}" />
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
            
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg bg-${isDarkMode ? 'dark-800/50' : 'dark-200/50'} hover:bg-${isDarkMode ? 'dark-800' : 'dark-200'} text-${isDarkMode ? 'dark-300' : 'dark-500'} hover:text-${isDarkMode ? 'dark-100' : 'dark-900'} transition-all duration-300"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`md:hidden bg-${isDarkMode ? 'dark-900/95' : 'white'} backdrop-blur-sm border-t border-${isDarkMode ? 'dark-800/50' : 'dark-200/50'} shadow-lg shadow-${isDarkMode ? 'dark-950/10' : 'dark-200/10'}`}>
            <div className="container mx-auto px-4 py-3 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-3 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 ${
                    location.pathname === link.path
                      ? 'bg-cyto-600/10 text-cyto-400'
                      : `text-${isDarkMode ? 'dark-200' : 'dark-900'} hover:bg-${isDarkMode ? 'dark-800/70' : 'dark-200/70'} hover:text-${isDarkMode ? 'dark-100' : 'dark-900'}`
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
                
                {isLoggedIn ? (
                  <button
                    onClick={() => {
                      localStorage.removeItem('isLoggedIn');
                      window.location.href = '/login';
                    }}
                    className="px-3 py-2 rounded-lg flex items-center space-x-2 text-${isDarkMode ? 'dark-200' : 'dark-900'} hover:bg-${isDarkMode ? 'dark-800/70' : 'dark-200/70'} hover:text-${isDarkMode ? 'dark-100' : 'dark-900'} transition-colors duration-300"
                  >
                    <LogOut className="h-5 w-5 text-${isDarkMode ? 'dark-300' : 'dark-500'}" />
                    <span>Abmelden</span>
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="px-3 py-2 rounded-lg bg-gradient-to-r from-cyto-600 to-cyto-700 hover:from-cyto-500 hover:to-cyto-600 text-${isDarkMode ? 'white' : 'dark-900'} transition-all duration-300"
                  >
                    Anmelden
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
      
      {/* Banner */}
      {isBannerVisible && <InfoBanner onClose={() => setIsBannerVisible(false)} />}
      
      {/* Main Content */}
      <main className="flex-grow">
        {children || <Outlet />}
      </main>
      
      {/* Footer */}
      <footer className={`bg-${isDarkMode ? 'dark-900/30' : 'white'} border-t border-${isDarkMode ? 'dark-800/30' : 'dark-200/30'} mt-auto`}>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Logo und Beschreibung */}
            <div className="space-y-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className={`h-8 w-8 bg-gradient-to-br from-cyto-500 to-cyto-700 rounded-lg flex items-center justify-center`}>
                  <img src="/images/logo.png" alt="Cytooxien Logo" className="h-5 w-5" />
                </div>
                <span className={`font-bold text-lg text-${isDarkMode ? 'white' : 'dark-900'}`}>Cytooxien</span>
              </Link>
              <p className={`text-${isDarkMode ? 'dark-300' : 'dark-500'} text-sm`}>
                Cytooxien ist ein Minecraft-Server mit Fokus auf eine freundliche Community und kreatives Spielen.
              </p>
              <div className={`text-${isDarkMode ? 'dark-400' : 'dark-500'} text-xs mt-2 p-2 bg-${isDarkMode ? 'dark-900/50' : 'white'} rounded-lg border border-${isDarkMode ? 'dark-800/30' : 'dark-200/30'}`}>
                <p>Dieses Wiki wurde von einem Communitymitglied erstellt und wird von diesem betrieben. 
                Es handelt sich um keine offizielle Seite von Cytooxien. Es findet keine Kooperation mit Cytooxien statt. 
                Cytooxien haftet nicht und ist für diese Seite nicht verantwortlich.</p>
              </div>
            </div>
            
            {/* Links */}
            <div>
              <h3 className={`text-${isDarkMode ? 'dark-100' : 'dark-900'} font-semibold mb-4`}>Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className={`text-${isDarkMode ? 'dark-300' : 'dark-500'} hover:text-cyto-400 transition-colors duration-300`}>Startseite</Link>
                </li>
                <li>
                  <Link to="/wiki" className={`text-${isDarkMode ? 'dark-300' : 'dark-500'} hover:text-cyto-400 transition-colors duration-300`}>Wiki</Link>
                </li>
                <li>
                  <Link to="/server" className={`text-${isDarkMode ? 'dark-300' : 'dark-500'} hover:text-cyto-400 transition-colors duration-300`}>Server</Link>
                </li>
                <li>
                  <a href="https://discord.gg/cytooxien" target="_blank" rel="noopener noreferrer" className={`text-${isDarkMode ? 'dark-300' : 'dark-500'} hover:text-cyto-400 transition-colors duration-300`}>Discord</a>
                </li>
                <li>
                  <Link to="/contact" className={`text-${isDarkMode ? 'dark-300' : 'dark-500'} hover:text-cyto-400 transition-colors duration-300`}>Kontakt</Link>
                </li>
              </ul>
            </div>
            
            {/* Server Status */}
            <div>
              <h3 className={`text-${isDarkMode ? 'dark-100' : 'dark-900'} font-semibold mb-4`}>Server Status</h3>
              <div className={`bg-${isDarkMode ? 'dark-900/50' : 'white'} backdrop-blur-sm rounded-xl border border-${isDarkMode ? 'dark-800/50' : 'dark-200/50'} p-4`}>
                <ServerStatus />
              </div>
            </div>
          </div>
          
          <div className={`border-t border-${isDarkMode ? 'dark-800/30' : 'dark-200/30'} mt-8 pt-6 flex flex-col md:flex-row justify-between items-center`}>
            <p className={`text-${isDarkMode ? 'dark-400' : 'dark-500'} text-sm`}> 2023 Cytooxien-Wiki. Alle Rechte vorbehalten.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/terms" className={`text-${isDarkMode ? 'dark-400' : 'dark-500'} hover:text-${isDarkMode ? 'dark-200' : 'dark-900'} text-sm transition-colors duration-300`}>Nutzungsbedingungen</Link>
              <Link to="/privacy" className={`text-${isDarkMode ? 'dark-400' : 'dark-500'} hover:text-${isDarkMode ? 'dark-200' : 'dark-900'} text-sm transition-colors duration-300`}>Datenschutz</Link>
              <Link to="/" className={`text-${isDarkMode ? 'dark-400' : 'dark-500'} hover:text-${isDarkMode ? 'dark-200' : 'dark-900'} text-sm transition-colors duration-300`}>Impressum</Link>
              <Link to="/contact" className={`text-${isDarkMode ? 'dark-400' : 'dark-500'} hover:text-${isDarkMode ? 'dark-200' : 'dark-900'} text-sm transition-colors duration-300`}>Kontakt</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}