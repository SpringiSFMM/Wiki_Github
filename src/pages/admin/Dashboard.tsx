import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, FileText, Users, Clock, Eye, Edit, Trash2, Plus, FolderOpen, FolderCog, UserCog, Settings, ExternalLink } from 'lucide-react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../lib/auth';
import { useTheme } from '../../contexts/ThemeContext';
import { articles as staticArticles } from '../../data/articles'; // Importiere statische Artikel als Fallback

interface Article {
  id: string;
  title: string;
  author: string;
  category: string;
  lastModified: string;
  status: 'published' | 'draft';
}

interface Stats {
  totalArticles: number;
  totalViews: number;
  activeEditors: number;
  articlesThisMonth: number;
}

export function Dashboard() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [deleteArticleId, setDeleteArticleId] = React.useState<string | null>(null);

  // Fetch dashboard stats
  const { data: stats = {
    totalArticles: 0,
    totalViews: 0,
    activeEditors: 0,
    articlesThisMonth: 0
  }, isLoading: isLoadingStats } = useQuery<Stats>({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      try {
        console.log('Versuche, Dashboard-Statistiken von API zu laden...');
        const response = await axios.get('/api/admin/stats');
        
        // Prüfen, ob wir gültige Daten haben
        if (response.data && typeof response.data === 'object') {
          console.log('Dashboard-Statistiken erfolgreich geladen');
          return response.data;
        } else {
          console.warn('Keine gültigen Dashboard-Statistiken von API erhalten, verwende Standard-Statistiken');
          
          // Wenn keine Daten von der API kommen, verwende statische Daten
          return {
            totalArticles: staticArticles.length,
            totalViews: staticArticles.reduce((sum, a) => sum + a.id * 50, 500),
            activeEditors: 2,
            articlesThisMonth: Math.floor(staticArticles.length * 0.7)
          };
        }
      } catch (error) {
        console.error('Fehler beim Laden der Dashboard-Statistiken:', error);
        
        // Im Fehlerfall verwende statische Daten
        return {
          totalArticles: staticArticles.length,
          totalViews: staticArticles.reduce((sum, a) => sum + a.id * 50, 500),
          activeEditors: 2,
          articlesThisMonth: Math.floor(staticArticles.length * 0.7)
        };
      }
    },
    refetchInterval: 10000,
  });

  // Fetch recent articles
  const { data: articles = [], isLoading: isLoadingArticles } = useQuery<Article[]>({
    queryKey: ['recentArticles'],
    queryFn: async () => {
      try {
        console.log('Versuche, neueste Artikel von API zu laden...');
        const response = await axios.get('/api/admin/articles/recent');
        
        // Prüfen, ob wir gültige Daten haben
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          console.log(`${response.data.length} neueste Artikel erfolgreich geladen`);
          return response.data;
        } else {
          console.warn('Keine Artikel von API erhalten, verwende statische Artikel');
          
          // Wenn keine Daten von der API kommen, verwende statische Daten
          const recentArticles = staticArticles
            .slice(0, 5)
            .map(article => ({
              id: article.id.toString(),
              title: article.title,
              author: article.author || 'KaktusTycoon Team',
              category: article.category,
              lastModified: article.lastUpdated,
              status: 'published' as const
            }));
            
          return recentArticles;
        }
      } catch (error) {
        console.error('Fehler beim Laden der neuesten Artikel:', error);
        
        // Im Fehlerfall verwende statische Daten
        const recentArticles = staticArticles
          .slice(0, 5)
          .map(article => ({
            id: article.id.toString(),
            title: article.title,
            author: article.author || 'KaktusTycoon Team',
            category: article.category,
            lastModified: article.lastUpdated,
            status: 'published' as const
          }));
          
        return recentArticles;
      }
    },
    refetchInterval: 10000,
  });

  const handleDeleteArticle = async (id: string) => {
    try {
      await axios.delete(`/api/admin/articles/${id}`);
      queryClient.invalidateQueries({ queryKey: ['recentArticles'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      toast.success('Article deleted successfully');
      setDeleteArticleId(null);
    } catch (error) {
      toast.error('Failed to delete article');
    }
  };

  const statsConfig = [
    { label: 'Total Articles', value: stats?.totalArticles ?? 0, icon: FileText },
    { label: 'Total Views', value: stats?.totalViews ?? 0, icon: Eye },
    { label: 'Active Editors', value: stats?.activeEditors ?? 0, icon: Users },
    { label: 'Articles This Month', value: stats?.articlesThisMonth ?? 0, icon: BarChart3 },
  ];

  const getStatistics = async () => {
    try {
      console.log('Versuche, Admin-Statistiken von API zu laden...');
      const response = await axios.get('/api/admin/statistics');
      
      // Prüfen, ob wir gültige Daten haben
      if (response.data && typeof response.data === 'object') {
        console.log('Admin-Statistiken erfolgreich geladen');
        return response.data;
      } else {
        console.warn('Keine gültigen Statistiken von API erhalten, verwende Standard-Statistiken');
        
        // Wenn keine Daten von der API kommen, verwende statische Daten
        return {
          articles: staticArticles.length,
          categories: new Set(staticArticles.map(a => a.category)).size,
          users: 3,
          views: 1500
        };
      }
    } catch (error) {
      console.error('Fehler beim Laden der Statistiken:', error);
      
      // Im Fehlerfall verwende statische Daten
      return {
        articles: staticArticles.length,
        categories: new Set(staticArticles.map(a => a.category)).size,
        users: 3,
        views: 1500
      };
    }
  };

  const { data: statistics, isLoading } = useQuery({
    queryKey: ['adminStatistics'],
    queryFn: getStatistics
  });

  const cards = [
    {
      title: "Artikel",
      value: statistics?.articles || 0,
      icon: <FileText className={`w-8 h-8 ${isDarkMode ? 'text-cyto-400' : 'text-cyto-600'}`} />,
      gradient: isDarkMode ? 'from-cyto-600/20 via-cyto-700/10 to-transparent' : 'from-cyto-500/20 via-cyto-600/10 to-transparent'
    },
    {
      title: "Kategorien",
      value: statistics?.categories || 0,
      icon: <FolderOpen className={`w-8 h-8 ${isDarkMode ? 'text-cyto-400' : 'text-cyto-600'}`} />,
      gradient: isDarkMode ? 'from-cyto-600/20 via-cyto-700/10 to-transparent' : 'from-cyto-500/20 via-cyto-600/10 to-transparent'
    },
    {
      title: "Benutzer",
      value: statistics?.users || 0,
      icon: <Users className={`w-8 h-8 ${isDarkMode ? 'text-cyto-400' : 'text-cyto-600'}`} />,
      gradient: isDarkMode ? 'from-cyto-600/20 via-cyto-700/10 to-transparent' : 'from-cyto-500/20 via-cyto-600/10 to-transparent'
    },
    {
      title: "Aufrufe",
      value: statistics?.views || 0,
      icon: <Eye className={`w-8 h-8 ${isDarkMode ? 'text-cyto-400' : 'text-cyto-600'}`} />,
      gradient: isDarkMode ? 'from-cyto-600/20 via-cyto-700/10 to-transparent' : 'from-cyto-500/20 via-cyto-600/10 to-transparent'
    }
  ];

  const menuItems = [
    {
      title: "Artikel bearbeiten",
      description: "Vorhandene Artikel bearbeiten oder neue erstellen",
      icon: <FileText className={`w-6 h-6 ${isDarkMode ? 'text-cyto-400' : 'text-cyto-600'}`} />,
      path: "/admin/articles"
    },
    {
      title: "Kategorien verwalten",
      description: "Kategorien erstellen, bearbeiten und löschen",
      icon: <FolderCog className={`w-6 h-6 ${isDarkMode ? 'text-cyto-400' : 'text-cyto-600'}`} />,
      path: "/admin/categories"
    },
    {
      title: "Benutzer verwalten",
      description: "Benutzerkonten und Berechtigungen verwalten",
      icon: <UserCog className={`w-6 h-6 ${isDarkMode ? 'text-cyto-400' : 'text-cyto-600'}`} />,
      path: "/admin/users"
    },
    {
      title: "Einstellungen",
      description: "Wiki-Einstellungen und Konfiguration",
      icon: <Settings className={`w-6 h-6 ${isDarkMode ? 'text-cyto-400' : 'text-cyto-600'}`} />,
      path: "/admin/settings"
    }
  ];

  return (
    <div className={`p-6 space-y-8 ${isDarkMode ? 'bg-dark-950' : 'bg-gray-100'} min-h-screen`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-cyto-400' : 'text-cyto-600'}`}>
            Admin Dashboard
          </h1>
          <p className={`mt-1 ${isDarkMode ? 'text-dark-300' : 'text-gray-600'}`}>
            Willkommen zurück, {user?.username || 'Admin'}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/"
            className={`inline-flex items-center px-4 py-2 rounded-lg ${
              isDarkMode 
                ? 'bg-dark-800 text-dark-200 hover:bg-dark-700 hover:text-dark-100' 
                : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-800'
            } transition-colors duration-300`}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Wiki ansehen
          </Link>
          <button
            className={`inline-flex items-center px-4 py-2 rounded-lg ${
              isDarkMode 
                ? 'bg-cyto-600 text-white hover:bg-cyto-500' 
                : 'bg-cyto-500 text-white hover:bg-cyto-600'
            } transition-colors duration-300`}
          >
            <Plus className="w-4 h-4 mr-2" />
            Neuer Artikel
          </button>
        </div>
      </div>

      {/* Statistikkarten */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className={`rounded-xl p-6 relative overflow-hidden ${
                isDarkMode ? 'bg-dark-900/70 border-dark-800' : 'bg-white border-gray-100'
              } border shadow-sm animate-pulse`}
            >
              <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-dark-700 mb-3"></div>
              <div className="h-4 w-20 rounded bg-gray-300 dark:bg-dark-700 mb-2"></div>
              <div className="h-6 w-12 rounded bg-gray-300 dark:bg-dark-700"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <div 
              key={index} 
              className={`rounded-xl p-6 relative overflow-hidden ${
                isDarkMode ? 'bg-dark-900/70 border-dark-800' : 'bg-white border-gray-100'
              } border shadow-sm transition-all duration-300 hover:shadow-lg ${
                isDarkMode ? 'hover:shadow-dark-950/30' : 'hover:shadow-gray-200/50'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-50`}></div>
              <div className="relative z-10">
                {card.icon}
                <h3 className={`mt-3 font-medium ${isDarkMode ? 'text-dark-300' : 'text-gray-500'}`}>
                  {card.title}
                </h3>
                <p className={`text-2xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {card.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}