import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  username: string;
  role: 'admin';
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => boolean;
}

// Initialize axios defaults if token exists in localStorage
const savedAuth = JSON.parse(localStorage.getItem('auth-storage') || '{}');
if (savedAuth.state?.token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${savedAuth.state.token}`;
}

// Funktion zum Überprüfen, ob ein Token abgelaufen ist
const isTokenExpired = (token: string): boolean => {
  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: async (username: string, password: string) => {
        try {
          const response = await axios.post('/api/auth/login', {
            username,
            password,
          });

          const { token, user } = response.data;

          // Set the token in axios defaults for future requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          set({
            token,
            user,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error('Login error:', error);
          throw error;
        }
      },
      logout: () => {
        // Remove the token from axios defaults
        delete axios.defaults.headers.common['Authorization'];
        
        // Entferne auch den Token aus dem localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('rememberMe');
        
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });
      },
      checkAuth: () => {
        const { token } = get();
        
        // Wenn kein Token vorhanden ist, ist der Benutzer nicht authentifiziert
        if (!token) {
          // Prüfe, ob ein Token im localStorage gespeichert ist
          const storedToken = localStorage.getItem('token');
          const storedUser = localStorage.getItem('user');
          
          if (storedToken && storedUser) {
            // Prüfe, ob der Token abgelaufen ist
            if (!isTokenExpired(storedToken)) {
              // Token ist gültig, setze den Benutzer als authentifiziert
              axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
              
              set({
                token: storedToken,
                user: JSON.parse(storedUser),
                isAuthenticated: true,
              });
              
              return true;
            } else {
              // Token ist abgelaufen, entferne ihn
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              localStorage.removeItem('rememberMe');
            }
          }
          
          return false;
        }
        
        // Prüfe, ob der vorhandene Token abgelaufen ist
        if (isTokenExpired(token)) {
          // Token ist abgelaufen, setze den Benutzer als nicht authentifiziert
          set({
            token: null,
            user: null,
            isAuthenticated: false,
          });
          
          return false;
        }
        
        return true;
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);