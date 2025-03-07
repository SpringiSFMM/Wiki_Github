import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, FileText, Users, Clock, Eye, Edit, Trash2, Plus, FolderOpen, FolderCog, UserCog, Settings, ExternalLink } from 'lucide-react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../lib/auth';
import { useTheme } from '../../contexts/ThemeContext';

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
  }} = useQuery<Stats>({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const response = await axios.get('/api/admin/stats');
      return response.data;
    },
    refetchInterval: 10000,
  });

  // Fetch recent articles
  const { data: articles = [] } = useQuery<Article[]>({
    queryKey: ['recentArticles'],
    queryFn: async () => {
      const response = await axios.get('/api/admin/articles/recent');
      return Array.isArray(response.data) ? response.data : [];
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
      const response = await axios.get('/api/admin/statistics');
      return response.data;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      return {
        articles: 0,
        categories: 0,
        users: 0,
        views: 0
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

      {/* Menü-Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`rounded-xl p-6 flex items-start hover:shadow-lg transition-all duration-300 ${
              isDarkMode 
                ? 'bg-dark-900/70 border-dark-800 hover:shadow-dark-950/30 border' 
                : 'bg-white hover:shadow-gray-200/50 border border-gray-100'
            }`}
          >
            <div className={`rounded-xl p-3 mr-4 ${
              isDarkMode ? 'bg-dark-800' : 'bg-gray-100'
            }`}>
              {item.icon}
            </div>
            <div>
              <h3 className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {item.title}
              </h3>
              <p className={`mt-1 ${isDarkMode ? 'text-dark-300' : 'text-gray-500'}`}>
                {item.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Articles */}
      <div className={`rounded-xl border transition-all duration-300 ${
        isDarkMode 
          ? 'bg-dark-900 border-dark-800' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="p-6 border-b border-dark-800">
          <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-dark-900'}`}>Recent Articles</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={isDarkMode ? 'border-b border-dark-800 bg-dark-800/50' : 'border-b border-gray-200 bg-gray-50'}>
                <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-dark-400' : 'text-gray-500'} uppercase tracking-wider`}>Title</th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-dark-400' : 'text-gray-500'} uppercase tracking-wider`}>Author</th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-dark-400' : 'text-gray-500'} uppercase tracking-wider`}>Category</th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-dark-400' : 'text-gray-500'} uppercase tracking-wider`}>Last Modified</th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-dark-400' : 'text-gray-500'} uppercase tracking-wider`}>Status</th>
                <th className={`px-6 py-3 text-right text-xs font-medium ${isDarkMode ? 'text-dark-400' : 'text-gray-500'} uppercase tracking-wider`}>Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-dark-800' : 'divide-gray-200'}`}>
              {articles.length > 0 ? (
                articles.map((article) => (
                  <tr key={article.id} className={`transition-colors ${isDarkMode ? 'hover:bg-dark-800/50' : 'hover:bg-gray-50'}`}>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{article.title}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-dark-300' : 'text-gray-500'}`}>{article.author}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-dark-300' : 'text-gray-500'}`}>{article.category}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-dark-300' : 'text-gray-500'}`}>{article.lastModified}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        article.status === 'published' 
                          ? isDarkMode ? 'bg-green-800/20 text-green-400' : 'bg-green-100 text-green-800'
                          : isDarkMode ? 'bg-amber-800/20 text-amber-400' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {article.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link 
                          to={`/admin/articles/${article.id}`} 
                          className={`p-1 rounded-md ${isDarkMode ? 'text-dark-300 hover:text-white hover:bg-dark-800' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button 
                          onClick={() => setDeleteArticleId(article.id)} 
                          className={`p-1 rounded-md ${isDarkMode ? 'text-dark-300 hover:text-white hover:bg-red-900/20' : 'text-gray-500 hover:text-gray-700 hover:bg-red-100'}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className={`px-6 py-4 text-center text-sm ${isDarkMode ? 'text-dark-300' : 'text-gray-500'}`}>
                    No articles found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteArticleId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`rounded-xl p-6 max-w-md w-full ${isDarkMode ? 'bg-dark-900' : 'bg-white'}`}>
            <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Confirm Deletion</h3>
            <p className={`mb-6 ${isDarkMode ? 'text-dark-300' : 'text-gray-500'}`}>
              Are you sure you want to delete this article? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteArticleId(null)}
                className={`px-4 py-2 rounded-lg ${
                  isDarkMode 
                    ? 'bg-dark-800 text-dark-300 hover:bg-dark-700' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } transition-colors`}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteArticle(deleteArticleId)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}