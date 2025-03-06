import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ArticleViewer } from '../components/ArticleViewer';

// Testdaten für einen Artikel (wird nur verwendet, wenn kein Artikel übergeben wird)
const defaultArticle = {
  id: 'test-article-1',
  title: 'Test Artikel',
  content: 'Dies ist ein Standard-Testartikel, wenn kein Inhalt übergeben wurde.',
  category: 'test-category',
  author: 'Test Autor',
  lastModified: new Date().toISOString(),
  relatedArticles: [
    {
      id: 'test-article-2',
      title: 'Verwandter Artikel 1',
      category: 'test-category'
    },
    {
      id: 'test-article-3',
      title: 'Verwandter Artikel 2',
      category: 'test-category'
    }
  ]
};

export function TestArticle() {
  const location = useLocation();
  const [article, setArticle] = useState(defaultArticle);
  
  // Überprüfe, ob ein Artikel über state übergeben wurde
  useEffect(() => {
    console.log("Location state:", location.state);
    
    if (location.state && location.state.article) {
      const receivedArticle = location.state.article;
      console.log("Artikel aus state geladen:", receivedArticle);
      
      // Behalte den ursprünglichen HTML-Inhalt bei
      const content = receivedArticle.content || 'Kein Inhalt vorhanden.';
      
      // Erstelle ein neues Artikel-Objekt mit den empfangenen Daten
      const newArticle = {
        id: receivedArticle.id || defaultArticle.id,
        title: receivedArticle.title || 'Unbenannter Artikel',
        content: content,
        category: receivedArticle.category || defaultArticle.category,
        author: receivedArticle.author || defaultArticle.author,
        lastModified: receivedArticle.lastModified || defaultArticle.lastModified,
        relatedArticles: receivedArticle.relatedArticles || defaultArticle.relatedArticles
      };
      
      setArticle(newArticle);
    }
  }, [location.state]);

  return <ArticleViewer article={article} isLoading={false} />;
}
