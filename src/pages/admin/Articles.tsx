import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Edit, Trash2, Plus } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { articles as staticArticles } from '../../data/articles'; // Importiere statische Artikel

interface Article {
  id: string;
  title: string;
  slug: string;
  description?: string;
  categorySlug: string;
  category: string;
  lastUpdated: string;
  author: string;
  status: 'published' | 'draft';
}

export function Articles() {
  const queryClient = useQueryClient();
  const { isDarkMode } = useTheme();
  const [deleteArticleId, setDeleteArticleId] = React.useState<string | null>(null);

  // Fetch all articles
  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: ['articles'],
    queryFn: async () => {
      try {
        console.log('Versuche, Artikel von API zu laden...');
        const response = await axios.get('/api/admin/articles');
        
        // Prüfen, ob wir gültige Daten haben
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          console.log(`${response.data.length} Artikel erfolgreich geladen`);
          return response.data;
        } else {
          console.warn('Keine Artikel von API erhalten, verwende statische Artikel');
          
          // Wenn keine Daten von der API kommen, verwende statische Daten
          return staticArticles.map(article => ({
            id: article.id.toString(),
            title: article.title,
            slug: article.slug,
            description: article.description,
            categorySlug: article.categorySlug,
            category: article.category,
            lastUpdated: article.lastUpdated,
            author: article.author || 'KaktusTycoon Team',
            status: 'published' as const
          }));
        }
      } catch (error) {
        console.error('Fehler beim Laden der Artikel:', error);
        
        // Im Fehlerfall verwende statische Daten
        return staticArticles.map(article => ({
          id: article.id.toString(),
          title: article.title,
          slug: article.slug,
          description: article.description,
          categorySlug: article.categorySlug,
          category: article.category,
          lastUpdated: article.lastUpdated,
          author: article.author || 'KaktusTycoon Team',
          status: 'published' as const
        }));
      }
    },
  });

  const handleDeleteArticle = async (id: string) => {
    try {
      await axios.delete(`/api/admin/articles/${id}`);
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      toast.success('Article deleted successfully');
      setDeleteArticleId(null);
    } catch (error) {
      toast.error('Failed to delete article');
    }
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className={isDarkMode ? "text-dark-300" : "text-gray-600"}>Loading...</div>
      </div>
    );
  }

  // Debugging-Info
  console.log(`Zeige ${articles.length} Artikel in der Admin-Ansicht`);

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className={`text-3xl font-bold ${isDarkMode ? "text-cyto-400" : "text-cyto-600"}`}>Alle Artikel</h1>
        <Link
          to="/admin/articles/new"
          className={`flex items-center px-4 py-2 ${
            isDarkMode 
              ? "bg-cyto-600 text-white hover:bg-cyto-500" 
              : "bg-cyto-500 text-white hover:bg-cyto-600"
          } rounded-lg transition-colors`}
        >
          <Plus className="h-5 w-5 mr-2" />
          Neuer Artikel
        </Link>
      </div>

      {/* Articles Table */}
      <div className={`rounded-xl border ${
        isDarkMode ? "bg-dark-900/70 border-dark-800" : "bg-white border-gray-100"
      }`}>
        <div className={`p-6 border-b ${isDarkMode ? "border-dark-800" : "border-gray-200"}`}>
          <h2 className={`text-xl font-semibold ${isDarkMode ? "text-cyto-400" : "text-cyto-600"}`}>Artikel</h2>
        </div>
        <div className="overflow-x-auto">
          {articles.length === 0 ? (
            <div className={`p-6 text-center ${isDarkMode ? "text-dark-300" : "text-gray-500"}`}>
              Keine Artikel gefunden. Erstelle deinen ersten Artikel!
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className={isDarkMode ? "border-b border-dark-800 bg-dark-800/50" : "border-b border-gray-200 bg-gray-50"}>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? "text-dark-400" : "text-gray-500"} uppercase tracking-wider`}>Titel</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? "text-dark-400" : "text-gray-500"} uppercase tracking-wider`}>Autor</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? "text-dark-400" : "text-gray-500"} uppercase tracking-wider`}>Kategorie</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? "text-dark-400" : "text-gray-500"} uppercase tracking-wider`}>Letzte Änderung</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? "text-dark-400" : "text-gray-500"} uppercase tracking-wider`}>Status</th>
                  <th className={`px-6 py-3 text-right text-xs font-medium ${isDarkMode ? "text-dark-400" : "text-gray-500"} uppercase tracking-wider`}>Aktionen</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? "divide-dark-800" : "divide-gray-200"}`}>
                {articles.map((article) => (
                  <tr key={article.id} className={`transition-colors ${isDarkMode ? "hover:bg-dark-800/50" : "hover:bg-gray-50"}`}>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? "text-white" : "text-gray-900"}`}>{article.title}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? "text-dark-300" : "text-gray-500"}`}>{article.author}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? "text-dark-300" : "text-gray-500"}`}>{article.category}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? "text-dark-300" : "text-gray-500"}`}>{article.lastUpdated}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        article.status === "published" 
                          ? isDarkMode ? "bg-green-800/20 text-green-400" : "bg-green-100 text-green-800"
                          : isDarkMode ? "bg-amber-800/20 text-amber-400" : "bg-amber-100 text-amber-800"
                      }`}>
                        {article.status === "published" ? "Veröffentlicht" : "Entwurf"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link 
                          to={`/admin/articles/${article.id}`} 
                          className={`p-1 rounded-md ${isDarkMode ? "text-dark-300 hover:text-white hover:bg-dark-800" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button 
                          onClick={() => setDeleteArticleId(article.id)} 
                          className={`p-1 rounded-md ${isDarkMode ? "text-dark-300 hover:text-white hover:bg-red-900/20" : "text-gray-500 hover:text-gray-700 hover:bg-red-100"}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteArticleId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`rounded-xl p-6 max-w-md w-full ${isDarkMode ? "bg-dark-900" : "bg-white"}`}>
            <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Löschen bestätigen</h3>
            <p className={`mb-6 ${isDarkMode ? "text-dark-300" : "text-gray-500"}`}>
              Bist du sicher, dass du diesen Artikel löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteArticleId(null)}
                className={`px-4 py-2 rounded-lg ${
                  isDarkMode 
                    ? "bg-dark-800 text-dark-300 hover:bg-dark-700" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                } transition-colors`}
              >
                Abbrechen
              </button>
              <button
                onClick={() => handleDeleteArticle(deleteArticleId)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
