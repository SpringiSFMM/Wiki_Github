import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  const from = location.state?.from?.pathname || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await auth.login(username, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError('Ungültige Anmeldedaten. Bitte überprüfen Sie Ihren Benutzernamen und Ihr Passwort.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 
      ${isDarkMode ? 'bg-dark-900' : 'bg-gray-50'}`}>
      <div className={`max-w-md w-full space-y-8 p-8 rounded-xl border shadow-lg backdrop-blur-sm
        ${isDarkMode 
          ? 'bg-dark-800/50 border-dark-700' 
          : 'bg-white/50 border-gray-200'}`}>
        
        <div>
          <h2 className={`mt-6 text-center text-3xl font-bold 
            ${isDarkMode ? 'text-cyto-400' : 'text-cyto-600'}`}>
            Admin Login
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className={`p-3 rounded-lg text-sm ${isDarkMode ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-500'}`}>
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="username" className={`block text-sm font-medium mb-2
                ${isDarkMode ? 'text-dark-200' : 'text-gray-700'}`}>
                Benutzername
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none
                  ${isDarkMode ? 'text-dark-400' : 'text-gray-400'}`}>
                  <User className="h-5 w-5" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`appearance-none rounded-lg relative block w-full pl-10 px-3 py-2 border 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent transition-colors duration-300
                    ${isDarkMode 
                      ? 'bg-dark-700 border-dark-600 text-dark-100 placeholder-dark-400 focus:ring-cyto-500 focus:border-cyto-500' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-cyto-500 focus:border-cyto-500'}`}
                  placeholder="Benutzername eingeben"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className={`block text-sm font-medium mb-2
                ${isDarkMode ? 'text-dark-200' : 'text-gray-700'}`}>
                Passwort
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none
                  ${isDarkMode ? 'text-dark-400' : 'text-gray-400'}`}>
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`appearance-none rounded-lg relative block w-full pl-10 px-3 py-2 border 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent transition-colors duration-300
                    ${isDarkMode 
                      ? 'bg-dark-700 border-dark-600 text-dark-100 placeholder-dark-400 focus:ring-cyto-500 focus:border-cyto-500' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-cyto-500 focus:border-cyto-500'}`}
                  placeholder="Passwort eingeben"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg
                text-white bg-cyto-600 hover:bg-cyto-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                focus:ring-cyto-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                ${isDarkMode ? 'focus:ring-offset-dark-900' : 'focus:ring-offset-white'}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Anmeldung...
                </>
              ) : (
                'Anmelden'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}