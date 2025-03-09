// Serverless API-Endpunkt für kürzlich bearbeitete Artikel im Admin-Bereich
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
    
    // Versuche, die statische JSON-Datei zu lesen
    try {
      // Pfad zur JSON-Datei
      const jsonPath = path.join(process.cwd(), 'public', 'data', 'articles.json');
      
      if (fs.existsSync(jsonPath)) {
        const jsonContent = fs.readFileSync(jsonPath, 'utf8');
        const articlesData = JSON.parse(jsonContent);
        
        // Artikel für den Admin-Bereich aufbereiten (zusätzliche Felder)
        const adminArticles = articlesData.articles.map(article => ({
          ...article,
          id: article.id.toString(), // Für Kompatibilität mit Admin-UI
          status: 'published',
          views: 100 + article.id,
          lastModified: article.lastUpdated
        }));
        
        // Sortiere nach ID (neueste zuerst) und gib nur die neuesten 5 zurück
        const recentArticles = [...adminArticles]
          .sort((a, b) => parseInt(b.id) - parseInt(a.id))
          .slice(0, 5);
        
        res.status(200).json(recentArticles);
      } else {
        console.log('Articles JSON nicht gefunden, generiere kürzlich bearbeitete Artikel');
        
        // Fallback-Artikel für den Admin-Bereich
        const recentArticles = [
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
            lastModified: "15. März 2024"
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
            lastModified: "15. März 2024"
          }
        ];
        
        res.status(200).json(recentArticles);
      }
    } catch (error) {
      console.error('Fehler beim Verarbeiten der kürzlich bearbeiteten Artikel:', error);
      res.status(500).json({ error: 'Fehler beim Verarbeiten der kürzlich bearbeiteten Artikel' });
    }
  } catch (error) {
    console.error('Serverinterner Fehler:', error);
    res.status(500).json({ error: 'Serverinterner Fehler' });
  }
} 