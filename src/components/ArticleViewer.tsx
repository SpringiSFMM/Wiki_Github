import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { User, Clock, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  lastModified: string;
  relatedArticles?: RelatedArticle[];
}

interface RelatedArticle {
  id: string;
  title: string;
  category: string;
}

interface ArticleViewerProps {
  article: Article;
  isLoading: boolean;
}

export function ArticleViewer({ article, isLoading }: ArticleViewerProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-dark-300">Loading...</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-dark-300 mb-4">Article not found</h2>
        <Link
          to="/wiki"
          className="text-neon-400 hover:text-neon-300 flex items-center"
        >
          <ChevronRight className="h-4 w-4 mr-2" />
          Back to Wiki
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Breadcrumb */}
      <div className="bg-dark-900 border-b border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm text-dark-300">
            <Link to="/wiki" className="hover:text-neon-400">
              Wiki
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link
              to={`/wiki/category/${article.category.toLowerCase()}`}
              className="hover:text-neon-400 capitalize"
            >
              {article.category}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-neon-400 truncate">{article.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1 max-w-4xl mx-auto">
            <article className="bg-dark-900 rounded-xl border border-dark-800 p-8">
              <header className="mb-8">
                <h1 className="text-4xl font-bold text-neon-400 mb-4">
                  {article.title}
                </h1>
                <div className="flex items-center space-x-4 text-dark-300">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    <span>{article.author}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>
                      Last updated: {format(new Date(article.lastModified), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
              </header>

              <div className="prose prose-invert prose-green max-w-none text-white">
                <div 
                  dangerouslySetInnerHTML={{ __html: article.content }} 
                  className="text-white article-content"
                  style={{ 
                    color: 'white',
                    fontSize: '1rem',
                    lineHeight: '1.6'
                  }}
                />
              </div>
            </article>

            {/* Related Articles */}
            {article.relatedArticles && article.relatedArticles.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-neon-400 mb-4">Related Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {article.relatedArticles.map((related) => (
                    <Link
                      key={related.id}
                      to={`/wiki/${related.category.toLowerCase()}/${related.id}`}
                      className="p-4 bg-dark-900 rounded-lg border border-dark-800 hover:border-neon-500/50 transition-colors"
                    >
                      <h3 className="text-neon-400 font-medium mb-1">{related.title}</h3>
                      <p className="text-sm text-dark-300 capitalize">{related.category}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
