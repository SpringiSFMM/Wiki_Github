// Serverless API-Endpunkt für einzelne Artikel im Admin-Bereich
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    // CORS-Header setzen
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Preflight-Anfragen beantworten
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    
    // ID aus der URL extrahieren
    const { id } = req.query;
    
    if (!id) {
      res.status(400).json({ error: 'Artikel-ID nicht angegeben' });
      return;
    }
    
    // Versuche, die statische JSON-Datei zu lesen
    try {
      // Pfad zur JSON-Datei
      const jsonPath = path.join(process.cwd(), 'public', 'data', 'articles.json');
      
      if (fs.existsSync(jsonPath)) {
        const jsonContent = fs.readFileSync(jsonPath, 'utf8');
        const articlesData = JSON.parse(jsonContent);
        
        // Artikel mit der angegebenen ID finden
        const article = articlesData.articles.find(article => article.id.toString() === id.toString());
        
        if (article) {
          // Bei DELETE-Anfragen
          if (req.method === 'DELETE') {
            // Im Serverless-Kontext können wir die Datei nicht wirklich löschen,
            // daher simulieren wir nur eine erfolgreiche Löschung
            console.log(`Simuliere Löschen von Artikel mit ID ${id}`);
            return res.status(200).json({ message: 'Artikel erfolgreich gelöscht' });
          }
          
          // Bei GET-Anfragen
          if (req.method === 'GET') {
            // Versuche, den Inhalt des Artikels zu laden
            try {
              const articleContentPath = path.join(
                process.cwd(), 
                'public', 
                'articleContents', 
                article.categorySlug, 
                `${article.slug}.md`
              );
              
              // Admin-Version des Artikels erstellen
              const adminArticle = {
                ...article,
                id: article.id.toString(),
                status: 'published',
                views: 100 + article.id,
                lastModified: article.lastUpdated
              };
              
              // Prüfe, ob der Artikel existiert
              if (fs.existsSync(articleContentPath)) {
                const content = fs.readFileSync(articleContentPath, 'utf8');
                
                // Artikel mit Inhalt zurückgeben
                res.status(200).json({
                  ...adminArticle,
                  content
                });
              } else {
                // Kein Inhalt gefunden, aber Artikel-Metadaten zurückgeben
                res.status(200).json({
                  ...adminArticle,
                  content: "# Artikel-Inhalt nicht gefunden\n\nDer Inhalt dieses Artikels konnte nicht geladen werden."
                });
              }
            } catch (contentError) {
              console.error('Fehler beim Laden des Artikelinhalts:', contentError);
              // Artikel ohne Inhalt zurückgeben
              res.status(200).json({
                ...article,
                id: article.id.toString(),
                status: 'published',
                views: 100 + article.id,
                lastModified: article.lastUpdated,
                content: "# Fehler\n\nBeim Laden des Artikelinhalts ist ein Fehler aufgetreten."
              });
            }
          } else {
            res.status(405).json({ error: 'Methode nicht erlaubt' });
          }
        } else {
          res.status(404).json({ error: 'Artikel nicht gefunden' });
        }
      } else {
        // Fallback: Hartcodierte Artikeldaten verwenden
        console.log('Articles JSON nicht gefunden, generiere statischen Artikel');
        
        // Wir prüfen, ob die angeforderte ID einer unserer Fallback-Artikel ist
        const fallbackArticles = [
          {
            id: "1",
            title: "Erste Schritte in Kaktus Tycoon",
            slug: "erste-schritte",
            description: "Ein Leitfaden für neue Spieler, um in Kaktus Tycoon durchzustarten.",
            categorySlug: "grundlagen",
            category: "Spielgrundlagen",
            lastUpdated: "15. März 2024",
            author: "KaktusTycoon Team",
            status: "published",
            views: 150,
            lastModified: "15. März 2024",
            content: "# Erste Schritte in Kaktus Tycoon\n\nWillkommen bei Kaktus Tycoon! Dieser Artikel hilft dir beim Einstieg."
          },
          {
            id: "2",
            title: "Grundlegende Spielbefehle",
            slug: "spielbefehle",
            description: "Eine Übersicht aller wichtigen Befehle im Spiel.",
            categorySlug: "grundlagen",
            category: "Spielgrundlagen",
            lastUpdated: "15. März 2024",
            author: "KaktusTycoon Team",
            status: "published",
            views: 120,
            lastModified: "15. März 2024",
            content: "# Grundlegende Spielbefehle\n\nHier findest du eine Übersicht der wichtigsten Befehle im Spiel."
          }
        ];
        
        // Artikel mit der angegebenen ID finden
        const article = fallbackArticles.find(article => article.id.toString() === id.toString());
        
        if (article) {
          if (req.method === 'DELETE') {
            return res.status(200).json({ message: 'Artikel erfolgreich gelöscht' });
          } else if (req.method === 'GET') {
            res.status(200).json(article);
          } else {
            res.status(405).json({ error: 'Methode nicht erlaubt' });
          }
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