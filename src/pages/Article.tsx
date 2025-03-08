import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { articles } from '../data/articles';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { useTheme } from '../contexts/ThemeContext';
import { ChevronLeft, Clock, User } from 'lucide-react';
import axios from 'axios';

interface ArticleData {
  id: string;
  title: string;
  content: string;
  category: string;
  lastModified: string;
  author: string;
  relatedArticles?: RelatedArticle[];
}

interface RelatedArticle {
  id: string;
  title: string;
  category: string;
}

export function Article() {
  const { categorySlug, articleSlug } = useParams<{ categorySlug: string; articleSlug: string }>();
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [articleData, setArticleData] = useState<ArticleData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { isDarkMode } = useTheme();

  // Finde den Artikel in der lokalen Liste
  const localArticle = articles.find(
    (a) => a.categorySlug === categorySlug && a.slug === articleSlug
  );

  useEffect(() => {
    const fetchArticleContent = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (!localArticle) {
          throw new Error('Artikel nicht gefunden');
        }
        
        // Versuche zuerst, den Artikel aus der Markdown-Datei zu laden
        try {
          const markdownResponse = await fetch(`/data/articleContents/${categorySlug}/${articleSlug}.md`);
          
          if (markdownResponse.ok) {
            const markdownContent = await markdownResponse.text();
            setContent(markdownContent);
            return;
          }
        } catch (markdownError) {
          console.error('Fehler beim Laden des Artikels aus der Markdown-Datei:', markdownError);
        }
        
        // Fallback: Versuche, den Artikel aus der Datenbank zu laden
        try {
          // Suche nach dem Artikel in der Datenbank basierend auf dem Titel
          const response = await axios.get(`/api/articles`);
          const allArticles = response.data;
          
          // Finde den Artikel mit dem passenden Titel
          const dbArticle = allArticles.find((a: any) => 
            a.title === localArticle.title && 
            a.category === localArticle.category
          );
          
          if (dbArticle) {
            // Lade den vollständigen Artikel-Inhalt
            const articleResponse = await axios.get(`/api/articles/${dbArticle.id}`);
            setArticleData(articleResponse.data);
            setContent(articleResponse.data.content);
            return;
          }
        } catch (dbError) {
          console.error('Fehler beim Laden des Artikels aus der Datenbank:', dbError);
        }
        
        // Wenn weder Markdown noch Datenbank funktioniert haben, zeige eine Fehlermeldung an
        throw new Error('Artikel konnte nicht geladen werden');
      } catch (error) {
        console.error('Error loading article:', error);
        setError('Der Artikel konnte nicht geladen werden.');
        setContent('# Fehler\nDer Artikel konnte nicht geladen werden.');
      } finally {
        setIsLoading(false);
      }
    };

    if (localArticle) {
      fetchArticleContent();
    }
  }, [localArticle, categorySlug, articleSlug]);

  if (!localArticle) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className={`p-8 rounded-xl ${isDarkMode ? 'bg-dark-900/70 border border-dark-700' : 'bg-white border border-gray-200'}`}>
          <h1 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-dark-100' : 'text-gray-900'}`}>
            Artikel nicht gefunden
          </h1>
          <p className={`mb-6 ${isDarkMode ? 'text-dark-300' : 'text-gray-600'}`}>
            Der gesuchte Artikel existiert leider nicht.
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
      <div className={`rounded-xl ${isDarkMode ? 'bg-dark-900/70 border border-dark-700' : 'bg-white border border-gray-200'} overflow-hidden`}>
        {/* Breadcrumb Navigation */}
        <div className={`px-8 py-4 border-b ${isDarkMode ? 'border-dark-700' : 'border-gray-200'}`}>
          <nav className="flex items-center space-x-2 text-sm">
            <Link
              to="/wiki"
              className={`text-${isDarkMode ? 'dark-300' : 'gray-600'} hover:text-cyto-400 transition-colors duration-300`}
            >
              Wiki
            </Link>
            <span className={`text-${isDarkMode ? 'dark-500' : 'gray-400'}`}>/</span>
            <Link
              to={`/wiki/category/${localArticle.categorySlug}`}
              className={`text-${isDarkMode ? 'dark-300' : 'gray-600'} hover:text-cyto-400 transition-colors duration-300`}
            >
              {localArticle.category}
            </Link>
            <span className={`text-${isDarkMode ? 'dark-500' : 'gray-400'}`}>/</span>
            <span className={`text-${isDarkMode ? 'dark-200' : 'gray-900'}`}>
              {localArticle.title}
            </span>
          </nav>
        </div>

        {/* Artikel-Metadaten */}
        <div className={`px-8 py-4 border-b ${isDarkMode ? 'border-dark-700' : 'border-gray-200'} bg-${isDarkMode ? 'dark-800/50' : 'gray-50'}`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center text-sm ${isDarkMode ? 'text-dark-300' : 'text-gray-600'}`}>
                <Clock className="h-4 w-4 mr-1" />
                <span>Aktualisiert am {articleData?.lastModified || localArticle.lastUpdated}</span>
              </div>
              <div className={`flex items-center text-sm ${isDarkMode ? 'text-dark-300' : 'text-gray-600'}`}>
                <User className="h-4 w-4 mr-1" />
                <span>{articleData?.author || localArticle.author}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Artikel-Inhalt */}
        <div className="p-8">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className={`h-8 bg-${isDarkMode ? 'dark-800' : 'gray-200'} rounded w-3/4`}></div>
              <div className={`h-4 bg-${isDarkMode ? 'dark-800' : 'gray-200'} rounded w-full`}></div>
              <div className={`h-4 bg-${isDarkMode ? 'dark-800' : 'gray-200'} rounded w-5/6`}></div>
              <div className={`h-4 bg-${isDarkMode ? 'dark-800' : 'gray-200'} rounded w-4/6`}></div>
            </div>
          ) : error ? (
            <div className={`p-4 rounded-lg bg-red-100 border border-red-300 text-red-700 ${isDarkMode ? 'bg-red-900/20 border-red-800 text-red-400' : ''}`}>
              <h2 className="text-lg font-semibold mb-2">Fehler</h2>
              <p>{error}</p>
            </div>
          ) : (
            <MarkdownRenderer content={content} />
          )}
        </div>
        
        {/* Verwandte Artikel */}
        {articleData?.relatedArticles && articleData.relatedArticles.length > 0 && (
          <div className={`px-8 py-6 border-t ${isDarkMode ? 'border-dark-700' : 'border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-dark-200' : 'text-gray-800'}`}>
              Verwandte Artikel
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {articleData.relatedArticles.map((related) => {
                // Finde den lokalen Artikel, der dem verwandten Artikel entspricht
                const relatedLocalArticle = articles.find(
                  (a) => a.title === related.title && a.category === related.category
                );
                
                if (!relatedLocalArticle) return null;
                
                return (
                  <Link
                    key={related.id}
                    to={`/wiki/${relatedLocalArticle.categorySlug}/${relatedLocalArticle.slug}`}
                    className={`p-4 rounded-lg ${isDarkMode ? 'bg-dark-800/50 hover:bg-dark-800' : 'bg-gray-50 hover:bg-gray-100'} transition-colors duration-300`}
                  >
                    <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-dark-100' : 'text-gray-900'}`}>
                      {related.title}
                    </h4>
                    <p className={`text-sm ${isDarkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                      {related.category}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 