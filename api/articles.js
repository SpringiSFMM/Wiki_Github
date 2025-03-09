// Serverless API-Endpunkt für Artikel
// Dieser Endpunkt gibt alle Artikel zurück
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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
      // Pfad zur JSON-Datei (relative zum api-Verzeichnis)
      const jsonPath = path.join(process.cwd(), 'public', 'data', 'articles.json');
      
      if (fs.existsSync(jsonPath)) {
        const jsonContent = fs.readFileSync(jsonPath, 'utf8');
        const articlesData = JSON.parse(jsonContent);
        
        res.status(200).json(articlesData.articles);
      } else {
        // Fallback: Direkt aus Quellmodul artikelArray importieren (falls verfügbar)
        console.log('Artikel-JSON nicht gefunden, generiere Artikel aus dem Artikel-Skript');
        
        // Hartcodierte Artikelliste aus src/data/articles.ts
        const articles = [
          {
            id: 1,
            title: 'Erste Schritte in Kaktus Tycoon',
            slug: 'erste-schritte',
            description: 'Ein Leitfaden für neue Spieler, um in Kaktus Tycoon durchzustarten.',
            categorySlug: 'grundlagen',
            category: 'Spielgrundlagen',
            lastUpdated: '15. März 2024',
            author: 'KaktusTycoon Team'
          },
          {
            id: 2,
            title: 'Grundlegende Spielbefehle',
            slug: 'spielbefehle',
            description: 'Eine Übersicht aller wichtigen Befehle im Spiel.',
            categorySlug: 'grundlagen',
            category: 'Spielgrundlagen',
            lastUpdated: '15. März 2024',
            author: 'KaktusTycoon Team'
          },
          {
            id: 13,
            title: 'Das Spielsystem von Kaktus Tycoon',
            slug: 'spielsystem',
            description: 'Detaillierte Erklärung des Spielsystems und der Progression.',
            categorySlug: 'grundlagen',
            category: 'Spielgrundlagen',
            lastUpdated: '16. März 2024',
            author: 'KaktusTycoon Team'
          },
          {
            id: 14,
            title: 'Ausrüstung & Verbesserungen',
            slug: 'ausruestung',
            description: 'Alles über Ausrüstungsgegenstände und wie du sie verbesserst.',
            categorySlug: 'grundlagen',
            category: 'Spielgrundlagen',
            lastUpdated: '16. März 2024',
            author: 'KaktusTycoon Team'
          }
        ];
        
        res.status(200).json(articles);
      }
    } catch (error) {
      console.error('Fehler beim Verarbeiten der Artikel:', error);
      res.status(500).json({ error: 'Fehler beim Verarbeiten der Artikel' });
    }
  } catch (error) {
    console.error('Serverinterner Fehler:', error);
    res.status(500).json({ error: 'Serverinterner Fehler' });
  }
} 