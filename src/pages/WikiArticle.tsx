import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ArticleViewer } from '../components/ArticleViewer';

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  lastModified: string;
  relatedArticles: RelatedArticle[];
}

interface RelatedArticle {
  id: string;
  title: string;
  category: string;
}

export function WikiArticle() {
  const { category, article } = useParams();

  // Debugging-Informationen
  useEffect(() => {
    console.log("WikiArticle geladen mit Parametern:", { category, article });
  }, [category, article]);

  // Fetch article data
  const { data: articleData, isLoading, error } = useQuery<Article>({
    queryKey: ['article', category, article],
    queryFn: async () => {
      console.log("Artikel wird geladen:", `/api/articles/${article}`);
      try {
        const response = await axios.get(`/api/articles/${article}`);
        console.log("Artikel geladen:", response.data);
        return response.data;
      } catch (err) {
        console.error("Fehler beim Laden des Artikels:", err);
        throw err;
      }
    },
  });

  // If there's an error or the article data is not available, ArticleViewer will handle it
  return <ArticleViewer article={articleData as Article} isLoading={isLoading} />;
}