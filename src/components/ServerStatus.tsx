import React, { useState, useEffect } from 'react';
import { useServerStatus } from '../hooks/useServerStatus';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function ServerStatus() {
  const { status, isLoading, isError, refetch } = useServerStatus();
  const [showDetails, setShowDetails] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { isDarkMode } = useTheme();

  // Simuliere einen längeren Ladevorgang für bessere UX
  useEffect(() => {
    if (isRefreshing) {
      const timer = setTimeout(() => {
        setIsRefreshing(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isRefreshing]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    refetch();
  };

  // Berechne den Prozentsatz der Online-Spieler
  const calculatePercentage = () => {
    if (!status || !status.players || status.players.max === 0) return 0;
    return (status.players.online / status.players.max) * 100;
  };

  // Formatiere den MOTD (Message of the Day) Text
  const formatMotd = () => {
    if (!status || !status.motd || !status.motd.clean) return '';
    return status.motd.clean.join(' ');
  };

  return (
    <div className={`relative overflow-hidden rounded-xl border transition-all duration-300 ${isDarkMode ? 'border-dark-700/50 bg-dark-800/30' : 'border-gray-200/70 bg-white/90'} shadow-sm`}>
      <div className="relative z-10 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className={`text-lg font-medium flex items-center ${isDarkMode ? 'text-dark-100' : 'text-gray-800'}`}>
            {status && status.online ? (
              <Wifi className={`w-5 h-5 mr-2 text-green-500`} />
            ) : (
              <WifiOff className={`w-5 h-5 mr-2 text-red-500`} />
            )}
            Cytooxien Server
          </h3>
          
          <button 
            onClick={handleRefresh}
            className={`bg-cyto-600 hover:bg-cyto-700 text-white rounded-lg p-2 ${isRefreshing ? 'animate-spin' : ''}`}
            disabled={isLoading || isRefreshing}
            aria-label="Aktualisieren"
          >
            <RefreshCw className={`w-4 h-4`} />
          </button>
        </div>
        
        {isLoading || isRefreshing ? (
          <div className="space-y-3 py-2">
            <div className={`h-5 bg-gradient-to-r ${isDarkMode ? 'from-dark-700/70 to-dark-800/70' : 'from-gray-200/70 to-gray-300/70'} rounded animate-pulse`}></div>
            <div className={`h-4 bg-gradient-to-r ${isDarkMode ? 'from-dark-700/70 to-dark-800/70' : 'from-gray-200/70 to-gray-300/70'} rounded animate-pulse w-3/4`}></div>
            <div className={`h-8 bg-gradient-to-r ${isDarkMode ? 'from-dark-700/50 to-dark-800/50' : 'from-gray-200/50 to-gray-300/50'} rounded-lg animate-pulse mt-4`}></div>
          </div>
        ) : isError ? (
          <div className="py-2">
            <p className={`text-red-500 ${isDarkMode ? 'text-red-400' : 'text-red-500'} mb-2`}>Server nicht erreichbar</p>
            <p className={`text-sm ${isDarkMode ? 'text-dark-400' : 'text-gray-600'}`}>Der Server ist momentan offline oder nicht erreichbar. Bitte versuche es später erneut.</p>
            <button 
              onClick={handleRefresh}
              className={`mt-3 px-4 py-2 rounded-lg bg-gradient-to-br ${isDarkMode ? 'from-cyto-600 to-cyto-700' : 'from-cyto-500 to-cyto-600'} text-white font-medium hover:shadow-lg ${isDarkMode ? 'hover:shadow-cyto-700/20' : 'hover:shadow-cyto-500/20'} transition-all duration-300`}
            >
              Erneut versuchen
            </button>
          </div>
        ) : (
          <>
            <div className="py-1">
              <div className="flex justify-between items-center mb-1">
                <p className={`text-sm ${isDarkMode ? 'text-dark-300' : 'text-gray-600'}`}>Status: <span className={`font-medium ${status?.online ? 'text-green-500' : 'text-red-500'}`}>{status?.online ? 'Online' : 'Offline'}</span></p>
                <p className={`text-sm ${isDarkMode ? 'text-dark-300' : 'text-gray-600'}`}>
                  <span className={`font-medium ${isDarkMode ? 'text-cyto-600' : 'text-cyto-600'}`}>{status?.players?.online || 0}</span>
                  <span className="mx-1">/</span>
                  <span className={`text-sm ${isDarkMode ? 'text-dark-300' : 'text-gray-600'}`}>{status?.players?.max || 0}</span> Spieler
                </p>
              </div>
              
              {status?.online && (
                <>
                  <div className={`relative h-2 bg-gradient-to-r ${isDarkMode ? 'from-dark-700/50 to-dark-800/50' : 'from-gray-200 to-gray-300'} rounded-full overflow-hidden mt-2 mb-3`}>
                    <div 
                      className={`absolute top-0 left-0 h-full bg-gradient-to-r ${isDarkMode ? 'from-cyto-500 to-cyto-600' : 'from-cyto-400 to-cyto-500'} rounded-full transition-all duration-500 ease-out`}
                      style={{ width: `${calculatePercentage()}%` }}
                    ></div>
                  </div>
                  
                  {formatMotd() && (
                    <p className={`text-sm ${isDarkMode ? 'text-dark-400' : 'text-gray-600'} mt-2 italic`}>
                      "{formatMotd()}"
                    </p>
                  )}
                </>
              )}
            </div>
            
            <button
              onClick={() => setShowDetails(!showDetails)}
              className={`w-full mt-3 px-4 py-2 rounded-lg border ${
                isDarkMode 
                  ? 'border-dark-700/50 bg-dark-800/50 text-dark-200 hover:bg-dark-750' 
                  : 'border-cyto-200 bg-cyto-50 text-cyto-700 hover:bg-cyto-100'
              } transition-all duration-300 text-sm font-medium`}
            >
              {showDetails ? 'Details ausblenden' : 'Details anzeigen'}
            </button>
            
            {showDetails && status?.online && (
              <div className={`mt-3 pt-3 border-t ${isDarkMode ? 'border-dark-700/50' : 'border-gray-200/70'}`}>
                <p className={`text-sm ${isDarkMode ? 'text-dark-300' : 'text-gray-600'} mb-1`}>
                  Version: <span className={`${isDarkMode ? 'text-dark-100' : 'text-gray-800'}`}>{status.version}</span>
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-dark-300' : 'text-gray-600'}`}>
                  IP-Adresse: <span className={`${isDarkMode ? 'text-cyto-400' : 'text-cyto-600'}`}>cytooxien.de</span>
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
