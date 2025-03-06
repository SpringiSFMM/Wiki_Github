import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Sprout, Book, Shield, Crown, Users, Coins, Settings, Trophy, Search, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface Article {
  id: string;
  title: string;
  category: string;
  status: 'published';
  lastModified: string;
  excerpt?: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
}

const getCategoryIcon = (categoryName: string) => {
  const icons: { [key: string]: React.ReactNode } = {
    'getting-started': <Book className="h-6 w-6" />,
    'farming': <Sprout className="h-6 w-6" />,
    'economy': <Coins className="h-6 w-6" />,
    'automation': <Settings className="h-6 w-6" />,
    'ranks': <Crown className="h-6 w-6" />,
    'competitions': <Trophy className="h-6 w-6" />,
    'community': <Users className="h-6 w-6" />,
    'rules': <Shield className="h-6 w-6" />,
  };

  return icons[categoryName.toLowerCase()] || <Book className="h-6 w-6" />;
};

export function Wiki() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isFocused, setIsFocused] = React.useState(false);

  // Fetch categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get('/api/categories');
      return response.data;
    },
  });

  // Fetch articles with error handling
  const { data: articles, isError, error } = useQuery<Article[]>({
    queryKey: ['articles'],
    queryFn: async () => {
      try {
        const response = await axios.get('/api/articles');
        return Array.isArray(response.data) ? response.data : [];
      } catch (err) {
        console.error('Error fetching articles:', err);
        return [];
      }
    },
    initialData: [],
  });

  // Filter articles based on search query
  const filteredArticles = React.useMemo(() => {
    if (!Array.isArray(articles)) return [];
    return articles.filter(article => 
      article?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article?.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [articles, searchQuery]);

  // Group articles by category
  const articlesByCategory = React.useMemo(() => {
    const grouped: Record<string, Article[]> = {};
    if (Array.isArray(articles)) {
      articles.forEach(article => {
        if (!grouped[article.category]) {
          grouped[article.category] = [];
        }
        grouped[article.category].push(article);
      });
    }
    return grouped;
  }, [articles]);

  if (isError) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-dark-300">Error loading articles. Please try again later.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Hero Section with Search */}
      <div className="relative bg-dark-900 border-b border-dark-800">
        <div className="absolute inset-0 bg-gradient-to-b from-neon-500/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-neon-400 mb-4">
              Cactus Tycoon Wiki
            </h1>
            <p className="text-xl text-dark-200 max-w-2xl mx-auto mb-6">
              Your comprehensive guide to mastering Cactus Tycoon. Find detailed information,
              strategies, and tips to become the ultimate cactus farmer.
            </p>
            
            {/* Enhanced Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className={`relative group transition-all duration-300 ${
                isFocused ? 'ring-2 ring-neon-500 ring-opacity-50' : ''
              }`}>
                <div className="absolute inset-0 bg-dark-800 rounded-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="absolute inset-0 bg-gradient-to-r from-neon-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                <div className="relative flex items-center">
                  <Search className={`absolute left-4 h-5 w-5 transition-colors duration-200 ${
                    isFocused ? 'text-neon-400' : 'text-dark-400'
                  }`} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Search articles..."
                    className="w-full pl-12 pr-4 py-4 bg-transparent text-dark-100 rounded-xl border border-dark-700/50 focus:outline-none placeholder-dark-400 transition-colors"
                  />
                </div>
              </div>
              {searchQuery && (
                <p className="mt-3 text-sm text-dark-400">
                  Press Enter to search or start typing to see results
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {searchQuery ? (
          // Search Results
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-neon-400 mb-6">
              Search Results
            </h2>
            {filteredArticles.length > 0 ? (
              <div className="grid gap-6">
                {filteredArticles.map((article) => (
                  <Link
                    key={article.id}
                    to={`/wiki/${article.category.toLowerCase()}/${article.id}`}
                    className="bg-dark-900 rounded-lg p-6 border border-dark-800 hover:border-neon-500/50 transition-colors"
                  >
                    <h3 className="text-xl font-semibold text-neon-400 mb-2">
                      {article.title}
                    </h3>
                    <div className="flex items-center text-dark-300 text-sm">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>
                        Updated {format(new Date(article.lastModified), 'MMM d, yyyy')}
                      </span>
                      <span className="mx-2">•</span>
                      <span className="capitalize">{article.category}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-dark-300">No articles found matching your search.</p>
              </div>
            )}
          </div>
        ) : (
          // Categories Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div key={category.id} className="bg-dark-900 rounded-xl p-6 border border-dark-800">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-neon-500/10 rounded-lg mr-4">
                    <div className="text-neon-400">
                      {getCategoryIcon(category.name)}
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold text-neon-400">{category.name}</h2>
                </div>
                <p className="text-dark-300 mb-4">{category.description}</p>
                <div className="space-y-2">
                  {articlesByCategory[category.name]?.slice(0, 3).map((article) => {
                    // Erstelle ein vollständiges Artikel-Objekt mit allen erforderlichen Eigenschaften
                    const fullArticle = {
                      id: article.id,
                      title: article.title,
                      // Behalte den ursprünglichen HTML-Inhalt bei
                      content: article.excerpt || "Kein Inhalt verfügbar",
                      category: article.category,
                      author: "Unbekannt", // Wir haben keine Autor-Information in der Liste
                      lastModified: article.lastModified,
                      relatedArticles: [] // Wir haben keine verwandten Artikel in der Liste
                    };
                    
                    return (
                      <Link
                        key={article.id}
                        to={`/test-article`}
                        state={{ article: fullArticle }}
                        className="block p-2 rounded hover:bg-dark-800 text-dark-200 hover:text-neon-400 transition-colors cursor-pointer flex items-center"
                        onClick={(e) => {
                          // Für Debugging-Zwecke
                          console.log("Artikel geklickt:", fullArticle);
                          console.log("Link:", `/wiki/${category.name.toLowerCase()}/${article.id}`);
                        }}
                      >
                        <span className="mr-2">•</span>
                        <span>{article.title}</span>
                      </Link>
                    );
                  })}
                  {articlesByCategory[category.name]?.length > 3 && (
                    <Link
                      to={`/wiki/category/${category.name.toLowerCase()}`}
                      className="block text-neon-400 hover:text-neon-300 text-sm font-medium mt-2 p-2 hover:bg-dark-800 rounded transition-colors cursor-pointer"
                    >
                      View all articles →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Links */}
        <div className="mt-12 bg-dark-900 rounded-xl border border-dark-800 p-8">
          <h2 className="text-2xl font-bold text-neon-400 mb-6">Popular Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Jede Karte ist jetzt ein Link und vollständig klickbar */}
            <Link
              to="/test-article"
              className="block p-4 rounded-lg bg-dark-800 hover:bg-dark-700 transition-colors group cursor-pointer"
            >
              <h3 className="text-neon-400 font-semibold mb-2 group-hover:text-neon-300">
                New Player Guide
              </h3>
              <p className="text-dark-300">Everything you need to know to get started</p>
            </Link>
            <Link
              to="/test-article"
              className="block p-4 rounded-lg bg-dark-800 hover:bg-dark-700 transition-colors group cursor-pointer"
            >
              <h3 className="text-neon-400 font-semibold mb-2 group-hover:text-neon-300">
                Farm Optimization
              </h3>
              <p className="text-dark-300">Tips and tricks for maximum efficiency</p>
            </Link>
            <Link
              to="/test-article"
              className="block p-4 rounded-lg bg-dark-800 hover:bg-dark-700 transition-colors group cursor-pointer"
            >
              <h3 className="text-neon-400 font-semibold mb-2 group-hover:text-neon-300">
                Automation Basics
              </h3>
              <p className="text-dark-300">Learn how to automate your farms</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}