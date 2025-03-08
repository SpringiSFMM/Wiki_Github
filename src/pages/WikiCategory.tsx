import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { categories } from '../data/categories';
import { useTheme } from '../contexts/ThemeContext';
import { ChevronLeft, ChevronRight, Clock, User } from 'lucide-react';
import axios from 'axios';

// Definiere die Artikelstruktur
interface Article {
  id: number;
  title: string;
  slug: string;
  description?: string;
  categorySlug: string;
  category: string;
  lastUpdated?: string;
  author?: string;
  status?: string;
}

export function WikiCategory() {
  const { category: categorySlug } = useParams<{ category: string }>();
  const { isDarkMode } = useTheme();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const category = categories.find((c) => c.slug === categorySlug);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/articles');
        // Filter für die aktuelle Kategorie (erfolgt jetzt auf Clientseite)
        const categoryArticles = response.data.filter((article: Article) => article.categorySlug === categorySlug);
        setArticles(categoryArticles);
        setError(null);
      } catch (err) {
        console.error('Fehler beim Laden der Artikel:', err);
        setError('Die Artikel konnten nicht geladen werden. Bitte versuche es später erneut.');
      } finally {
        setLoading(false);
      }
    };

    if (categorySlug) {
      fetchArticles();
    }
  }, [categorySlug]);

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className={`p-8 rounded-xl ${isDarkMode ? 'bg-dark-900/70 border border-dark-700' : 'bg-white border border-gray-200'}`}>
          <h1 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-dark-100' : 'text-gray-900'}`}>
            Kategorie nicht gefunden
          </h1>
          <p className={`mb-6 ${isDarkMode ? 'text-dark-300' : 'text-gray-600'}`}>
            Die gesuchte Kategorie existiert leider nicht.
          </p>
          <Link
            to="/wiki"
            className={`inline-flex items-center text-cyto-400 hover:text-cyto-300 transition-colors duration-300`}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Zurück zur Wiki-Übersicht
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className={`rounded-xl ${isDarkMode ? 'bg-dark-900/70 border border-dark-700' : 'bg-white border border-gray-200'}`}>
        {/* Header */}
        <div className={`px-8 py-6 border-b ${isDarkMode ? 'border-dark-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Link
                  to="/wiki"
                  className={`text-${isDarkMode ? 'dark-300' : 'gray-600'} hover:text-cyto-400 transition-colors duration-300 text-sm`}
                >
                  Wiki
                </Link>
                <span className={`text-${isDarkMode ? 'dark-500' : 'gray-400'}`}>/</span>
                <span className={`text-${isDarkMode ? 'dark-200' : 'gray-900'} text-sm`}>
                  {category.name}
                </span>
              </div>
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-dark-100' : 'text-gray-900'}`}>
                <span className="mr-3">{category.icon}</span>
                {category.name}
              </h1>
              <p className={`mt-2 ${isDarkMode ? 'text-dark-300' : 'text-gray-600'}`}>
                {category.description}
              </p>
            </div>
          </div>
        </div>

        {/* Artikel Liste */}
        <div className="p-8">
          {loading ? (
            <div className="text-center py-12">
              <svg className="animate-spin h-8 w-8 mx-auto text-cyto-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className={`mt-4 ${isDarkMode ? 'text-dark-300' : 'text-gray-600'}`}>
                Artikel werden geladen...
              </p>
            </div>
          ) : error ? (
            <div className={`text-center py-12 ${isDarkMode ? 'text-red-300' : 'text-red-600'}`}>
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-cyto-500 hover:bg-cyto-600 text-white rounded-md transition-colors"
              >
                Erneut versuchen
              </button>
            </div>
          ) : articles.length === 0 ? (
            <div className={`text-center py-12 ${isDarkMode ? 'text-dark-300' : 'text-gray-600'}`}>
              <p>In dieser Kategorie wurden noch keine Artikel erstellt.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {articles.map((article) => (
                <Link
                  key={article.slug}
                  to={`/wiki/${categorySlug}/${article.slug}`}
                  className={`block p-6 rounded-lg border ${
                    isDarkMode
                      ? 'bg-dark-800/50 border-dark-700 hover:border-dark-600'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  } transition-all duration-300 hover:shadow-lg`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className={`text-xl font-semibold mb-2 ${
                        isDarkMode ? 'text-dark-100' : 'text-gray-900'
                      }`}>
                        {article.title}
                      </h3>
                      <p className={`mb-4 ${isDarkMode ? 'text-dark-300' : 'text-gray-600'}`}>
                        {article.description || 'Keine Beschreibung verfügbar.'}
                      </p>
                      <div className="flex items-center space-x-4">
                        {article.lastUpdated && (
                          <div className={`flex items-center text-sm ${
                            isDarkMode ? 'text-dark-400' : 'text-gray-500'
                          }`}>
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{article.lastUpdated}</span>
                          </div>
                        )}
                        {article.author && (
                          <div className={`flex items-center text-sm ${
                            isDarkMode ? 'text-dark-400' : 'text-gray-500'
                          }`}>
                            <User className="h-4 w-4 mr-1" />
                            <span>{article.author}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <ChevronRight className={`h-5 w-5 ${
                      isDarkMode ? 'text-dark-400' : 'text-gray-400'
                    }`} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Default-Export hinzufügen für lazy loading
export default WikiCategory;