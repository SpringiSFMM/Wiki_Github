import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { Home, AlertTriangle } from 'lucide-react';

export function NotFound() {
  const { isDarkMode } = useTheme();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className={`max-w-2xl mx-auto rounded-xl p-8 ${isDarkMode ? 'bg-dark-900/70 border border-dark-700' : 'bg-white border border-gray-200'} shadow-lg text-center`}>
        <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 mb-6">
          <AlertTriangle className="h-8 w-8 text-red-500 dark:text-red-400" />
        </div>
        
        <h1 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-cyto-400' : 'text-cyto-600'}`}>
          404
        </h1>
        
        <h2 className={`text-2xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Seite nicht gefunden
        </h2>
        
        <p className={`mb-8 ${isDarkMode ? 'text-dark-300' : 'text-gray-600'}`}>
          Die angeforderte Seite existiert nicht oder wurde verschoben.
          Bitte kehre zur Startseite zurück oder verwende die Navigation, um eine andere Seite zu finden.
        </p>
        
        <Link
          to="/"
          className={`inline-flex items-center px-6 py-3 rounded-lg ${
            isDarkMode 
              ? 'bg-cyto-600 text-white hover:bg-cyto-500' 
              : 'bg-cyto-500 text-white hover:bg-cyto-600'
          } transition-colors duration-300 shadow-sm`}
        >
          <Home className="h-5 w-5 mr-2" />
          Zur Startseite
        </Link>
      </div>
    </div>
  );
}

export default NotFound; 