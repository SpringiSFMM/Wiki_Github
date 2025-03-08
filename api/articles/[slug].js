// Serverless API-Route für einzelne Artikel
import fs from 'fs';
import path from 'path';

// Artikel aus der statischen Datei laden
const loadArticles = () => {
  try {
    // In Vercel müssen wir einen relativen Pfad verwenden
    const articlesPath = path.join(process.cwd(), 'src', 'data', 'articles.ts');
    const articlesContent = fs.readFileSync(articlesPath, 'utf8');
    
    // Artikel aus der Datei extrahieren mittels Regex
    const articleMatches = articlesContent.matchAll(/id:\s*(\d+)[^]*?title:\s*['"]([^'"]+)['"][^]*?slug:\s*['"]([^'"]+)['"][^]*?description:\s*['"]([^'"]+)['"][^]*?categorySlug:\s*['"]([^'"]+)['"][^]*?category:\s*['"]([^'"]+)['"][^]*?lastUpdated:\s*['"]([^'"]+)['"][^]*?author:\s*['"]([^'"]+)['"]/g);
    
    const articles = Array.from(articleMatches).map(match => ({
      id: parseInt(match[1]),
      title: match[2],
      slug: match[3],
      description: match[4],
      categorySlug: match[5],
      category: match[6],
      lastUpdated: match[7],
      author: match[8],
      status: 'published'
    }));
    
    return articles;
  } catch (error) {
    console.error('Fehler beim Laden der Artikel:', error);
    return [];
  }
};

// Artikel-Inhalt laden
const loadArticleContent = (categorySlug, articleSlug) => {
  try {
    const contentPath = path.join(process.cwd(), 'src', 'data', 'articleContents', categorySlug, `${articleSlug}.md`);
    
    if (fs.existsSync(contentPath)) {
      return fs.readFileSync(contentPath, 'utf8');
    }
    
    return null;
  } catch (error) {
    console.error('Fehler beim Laden des Artikelinhalts:', error);
    return null;
  }
};

// CORS-Header setzen
const setCorsHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

export default function handler(req, res) {
  // CORS-Header setzen
  setCorsHeaders(res);
  
  // OPTIONS-Anfragen für CORS Preflight bearbeiten
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  const { slug } = req.query;
  
  // Artikel-Metadaten laden
  const allArticles = loadArticles();
  const article = allArticles.find(a => a.slug === slug && a.status === 'published');
  
  if (!article) {
    res.status(404).json({ 
      message: 'Artikel nicht gefunden oder nicht veröffentlicht',
      requestedSlug: slug
    });
    return;
  }
  
  // Artikel-Inhalt laden
  const content = loadArticleContent(article.categorySlug, article.slug);
  
  if (!content) {
    res.status(404).json({ 
      message: 'Artikelinhalt nicht gefunden',
      requestedSlug: slug
    });
    return;
  }
  
  // Vollständigen Artikel zurückgeben
  res.status(200).json({
    ...article,
    content
  });
} 