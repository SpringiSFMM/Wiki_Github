// Serverless API-Endpunkt für Dashboard-Statistiken im Admin-Bereich
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
        
        // Statistiken basierend auf Artikeldaten generieren
        const stats = {
          totalArticles: articlesData.articles.length,
          totalViews: articlesData.articles.reduce((total, article) => total + (100 + article.id), 0),
          activeEditors: 2,
          articlesThisMonth: Math.round(articlesData.articles.length * 0.75) // Annahme: 75% der Artikel wurden diesen Monat bearbeitet
        };
        
        res.status(200).json(stats);
      } else {
        console.log('Articles JSON nicht gefunden, generiere Standard-Statistiken');
        
        // Fallback-Statistiken
        const stats = {
          totalArticles: 10,
          totalViews: 1250,
          activeEditors: 2,
          articlesThisMonth: 7
        };
        
        res.status(200).json(stats);
      }
    } catch (error) {
      console.error('Fehler beim Verarbeiten der Dashboard-Statistiken:', error);
      res.status(500).json({ error: 'Fehler beim Verarbeiten der Dashboard-Statistiken' });
    }
  } catch (error) {
    console.error('Serverinterner Fehler:', error);
    res.status(500).json({ error: 'Serverinterner Fehler' });
  }
} 