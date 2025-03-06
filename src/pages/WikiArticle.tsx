import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

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
    // Wenn der Artikel geladen wurde, aber die Kategorie nicht übereinstimmt, zur richtigen URL weiterleiten
    onSuccess: (data) => {
      if (data && data.category.toLowerCase() !== category?.toLowerCase()) {
        console.log("Kategorie stimmt nicht überein, leite weiter zu:", `/wiki/${data.category.toLowerCase()}/${data.id}`);
        navigate(`/wiki/${data.category.toLowerCase()}/${data.id}`, { replace: true });
      }
    }
  });

  // If there's an error or the article data is not available, ArticleViewer will handle it
  return <ArticleViewer article={articleData as Article} isLoading={isLoading} />;
}