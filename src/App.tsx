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
import { Home } from './pages/Home';
import { Wiki } from './pages/Wiki';
import { Article } from './pages/Article';
import { FWSites } from './pages/FWSites';
import { Contact } from './pages/Contact';
import { Register } from './pages/Register';
import { Imprint } from './pages/Imprint';
import { Datenschutz } from './pages/Datenschutz';
import { NotFound } from './pages/NotFound';

// Lazy-loaded components
const WikiCategory = lazy(() => import('./pages/WikiCategory'));
const WikiArticle = lazy(() => import('./pages/WikiArticle'));
const UpdateDetail = lazy(() => import('./pages/UpdateDetail').then(module => ({ default: module.UpdateDetail })));
const Login = lazy(() => import('./pages/Login').then(module => ({ default: module.Login })));
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
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="wiki" element={<Outlet />}>
                      <Route index element={<Wiki />} />
                      <Route path=":category" element={
                        <Suspense fallback={<LoadingFallback />}>
                          <WikiCategory />
                        </Suspense>
                      } />
                      <Route path=":category/:article" element={
                        <Suspense fallback={<LoadingFallback />}>
                          <WikiArticle />
                        </Suspense>
                      } />
                    </Route>
                    <Route path="article/:categorySlug/:articleSlug" element={<Article />} />
                    <Route path="updates/:id" element={
                      <Suspense fallback={<LoadingFallback />}>
                        <UpdateDetail />
                      </Suspense>
                    } />
                    <Route path="fwsites" element={<FWSites />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="impressum" element={
                      <Suspense fallback={<LoadingFallback />}>
                        <Impressum />
                      </Suspense>
                    } />
                    <Route path="datenschutz" element={
                      <Suspense fallback={<LoadingFallback />}>
                        <Datenschutz />
                      </Suspense>
                    } />
                    <Route path="login" element={
                      <Suspense fallback={<LoadingFallback />}>
                        <Login />
                      </Suspense>
                    } />
                    <Route path="register" element={<Register />} />

                    <Route path="admin" element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
                      <Route index element={
                        <Suspense fallback={<LoadingFallback />}>
                          <Dashboard />
                        </Suspense>
                      } />
                      <Route path="articles" element={
                        <Suspense fallback={<LoadingFallback />}>
                          <Articles />
                        </Suspense>
                      } />
                      <Route path="articles/new" element={
                        <Suspense fallback={<LoadingFallback />}>
                          <ArticleEditor />
                        </Suspense>
                      } />
                      <Route path="articles/:id" element={
                        <Suspense fallback={<LoadingFallback />}>
                          <ArticleEditor />
                        </Suspense>
                      } />
                      <Route path="articles/:id/edit" element={
                        <Suspense fallback={<LoadingFallback />}>
                          <ArticleEditor />
                        </Suspense>
                      } />
                      <Route path="categories" element={
                        <Suspense fallback={<LoadingFallback />}>
                          <Categories />
                        </Suspense>
                      } />
                      <Route path="users" element={
                        <Suspense fallback={<LoadingFallback />}>
                          <Users />
                        </Suspense>
                      } />
                      <Route path="settings" element={
                        <Suspense fallback={<LoadingFallback />}>
                          <Settings />
                        </Suspense>
                      } />
                      <Route path="updates" element={
                        <Suspense fallback={<LoadingFallback />}>
                          <UpdatesManager />
                        </Suspense>
                      } />
                      <Route path="updates/new" element={
                        <Suspense fallback={<LoadingFallback />}>
                          <UpdateEditor />
                        </Suspense>
                      } />
                      <Route path="updates/:id" element={
                        <Suspense fallback={<LoadingFallback />}>
                          <UpdateEditor />
                        </Suspense>
                      } />
                    </Route>

                    <Route path="*" element={<NotFound />} />
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