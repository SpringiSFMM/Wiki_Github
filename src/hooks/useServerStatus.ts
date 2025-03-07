import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

interface ServerStatusResponse {
  online: boolean;
  players: {
    online: number;
    max: number;
    sample?: Array<{
      name: string;
      id: string;
    }>;
  };
  version: string;
  protocol: number;
  motd: {
    raw: string[];
    clean: string[];
    html: string[];
  };
}

interface UseServerStatusResult {
  status: ServerStatusResponse | null;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

// Cache für den Serverstatus
let statusCache: {
  data: ServerStatusResponse | null;
  timestamp: number;
} = {
  data: null,
  timestamp: 0
};

// Cache-Gültigkeitsdauer in Millisekunden (2 Minuten)
const CACHE_DURATION = 2 * 60 * 1000;

// Simulierte Serverdaten für die Entwicklung
const mockServerStatus: ServerStatusResponse = {
  online: true,
  players: {
    online: 42,
    max: 100,
    sample: [
      { name: "Spieler1", id: "uuid1" },
      { name: "Spieler2", id: "uuid2" }
    ]
  },
  version: "1.20.4",
  protocol: 765,
  motd: {
    raw: ["Willkommen auf Cytooxien!"],
    clean: ["Willkommen auf Cytooxien!"],
    html: ["<span>Willkommen auf Cytooxien!</span>"]
  }
};

export function useServerStatus(serverAddress: string = 'cytooxien.de'): UseServerStatusResult {
  const [status, setStatus] = useState<ServerStatusResponse | null>(statusCache.data);
  const [isLoading, setIsLoading] = useState<boolean>(!statusCache.data);
  const [isError, setIsError] = useState<boolean>(false);

  const fetchServerStatus = useCallback(async (ignoreCache: boolean = false) => {
    // Prüfe, ob wir einen gültigen Cache haben und kein Force-Refresh angefordert wurde
    const now = Date.now();
    if (!ignoreCache && statusCache.data && (now - statusCache.timestamp) < CACHE_DURATION) {
      setStatus(statusCache.data);
      setIsLoading(false);
      setIsError(false);
      return;
    }

    setIsLoading(true);
    setIsError(false);
    
    // Im Entwicklungsmodus verwenden wir Mock-Daten, um CORS-Probleme zu vermeiden
    if (import.meta.env.DEV) {
      // Simuliere eine kurze Verzögerung für realistisches Verhalten
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Cache aktualisieren mit Mock-Daten
      statusCache = {
        data: mockServerStatus,
        timestamp: now
      };
      
      setStatus(mockServerStatus);
      setIsLoading(false);
      return;
    }
    
    try {
      // Verwende die API ohne Authorization-Header
      const response = await axios.get<ServerStatusResponse>(
        `https://api.mcsrvstat.us/2/${serverAddress}`,
        { 
          timeout: 5000, // Erhöhtes Timeout für bessere Zuverlässigkeit
          headers: {
            // Keine Authorization-Header senden
          }
        }
      );
      
      // Cache aktualisieren
      statusCache = {
        data: response.data,
        timestamp: now
      };
      
      setStatus(response.data);
    } catch (error) {
      console.error('Error fetching server status:', error);
      
      // Fallback zur mcsrvstat.us API
      try {
        const fallbackResponse = await axios.get(
          `https://api.mcsrvstat.us/2/${serverAddress}`,
          { 
            timeout: 5000,
            headers: {
              // Keine Authorization-Header senden
            }
          }
        );
        
        if (fallbackResponse.data && typeof fallbackResponse.data.online === 'boolean') {
          const formattedStatus = {
            online: fallbackResponse.data.online || false,
            players: {
              online: fallbackResponse.data.players?.online || 0,
              max: fallbackResponse.data.players?.max || 0
            },
            version: fallbackResponse.data.version,
            motd: fallbackResponse.data.motd
          };
          
          // Cache aktualisieren
          statusCache = {
            data: formattedStatus,
            timestamp: now
          };
          
          setStatus(formattedStatus);
        } else {
          // Wenn auch der Fallback fehlschlägt, setzen wir einen Offline-Status
          const offlineStatus = {
            online: false,
            players: {
              online: 0,
              max: 0
            }
          };
          
          statusCache = {
            data: offlineStatus,
            timestamp: now
          };
          
          setStatus(offlineStatus);
          setIsError(true);
        }
      } catch (fallbackError) {
        console.error('Fallback API also failed:', fallbackError);
        
        // Wenn beide APIs fehlschlagen, setzen wir einen Offline-Status
        const offlineStatus = {
          online: false,
          players: {
            online: 0,
            max: 0
          }
        };
        
        statusCache = {
          data: offlineStatus,
          timestamp: now
        };
        
        setStatus(offlineStatus);
        setIsError(true);
      }
    } finally {
      setIsLoading(false);
    }
  }, [serverAddress]);

  const refetch = useCallback(() => {
    fetchServerStatus(true); // Force-Refresh ignoriert den Cache
  }, [fetchServerStatus]);

  useEffect(() => {
    fetchServerStatus();
    
    // Aktualisiere den Status alle 60 Sekunden
    const intervalId = setInterval(() => {
      fetchServerStatus();
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, [fetchServerStatus]);

  return { status, isLoading, isError, refetch };
}
