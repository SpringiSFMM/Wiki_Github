import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ChevronRight, Clock, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

interface Article {
  id: string;
  title: string;
  category: string;
  lastModified: string;
  excerpt?: string;
}

export function WikiCategory() {
  const { category } = useParams();

  // Fetch articles for the category
  const { data: articles, isLoading, isError } = useQuery<Article[]>({
    queryKey: ['categoryArticles', category],
    queryFn: async () => {
      const response = await axios.get(`/api/articles/category/${category}`);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-dark-300">Loading articles...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-dark-300 mb-4">Failed to load articles</h2>
        <Link
          to="/wiki"
          className="text-neon-400 hover:text-neon-300 flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Wiki
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-950">
      {/* Breadcrumb */}
      <div className="bg-gray-50 dark:bg-dark-900 border-b border-gray-200 dark:border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm text-dark-300">
            <Link to="/wiki" className="hover:text-neon-400">
              Wiki
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-neon-400 capitalize">{category}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-cyto-600 dark:text-neon-400 mb-4 capitalize">
            {category} Artikel
          </h1>
          <p className="text-gray-600 dark:text-dark-200">
            Durchsuche alle Artikel in der Kategorie {category}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles?.map((article) => (
            <Link
              key={article.id}
              to={`/wiki/${article.category.toLowerCase()}/${article.id}`}
              className="bg-white dark:bg-dark-900 rounded-xl p-6 border border-gray-200 dark:border-dark-800 hover:border-cyto-500/50 dark:hover:border-neon-500/50 transition-colors"
            >
              <h2 className="text-xl font-semibold text-neon-400 mb-2">
                {article.title}
              </h2>
              {article.excerpt && (
                <div 
                  className="text-dark-300 mb-4"
                  dangerouslySetInnerHTML={{ 
                    __html: article.excerpt 
                  }}
                />
              )}
              <div className="flex items-center text-dark-400 text-sm">
                <Clock className="h-4 w-4 mr-2" />
                <span>
                  Updated {format(new Date(article.lastModified), 'MMM d, yyyy')}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {articles?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-dark-300">No articles found in this category.</p>
            <Link
              to="/wiki"
              className="text-neon-400 hover:text-neon-300 inline-flex items-center mt-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Wiki
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}