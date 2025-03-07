import React, { useState, useEffect } from 'react';
import { Search, BookOpen, ChevronRight, Tag, Clock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

// Mock-Daten für Kategorien
const MOCK_CATEGORIES = [
  { id: 1, name: 'Spielmechaniken', articleCount: 15, icon: '🎮', slug: 'spielmechaniken' },
  { id: 2, name: 'Wirtschaft', articleCount: 8, icon: '💰', slug: 'wirtschaft' },
  { id: 3, name: 'Regeln & Richtlinien', articleCount: 5, icon: '📜', slug: 'regeln-richtlinien' },
  { id: 4, name: 'Befehle', articleCount: 12, icon: '⌨️', slug: 'befehle' },
  { id: 5, name: 'Städte & Gebiete', articleCount: 9, icon: '🏙️', slug: 'staedte-gebiete' },
  { id: 6, name: 'Events', articleCount: 6, icon: '🎉', slug: 'events' },
];

// Mock-Daten für Artikel
const MOCK_ARTICLES = [
  { 
    id: 1, 
    title: 'Grundlagen des Wirtschaftssystems', 
    category: 'Wirtschaft', 
    lastUpdated: '2023-10-15', 
    author: 'CytoAdmin', 
    excerpt: 'Eine Einführung in das Wirtschaftssystem von Cytooxien, einschließlich Währung, Handel und Jobs.' 
  },
  { 
    id: 2, 
    title: 'PvP-Zonen und Kampfmechaniken', 
    category: 'Spielmechaniken', 
    lastUpdated: '2023-10-12', 
    author: 'GameMaster', 
    excerpt: 'Alles über die PvP-Mechaniken, Kampfzonen und spezielle Fähigkeiten im Kampf.' 
  },
  { 
    id: 3, 
    title: 'Serverregeln im Überblick', 
    category: 'Regeln & Richtlinien', 
    lastUpdated: '2023-10-10', 
    author: 'ModeratorTim', 
    excerpt: 'Eine vollständige Übersicht aller Serverregeln und Konsequenzen bei Verstößen.' 
  },
  { 
    id: 4, 
    title: 'Nützliche Befehle für Anfänger', 
    category: 'Befehle', 
    lastUpdated: '2023-10-08', 
    author: 'HelperSarah', 
    excerpt: 'Eine Liste der wichtigsten Befehle für neue Spieler auf dem Server.' 
  },
  { 
    id: 5, 
    title: 'Die Hauptstadt: Cytopia', 
    category: 'Städte & Gebiete', 
    lastUpdated: '2023-10-05', 
    author: 'BuilderTeam', 
    excerpt: 'Entdecke die Hauptstadt Cytopia mit allen wichtigen Orten und Funktionen.' 
  },
];

export function Wiki() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState(MOCK_CATEGORIES);
  const [articles, setArticles] = useState(MOCK_ARTICLES);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  // Simuliere das Laden von Daten
  useEffect(() => {
    // In einer echten Anwendung würde hier eine API-Anfrage stehen
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  // Filtere Artikel basierend auf der Suche und Kategorie
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? article.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Hero-Bereich mit Suchfeld */}
      <div className="relative overflow-hidden rounded-2xl mb-12">
        <div className="absolute inset-0 bg-gradient-to-br from-cyto-600/30 via-cyto-500/20 to-dark-900/90 transition-all duration-300"></div>
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"></div>
        
        <div className="relative z-10 py-12 px-6 md:px-10 text-center">
          <h1 className={`text-3xl md:text-4xl font-bold ${isDarkMode ? 'text-cyto-400' : 'text-cyto-600'} mb-4 transition-all duration-300`}>Community-Wiki für Cytooxien</h1>
          <p className={`text-dark-200 max-w-2xl mx-auto mb-8 transition-all duration-300 ${isDarkMode ? 'text-dark-200' : 'text-gray-600'}`}>
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
            Es handelt sich um keine offizielle Seite von Cytooxien. Es findet keine Kooperation mit Cytooxien statt. 
            Cytooxien haftet nicht und ist für diese Seite nicht verantwortlich.</p>
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
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.name);
                    navigate(`/wiki/category/${category.slug}`);
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
                        {category.articleCount} Artikel
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
              ))}
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
            ) : filteredArticles.length > 0 ? (
              <div className="space-y-4">
                {filteredArticles.map((article) => (
                  <div 
                    key={article.id}
                    className={`group p-5 rounded-xl border transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md transform hover:-translate-y-0.5
                      ${isDarkMode 
                        ? 'bg-dark-850/50 border-dark-700/50 hover:bg-dark-800/80 hover:border-cyto-600/30' 
                        : 'bg-white border-gray-200/50 hover:bg-gray-50/80 hover:border-cyto-600/30'}`}
                    onClick={() => navigate(`/wiki/${article.category.toLowerCase()}/${article.id}`)}
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
                      {article.excerpt}
                    </p>
                    
                    <div className={`flex items-center justify-between text-xs transition-colors duration-300
                      ${isDarkMode ? 'text-dark-400' : 'text-gray-500'}`}>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Aktualisiert am {article.lastUpdated}</span>
                      </div>
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        <span>{article.author}</span>
                      </div>
                    </div>
                    
                    <div className={`mt-3 pt-2 flex justify-end opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 border-t
                      ${isDarkMode ? 'border-dark-700/30' : 'border-gray-200/30'}`}>
                      <span className={`text-sm flex items-center
                        ${isDarkMode 
                          ? 'text-cyto-400 group-hover:text-white' 
                          : 'text-cyto-600 group-hover:text-black'}`}>
                        Weiterlesen
                        <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform duration-300" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <BookOpen className={`h-12 w-12 mx-auto mb-4 ${isDarkMode ? 'text-dark-400' : 'text-gray-400'}`} />
                <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-dark-100' : 'text-gray-900'}`}>
                  Keine Artikel gefunden
                </h3>
                <p className={isDarkMode ? 'text-dark-300' : 'text-gray-600'}>
                  Versuche es mit einem anderen Suchbegriff oder wähle eine andere Kategorie.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}