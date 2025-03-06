import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';

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
}

// Initialize axios defaults if token exists in localStorage
const savedAuth = JSON.parse(localStorage.getItem('auth-storage') || '{}');
if (savedAuth.state?.token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${savedAuth.state.token}`;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
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
        
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);