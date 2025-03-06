import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/Layout';
import { AdminLayout } from './components/AdminLayout';
import { Home } from './pages/Home';
import { Wiki } from './pages/Wiki';
import { WikiCategory } from './pages/WikiCategory';
import { WikiArticle } from './pages/WikiArticle';
import { TestArticle } from './pages/TestArticle';
import { Dashboard } from './pages/admin/Dashboard';
import { ArticleEditor } from './pages/admin/ArticleEditor';
import { Settings } from './pages/admin/Settings';
import { Categories } from './pages/admin/Categories';
import { Articles } from './pages/admin/Articles';
import { UpdatesManager } from './pages/admin/UpdatesManager';
import { UpdateEditor } from './pages/admin/UpdateEditor';
import { Login } from './pages/Login';
import { AuthGuard } from './components/AuthGuard';
import { MaintenanceMode } from './components/MaintenanceMode';
import { useAuth } from './lib/auth';
import axios from 'axios';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function MaintenanceCheck({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await axios.get('/api/settings');
      return response.data;
    },
  });

  if (isLoading) return null;

  // Allow access to login page during maintenance
  if (location.pathname === '/login') {
    return <>{children}</>;
  }

  // Show maintenance page for non-authenticated users when maintenance mode is active
  if (settings?.maintenanceMode && !isAuthenticated) {
    return <MaintenanceMode message={settings.maintenanceMessage} />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <MaintenanceCheck>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/wiki" element={<Wiki />} />
              <Route path="/wiki/category/:category" element={<WikiCategory />} />
              <Route path="/wiki/:category/:article" element={<WikiArticle />} />
              <Route path="/test-article" element={<TestArticle />} />
            </Route>

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <AuthGuard>
                  <AdminLayout>
                    <Dashboard />
                  </AdminLayout>
                </AuthGuard>
              }
            />
            <Route
              path="/admin/articles"
              element={
                <AuthGuard>
                  <AdminLayout>
                    <Articles />
                  </AdminLayout>
                </AuthGuard>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <AuthGuard>
                  <AdminLayout>
                    <Categories />
                  </AdminLayout>
                </AuthGuard>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <AuthGuard>
                  <AdminLayout>
                    <Settings />
                  </AdminLayout>
                </AuthGuard>
              }
            />
            <Route
              path="/admin/articles/new"
              element={
                <AuthGuard>
                  <AdminLayout>
                    <ArticleEditor />
                  </AdminLayout>
                </AuthGuard>
              }
            />
            <Route
              path="/admin/articles/:id/edit"
              element={
                <AuthGuard>
                  <AdminLayout>
                    <ArticleEditor />
                  </AdminLayout>
                </AuthGuard>
              }
            />
            <Route
              path="/admin/updates"
              element={
                <AuthGuard>
                  <AdminLayout>
                    <UpdatesManager />
                  </AdminLayout>
                </AuthGuard>
              }
            />
            <Route
              path="/admin/updates/new"
              element={
                <AuthGuard>
                  <AdminLayout>
                    <UpdateEditor />
                  </AdminLayout>
                </AuthGuard>
              }
            />
            <Route
              path="/admin/updates/:id"
              element={
                <AuthGuard>
                  <AdminLayout>
                    <UpdateEditor />
                  </AdminLayout>
                </AuthGuard>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MaintenanceCheck>
        <Toaster position="top-right" />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;