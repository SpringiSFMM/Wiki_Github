// Diagnose-API-Route zum Testen der Artikel-Verfügbarkeit
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  // CORS-Header setzen
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Verzeichnispfade, die wir überprüfen wollen
  const paths = [
    // Public-Verzeichnis (sollte kopierte Artikel enthalten)
    path.join(process.cwd(), 'public'),
    path.join(process.cwd(), 'public', 'articleContents'),
    
    // Quellverzeichnis
    path.join(process.cwd(), 'src'),
    path.join(process.cwd(), 'src', 'data'),
    path.join(process.cwd(), 'src', 'data', 'articleContents')
  ];
  
  // Ergebnisse sammeln
  const results = {};
  
  // Prüfen, ob Verzeichnisse existieren und Dateien auflisten
  for (const dirPath of paths) {
    try {
      const exists = fs.existsSync(dirPath);
      
      if (exists && fs.statSync(dirPath).isDirectory()) {
        const files = fs.readdirSync(dirPath);
        results[dirPath] = {
          exists: true,
          isDirectory: true,
          files: files.slice(0, 20) // Begrenzen auf 20 Dateien
        };
      } else {
        results[dirPath] = {
          exists,
          isDirectory: exists ? fs.statSync(dirPath).isDirectory() : false,
          files: []
        };
      }
    } catch (error) {
      results[dirPath] = {
        exists: false,
        error: error.message
      };
    }
  }
  
  // Umgebungsvariablen senden (für Debugging)
  const environment = {
    VERCEL_URL: process.env.VERCEL_URL,
    NODE_ENV: process.env.NODE_ENV,
    PWD: process.env.PWD,
    cwd: process.cwd(),
    host: req.headers.host
  };
  
  // Ergebnisse senden
  res.status(200).json({
    environment,
    paths: results
  });
} 