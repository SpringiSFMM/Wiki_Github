// Serverless API-Endpunkt für einzelne Artikel
// Dieser Endpunkt gibt einen Artikel basierend auf dem Slug zurück
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    // CORS-Header setzen
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Preflight-Anfragen beantworten
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    
    // Nur GET-Anfragen zulassen
    if (req.method !== 'GET') {
      res.status(405).json({ error: 'Methode nicht erlaubt' });
      return;
    }
    
    // Slug aus der URL extrahieren
    const { slug } = req.query;
    
    if (!slug) {
      res.status(400).json({ error: 'Artikel-Slug nicht angegeben' });
      return;
    }
    
    // Versuche, die statische JSON-Datei zu lesen
    try {
      // Pfad zur JSON-Datei (relativ zum api-Verzeichnis)
      const jsonPath = path.join(process.cwd(), 'public', 'data', 'articles.json');
      
      if (fs.existsSync(jsonPath)) {
        const jsonContent = fs.readFileSync(jsonPath, 'utf8');
        const articlesData = JSON.parse(jsonContent);
        
        // Artikel mit dem angegebenen Slug finden
        const article = articlesData.articles.find(article => article.slug === slug);
        
        if (article) {
          // Versuche, den Inhalt des Artikels zu laden
          try {
            const articleContentPath = path.join(
              process.cwd(), 
              'public', 
              'articleContents', 
              article.categorySlug, 
              `${article.slug}.md`
            );
            
            // Prüfe, ob der Artikel existiert
            if (fs.existsSync(articleContentPath)) {
              const content = fs.readFileSync(articleContentPath, 'utf8');
              
              // Artikel mit Inhalt zurückgeben
              res.status(200).json({
                ...article,
                content
              });
            } else {
              // Alternative Pfade versuchen
              const alternativePath = path.join(
                process.cwd(), 
                'public', 
                'data', 
                'articleContents', 
                article.categorySlug, 
                `${article.slug}.md`
              );
              
              if (fs.existsSync(alternativePath)) {
                const content = fs.readFileSync(alternativePath, 'utf8');
                
                // Artikel mit Inhalt zurückgeben
                res.status(200).json({
                  ...article,
                  content
                });
              } else {
                // Kein Inhalt gefunden, aber Artikel-Metadaten zurückgeben
                res.status(200).json({
                  ...article,
                  content: "# Artikel-Inhalt nicht gefunden\n\nDer Inhalt dieses Artikels konnte nicht geladen werden."
                });
              }
            }
          } catch (contentError) {
            console.error('Fehler beim Laden des Artikelinhalts:', contentError);
            // Artikel ohne Inhalt zurückgeben
            res.status(200).json({
              ...article,
              content: "# Fehler\n\nBeim Laden des Artikelinhalts ist ein Fehler aufgetreten."
            });
          }
        } else {
          res.status(404).json({ error: 'Artikel nicht gefunden' });
        }
      } else {
        // Fallback: Hartcodierte Artikeldaten verwenden
        const articles = [
          {
            id: 1,
            title: 'Erste Schritte in Kaktus Tycoon',
            slug: 'erste-schritte',
            description: 'Ein Leitfaden für neue Spieler, um in Kaktus Tycoon durchzustarten.',
            categorySlug: 'grundlagen',
            category: 'Spielgrundlagen',
            lastUpdated: '15. März 2024',
            author: 'KaktusTycoon Team',
            content: "# Erste Schritte in Kaktus Tycoon\n\nWillkommen bei Kaktus Tycoon! Dieser Artikel hilft dir beim Einstieg."
          },
          // weitere Artikel...
        ];
        
        // Artikel mit dem angegebenen Slug finden
        const article = articles.find(article => article.slug === slug);
        
        if (article) {
          res.status(200).json(article);
        } else {
          res.status(404).json({ error: 'Artikel nicht gefunden' });
        }
      }
    } catch (error) {
      console.error('Fehler beim Verarbeiten des Artikels:', error);
      res.status(500).json({ error: 'Fehler beim Verarbeiten des Artikels' });
    }
  } catch (error) {
    console.error('Serverinterner Fehler:', error);
    res.status(500).json({ error: 'Serverinterner Fehler' });
  }
} 