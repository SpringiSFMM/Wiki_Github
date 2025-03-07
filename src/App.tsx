import React, { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/Layout';
import { MaintenanceMode } from './components/MaintenanceMode';
import { useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import axios from 'axios';

// Lazy-loaded components
const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const Wiki = lazy(() => import('./pages/Wiki').then(module => ({ default: module.Wiki })));
const WikiCategory = lazy(() => import('./pages/WikiCategory').then(module => ({ default: module.WikiCategory })));
const WikiArticle = lazy(() => import('./pages/WikiArticle').then(module => ({ default: module.WikiArticle })));
const FWSites = lazy(() => import('./pages/FWSites').then(module => ({ default: module.FWSites })));
const UpdateDetail = lazy(() => import('./pages/UpdateDetail').then(module => ({ default: module.UpdateDetail })));
const Contact = lazy(() => import('./pages/Contact').then(module => ({ default: module.Contact })));
const Login = lazy(() => import('./pages/Login').then(module => ({ default: module.Login })));
const Imprint = lazy(() => import('./pages/Imprint').then(module => ({ default: module.Imprint })));
const Impressum = lazy(() => import('./pages/Impressum').then(module => ({ default: module.Impressum })));

// Admin components
const Dashboard = lazy(() => import('./pages/admin/Dashboard').then(module => ({ default: module.Dashboard })));
const ArticleEditor = lazy(() => import('./pages/admin/ArticleEditor').then(module => ({ default: module.ArticleEditor })));
const Settings = lazy(() => import('./pages/admin/Settings').then(module => ({ default: module.Settings })));
const Categories = lazy(() => import('./pages/admin/Categories').then(module => ({ default: module.Categories })));
const Articles = lazy(() => import('./pages/admin/Articles').then(module => ({ default: module.Articles })));
const Users = lazy(() => import('./pages/admin/Users').then(module => ({ default: module.Users })));
const UpdatesManager = lazy(() => import('./pages/admin/UpdatesManager').then(module => ({ default: module.UpdatesManager })));
const UpdateEditor = lazy(() => import('./pages/admin/UpdateEditor').then(module => ({ default: module.UpdateEditor })));

// Loading-Komponente für Suspense
const LoadingFallback = () => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    // Zeige den Loader für mindestens 3 Sekunden an
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!isVisible) return null;
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-dark-900">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-cyto-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-cyto-400">Lade Inhalte...</p>
      </div>
    </div>
  );
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 Minuten Cache
    },
  },
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const location = useLocation();

  if (auth.isLoading) {
    return <LoadingFallback />;
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

function MaintenanceCheck({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const { data: settings, isLoading: isSettingsLoading, isError } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      try {
        const response = await axios.get('/api/settings');
        return response.data;
      } catch (error) {
        console.error('Failed to fetch maintenance settings:', error);
        return { maintenanceMode: false };
      }
    },
  });

  if (isSettingsLoading) return <LoadingFallback />;
  
  if (isError) {
    console.error('Error fetching maintenance settings');
    return <>{children}</>;
  }

  // Wenn der Maintenance-Modus aktiv ist
  if (settings?.maintenanceMode) {
    // Erlaube Zugriff auf die Login-Seite
    if (location.pathname === '/login') {
      return <>{children}</>;
    }
    
    // Erlaube authentifizierten Benutzern Zugriff auf Admin-Seiten
    if (isAuthenticated && location.pathname.startsWith('/admin')) {
      return <>{children}</>;
    }
    
    // Zeige die Maintenance-Seite für alle anderen Fälle
    return <MaintenanceMode message={settings.maintenanceMessage || 'Wir führen gerade Wartungsarbeiten durch. Bitte versuchen Sie es später erneut.'} />;
  }

  // Wenn der Maintenance-Modus nicht aktiv ist, zeige die normale Seite
  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <BrowserRouter>
            <MaintenanceCheck>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route element={<Layout />}>
                    {/* Public Routes */}
                    <Route index element={<Home />} />
                    <Route path="wiki" element={<Wiki />} />
                    <Route path="wiki/category/:category" element={<WikiCategory />} />
                    <Route path="wiki/:category/:article" element={<WikiArticle />} />
                    <Route path="fwsites" element={<FWSites />} />
                    <Route path="updates/:id" element={<UpdateDetail />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="imprint" element={<Imprint />} />
                    <Route path="impressum" element={<Impressum />} />
                    <Route path="login" element={<Login />} />

                    {/* Protected Admin Routes */}
                    <Route path="admin">
                      <Route index element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="articles" element={
                        <ProtectedRoute>
                          <Articles />
                        </ProtectedRoute>
                      } />
                      <Route path="articles/new" element={
                        <ProtectedRoute>
                          <ArticleEditor />
                        </ProtectedRoute>
                      } />
                      <Route path="articles/:id" element={
                        <ProtectedRoute>
                          <ArticleEditor />
                        </ProtectedRoute>
                      } />
                      <Route path="categories" element={
                        <ProtectedRoute>
                          <Categories />
                        </ProtectedRoute>
                      } />
                      <Route path="users" element={
                        <ProtectedRoute>
                          <Users />
                        </ProtectedRoute>
                      } />
                      <Route path="settings" element={
                        <ProtectedRoute>
                          <Settings />
                        </ProtectedRoute>
                      } />
                      <Route path="updates" element={
                        <ProtectedRoute>
                          <UpdatesManager />
                        </ProtectedRoute>
                      } />
                      <Route path="updates/new" element={
                        <ProtectedRoute>
                          <UpdateEditor />
                        </ProtectedRoute>
                      } />
                      <Route path="updates/:id" element={
                        <ProtectedRoute>
                          <UpdateEditor />
                        </ProtectedRoute>
                      } />
                    </Route>
                  </Route>
                </Routes>
              </Suspense>
            </MaintenanceCheck>
            <Toaster position="bottom-right" />
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;