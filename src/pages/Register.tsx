import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validierung
    if (password !== confirmPassword) {
      setError('Die Passwörter stimmen nicht überein.');
      return;
    }
    
    if (password.length < 8) {
      setError('Das Passwort muss mindestens 8 Zeichen lang sein.');
      return;
    }
    
    if (!acceptTerms) {
      setError('Du musst den Nutzungsbedingungen zustimmen.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await axios.post('/api/auth/register', {
        username,
        email,
        password
      });
      
      toast.success('Registrierung erfolgreich! Du kannst dich jetzt anmelden.');
      navigate('/login');
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Bei der Registrierung ist ein Fehler aufgetreten. Bitte versuche es später erneut.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Hintergrund-Elemente */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-950 to-dark-900"></div>
      <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5"></div>
      
      {/* Dekorative Elemente */}
      <div className="absolute top-20 left-1/4 w-64 h-64 bg-gradient-to-r from-cyto-600/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-to-l from-cyto-700/10 to-transparent rounded-full blur-3xl"></div>
      
      <div className="relative z-10 w-full max-w-md">
        {/* Logo und Titel */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-cyto-500 to-cyto-700 rounded-xl flex items-center justify-center shadow-lg shadow-cyto-600/10 mb-4 transform hover:scale-105 transition-all duration-300">
            <img src="/images/logo.png" alt="Kaktus Tycoon Logo" className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-bold text-dark-100">Konto erstellen</h2>
          <p className="mt-2 text-dark-300">Registriere dich für das Kaktus Tycoon - Wiki</p>
        </div>
        
        {/* Registrierungs-Formular */}
        <div className="bg-dark-900/50 backdrop-blur-sm rounded-2xl border border-dark-800/50 p-8 shadow-xl shadow-dark-950/20">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Benutzername-Feld */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-dark-200 mb-2">
                Benutzername
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-dark-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 bg-dark-800/70 border border-dark-700/50 rounded-xl text-dark-200 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-cyto-500/50 focus:border-transparent transition-all duration-300"
                  placeholder="Dein Benutzername"
                />
              </div>
            </div>
            
            {/* E-Mail-Feld */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-dark-200 mb-2">
                E-Mail-Adresse
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-dark-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 bg-dark-800/70 border border-dark-700/50 rounded-xl text-dark-200 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-cyto-500/50 focus:border-transparent transition-all duration-300"
                  placeholder="deine@email.de"
                />
              </div>
            </div>
            
            {/* Passwort-Feld */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-dark-200 mb-2">
                Passwort
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-dark-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 bg-dark-800/70 border border-dark-700/50 rounded-xl text-dark-200 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-cyto-500/50 focus:border-transparent transition-all duration-300"
                  placeholder="••••••••"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-dark-400 hover:text-dark-200 transition-colors duration-300 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <p className="mt-1 text-xs text-dark-400">
                Mindestens 8 Zeichen
              </p>
            </div>
            
            {/* Passwort bestätigen */}
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-dark-200 mb-2">
                Passwort bestätigen
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-dark-400" />
                </div>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 bg-dark-800/70 border border-dark-700/50 rounded-xl text-dark-200 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-cyto-500/50 focus:border-transparent transition-all duration-300"
                  placeholder="••••••••"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-dark-400 hover:text-dark-200 transition-colors duration-300 focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Nutzungsbedingungen */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="h-4 w-4 bg-dark-800 border-dark-700 rounded text-cyto-600 focus:ring-cyto-500/50 focus:ring-offset-0 transition-colors duration-300"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-dark-300">
                  Ich akzeptiere die <Link to="/terms" className="font-medium text-cyto-400 hover:text-cyto-300 transition-colors duration-300">Nutzungsbedingungen</Link> und <Link to="/privacy" className="font-medium text-cyto-400 hover:text-cyto-300 transition-colors duration-300">Datenschutzrichtlinien</Link>
                </label>
              </div>
            </div>
            
            {/* Registrierungs-Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full flex justify-center py-3 px-4 rounded-xl text-white font-medium group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyto-600 to-cyto-700 transition-transform duration-300 group-hover:scale-105"></div>
                <div className="absolute inset-0 opacity-0 bg-gradient-to-r from-cyto-500 to-cyto-600 transition-opacity duration-300 group-hover:opacity-100"></div>
                <span className="relative z-10 flex items-center">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Registrierung...
                    </>
                  ) : (
                    'Registrieren'
                  )}
                </span>
              </button>
            </div>
          </form>
          
          {/* Login-Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-dark-300">
              Bereits ein Konto?{' '}
              <Link to="/login" className="font-medium text-cyto-400 hover:text-cyto-300 transition-colors duration-300">
                Jetzt anmelden
              </Link>
            </p>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center text-xs text-dark-400">
          <p> 2023 Kaktus Tycoon - Wiki. Alle Rechte vorbehalten.</p>
          <div className="mt-2 space-x-4">
            <Link to="/terms" className="hover:text-dark-300 transition-colors duration-300">Nutzungsbedingungen</Link>
            <Link to="/privacy" className="hover:text-dark-300 transition-colors duration-300">Datenschutz</Link>
            <Link to="/contact" className="hover:text-dark-300 transition-colors duration-300">Kontakt</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
