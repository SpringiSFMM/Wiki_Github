// Serverless API-Endpunkt für allgemeine Admin-Statistiken
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
        
        // Kategorien extrahieren und zählen (eindeutige Werte)
        const uniqueCategories = new Set();
        articlesData.articles.forEach(article => {
          uniqueCategories.add(article.category);
        });
        
        // Statistiken generieren
        const statistics = {
          articles: articlesData.articles.length,
          categories: uniqueCategories.size,
          users: 3,
          views: articlesData.articles.reduce((total, article) => total + (120 + article.id), 0)
        };
        
        res.status(200).json(statistics);
      } else {
        console.log('Articles JSON nicht gefunden, generiere Standard-Statistiken');
        
        // Fallback-Statistiken
        const statistics = {
          articles: 12,
          categories: 6,
          users: 3,
          views: 1500
        };
        
        res.status(200).json(statistics);
      }
    } catch (error) {
      console.error('Fehler beim Verarbeiten der Admin-Statistiken:', error);
      res.status(500).json({ error: 'Fehler beim Verarbeiten der Admin-Statistiken' });
    }
  } catch (error) {
    console.error('Serverinterner Fehler:', error);
    res.status(500).json({ error: 'Serverinterner Fehler' });
  }
} 