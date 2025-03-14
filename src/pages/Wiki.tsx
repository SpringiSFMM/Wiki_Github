import React, { useState, useEffect } from 'react';
import { Search, BookOpen, ChevronRight, Tag, Clock, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { categories } from '../data/categories';
import axios from 'axios';
import { articles as staticArticles } from '../data/articles';

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

export function Wiki() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  // Lade Artikel über die API (nur veröffentlichte)
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        console.log('Versuche Artikel von API zu laden...');
        const response = await axios.get('/api/articles');
        
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          console.log(`${response.data.length} Artikel von API geladen`);
          setArticles(response.data);
          setError(null);
        } else {
          // Wenn keine Artikel zurückgegeben werden, verwende die statischen Artikel
          console.log('Keine Artikel von API erhalten, verwende statische Artikel...');
          setArticles(staticArticles);
          setError(null);
        }
      } catch (err) {
        console.error('Fehler beim Laden der Artikel von API:', err);
        console.log('Verwende statische Artikel als Fallback...');
        setArticles(staticArticles);
        
        // Nur einen Fehler anzeigen, wenn auch die Fallback-Artikel leer sind
        if (!staticArticles || staticArticles.length === 0) {
          setError('Die Artikel konnten nicht geladen werden. Bitte versuche es später erneut.');
        } else {
          setError(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Filtere Artikel basierend auf der Suche und Kategorie
  const filteredArticles = Array.isArray(articles) 
    ? articles.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              (article.description && article.description.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = selectedCategory ? article.category === selectedCategory : true;
        return matchesSearch && matchesCategory;
      })
    : [];

  return (
    <div className="max-w-7xl mx-auto p-4 py-6">
      {/* Hero-Bereich mit Suchfeld */}
      <div className="relative overflow-hidden rounded-2xl mb-12">
        <div className="absolute inset-0 bg-gradient-to-br from-cyto-600/30 via-cyto-500/20 to-dark-900/90 transition-all duration-300"></div>
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"></div>
        
        <div className="relative z-10 py-12 px-6 md:px-10 text-center">
          <h1 className={`text-3xl md:text-4xl font-bold ${isDarkMode ? 'text-cyto-400' : 'text-cyto-600'} mb-4 transition-all duration-300`}>Community-Wiki für Kaktus Tycoon</h1>
          <p className={`max-w-2xl mx-auto mb-8 transition-all duration-300 ${isDarkMode ? 'text-dark-200' : 'text-gray-600'}`}>
            Entdecke alles über die Spielwelt, Mechaniken, Regeln und mehr in diesem von der Community erstellten Wiki.
          </p>
          
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className={`h-5 w-5 ${isDarkMode ? 'text-dark-400' : 'text-gray-400'} transition-colors duration-300`} />
            </div>
            <input
              type="text"
              className={`block w-full pl-10 pr-4 py-3 ${isDarkMode ? 'bg-dark-800/80' : 'bg-white'} backdrop-blur-sm border ${isDarkMode ? 'border-dark-700/50' : 'border-gray-200/50'} rounded-xl ${isDarkMode ? 'text-dark-200' : 'text-gray-600'} placeholder-${isDarkMode ? 'dark-400' : 'gray-400'} focus:outline-none focus:ring-2 focus:ring-cyto-500/50 focus:border-transparent transition-all duration-300`}
              placeholder="Suche im Wiki..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className={`mt-4 text-${isDarkMode ? 'dark-400' : 'gray-400'} text-xs max-w-2xl mx-auto p-2 ${isDarkMode ? 'bg-dark-900/70' : 'bg-white'} rounded-lg border ${isDarkMode ? 'border-dark-800/30' : 'border-gray-200/30'} backdrop-blur-sm transition-all duration-300`}>
            <p>Dieses Wiki wurde von einem Communitymitglied erstellt und wird von diesem betrieben. 
            Es handelt sich um keine offizielle Seite von Kaktus Tycoon. Es findet keine Kooperation mit Kaktus Tycoon statt. 
            Kaktus Tycoon haftet nicht und ist für diese Seite nicht verantwortlich.</p>
          </div>
        </div>
      </div>

      {/* Hauptinhalt */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar mit Kategorien */}
        <div className="lg:col-span-4">
          {/* Kategorien */}
          <section className="mb-10 sticky top-20">
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-cyto-400' : 'text-cyto-600'} mb-6`}>
              Kategorien
            </h2>
            <div className={`flex flex-col space-y-2 ${isDarkMode ? 'bg-dark-900/50' : 'bg-white'} p-3 rounded-xl border ${isDarkMode ? 'border-dark-700' : 'border-gray-200'} backdrop-blur-sm`}>
              {categories.map((category) => {
                // Zähle Artikel pro Kategorie
                const categoryArticleCount = Array.isArray(articles) 
                  ? articles.filter(a => a.categorySlug === category.slug).length
                  : 0;
                
                return (
                  <button 
                    key={category.slug}
                    onClick={() => {
                      setSelectedCategory(category.name);
                      navigate(`/wiki/${category.slug}`);
                    }}
                    className={`group relative flex items-center px-4 py-3.5 rounded-lg border transition-all duration-300
                      ${isDarkMode 
                        ? 'bg-dark-800 hover:bg-dark-750 border-dark-700 hover:border-cyto-600/50 text-dark-200' 
                        : 'bg-gray-50 hover:bg-white border-gray-200 hover:border-cyto-600/50 text-gray-700'}
                      ${selectedCategory === category.name 
                        ? (isDarkMode ? 'border-cyto-600 !bg-cyto-600/10' : 'border-cyto-600 !bg-cyto-600/5')
                        : 'hover:shadow-lg hover:-translate-y-0.5'}`}
                  >
                    <div className="flex items-center w-full">
                      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-2xl">{category.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-medium text-base truncate transition-colors duration-300
                          ${isDarkMode 
                            ? 'text-dark-100 group-hover:text-white' 
                            : 'text-gray-700 group-hover:text-black'}
                          ${selectedCategory === category.name 
                            ? (isDarkMode ? '!text-cyto-400' : '!text-cyto-600')
                            : ''}`}>
                          {category.name}
                        </h3>
                        <p className={`text-sm transition-colors duration-300
                          ${isDarkMode ? 'text-dark-400' : 'text-gray-500'}
                          ${selectedCategory === category.name 
                            ? (isDarkMode ? '!text-cyto-400/70' : '!text-cyto-600/70')
                            : ''}`}>
                          {categoryArticleCount} Artikel
                        </p>
                      </div>
                      <ChevronRight className={`h-5 w-5 flex-shrink-0 ml-4 transition-all duration-300
                        ${isDarkMode 
                          ? 'text-dark-400 group-hover:text-white' 
                          : 'text-gray-400 group-hover:text-black'}
                        ${selectedCategory === category.name 
                          ? 'opacity-100 !text-cyto-400' 
                          : 'opacity-0 group-hover:opacity-100'} 
                        transform translate-x-2 group-hover:translate-x-0`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* Artikelliste */}
        <div className="lg:col-span-8">
          <div className={`rounded-xl border p-6 shadow-md transition-all duration-300
            ${isDarkMode 
              ? 'bg-dark-800 border-dark-700' 
              : 'bg-white border-gray-200'}`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-xl font-semibold transition-colors duration-300
                ${isDarkMode ? 'text-dark-100' : 'text-gray-900'}`}>
                {selectedCategory ? selectedCategory : 'Alle Artikel'}
              </h2>
              <div className={`text-sm transition-colors duration-300
                ${isDarkMode ? 'text-dark-400' : 'text-gray-500'}`}>
                {filteredArticles.length} {filteredArticles.length === 1 ? 'Artikel' : 'Artikel'} gefunden
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className={`animate-pulse p-6 rounded-xl border transition-all duration-300
                    ${isDarkMode 
                      ? 'bg-dark-800/50 border-dark-700/50' 
                      : 'bg-gray-50/50 border-gray-200/50'}`}>
                    <div className={`h-6 rounded w-3/4 mb-3 ${isDarkMode ? 'bg-dark-700/50' : 'bg-gray-200/50'}`}></div>
                    <div className={`h-4 rounded w-1/4 mb-2 ${isDarkMode ? 'bg-dark-700/50' : 'bg-gray-200/50'}`}></div>
                    <div className={`h-4 rounded w-full ${isDarkMode ? 'bg-dark-700/50' : 'bg-gray-200/50'}`}></div>
                    <div className={`h-4 rounded w-5/6 mt-1 ${isDarkMode ? 'bg-dark-700/50' : 'bg-gray-200/50'}`}></div>
                  </div>
                ))}
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
            ) : filteredArticles.length > 0 ? (
              <div className="space-y-4">
                {filteredArticles.map((article) => (
                  <Link
                    key={article.id}
                    to={`/wiki/${article.categorySlug}/${article.slug}`}
                    className={`group block p-5 rounded-xl border transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md transform hover:-translate-y-0.5
                      ${isDarkMode 
                        ? 'bg-dark-850/50 border-dark-700/50 hover:bg-dark-800/80 hover:border-cyto-600/30' 
                        : 'bg-white border-gray-200/50 hover:bg-gray-50/80 hover:border-cyto-600/30'}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`text-lg font-medium transition-colors duration-300
                        ${isDarkMode 
                          ? 'text-dark-100 group-hover:text-white' 
                          : 'text-gray-700 group-hover:text-black'}`}>
                        {article.title}
                      </h3>
                      <div className="flex items-center">
                        <span className={`text-xs px-2 py-0.5 rounded-full flex items-center transition-colors duration-300
                          ${isDarkMode 
                            ? 'text-dark-400 bg-dark-800/80 group-hover:bg-cyto-600/10' 
                            : 'text-gray-500 bg-gray-100/80 group-hover:bg-cyto-600/10'}`}>
                          <Tag className={`h-3 w-3 mr-1 transition-colors duration-300
                            ${isDarkMode 
                              ? 'text-dark-400 group-hover:text-white' 
                              : 'text-gray-400 group-hover:text-black'}`} />
                          {article.category}
                        </span>
                      </div>
                    </div>
                    
                    <p className={`text-sm mb-3 line-clamp-2 transition-colors duration-300
                      ${isDarkMode ? 'text-dark-300' : 'text-gray-600'}`}>
                      {article.description || 'Keine Beschreibung verfügbar.'}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {article.lastUpdated && (
                          <div className={`flex items-center text-xs transition-colors duration-300
                            ${isDarkMode ? 'text-dark-400' : 'text-gray-500'}`}>
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{article.lastUpdated}</span>
                          </div>
                        )}
                        {article.author && (
                          <div className={`flex items-center text-xs transition-colors duration-300
                            ${isDarkMode ? 'text-dark-400' : 'text-gray-500'}`}>
                            <User className="h-3 w-3 mr-1" />
                            <span>{article.author}</span>
                          </div>
                        )}
                      </div>
                      <ChevronRight className={`h-4 w-4 transition-colors duration-300
                        ${isDarkMode 
                          ? 'text-dark-400 group-hover:text-white' 
                          : 'text-gray-400 group-hover:text-black'}`} />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className={`text-center py-12 ${isDarkMode ? 'text-dark-300' : 'text-gray-600'}`}>
                <p>Keine Artikel gefunden.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}