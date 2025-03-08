// ES-Modul-kompatiblen Express-Server erstellen
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 5000;

// CORS für alle Anfragen erlauben
app.use(cors({
  origin: '*', // Erlaubt Anfragen von jeder Domain
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// JSON-Parser für Request-Body
app.use(express.json());

// Middleware für alle API-Anfragen
app.use('/api/*', (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Auth-Token-Middleware für Admin-Routen überspringen
app.use('/api/admin/*', (req, res, next) => {
  // Im Entwicklungsmodus überspringen wir die Authentifizierung
  console.log('Admin-Anfrage empfangen, überspringe Authentifizierung im Entwicklungsmodus');
  next();
});

// API-Routen

// Öffentliche Endpunkte
app.get('/api/settings', (req, res) => {
  res.json({
    maintenance: false,
    maintenanceMessage: '',
    systemNotice: '',
    version: '1.0.0'
  });
});

app.get('/api/updates', (req, res) => {
  res.json([
    { id: 1, title: 'Neue Artikel', content: 'Wir haben neue Artikel zu Kaktus Tycoon hinzugefügt.', date: '2024-03-15' },
    { id: 2, title: 'Website-Update', content: 'Die Website wurde aktualisiert.', date: '2024-03-14' }
  ]);
});

// Geschützte Admin-Endpunkte
app.get('/api/admin/stats', (req, res) => {
  res.json({
    totalUsers: 1200,
    activeUsers: 850,
    totalArticles: 75,
    totalViews: 45000
  });
});

app.get('/api/admin/articles/recent', (req, res) => {
  res.json([
    { id: 1, title: 'Kaktus Tycoon Grundlagen', author: 'Admin', date: '2024-03-15', views: 230 },
    { id: 2, title: 'Missionen & Belohnungen', author: 'Moderator', date: '2024-03-14', views: 180 }
  ]);
});

app.get('/api/admin/statistics', (req, res) => {
  res.json({
    dailyActiveUsers: [120, 150, 140, 160, 180, 190, 210],
    weeklyActiveUsers: [800, 820, 850, 870, 900],
    monthlyPageViews: [5000, 5200, 5400, 5600, 5800, 6000]
  });
});

// Login-Endpunkt
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  // Demo-Login
  if (username === 'admin' && password === 'password') {
    res.json({
      success: true,
      token: 'demo-token-12345',
      user: {
        id: 1,
        username: 'admin',
        role: 'admin'
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Ungültige Anmeldeinformationen'
    });
  }
});

// Catch-all für nicht implementierte API-Routen
app.all('/api/*', (req, res) => {
  console.log(`Nicht implementierter Endpunkt aufgerufen: ${req.method} ${req.originalUrl}`);
  res.json({ message: 'API-Endpunkt noch nicht implementiert' });
});

// Server starten
app.listen(PORT, () => {
  console.log(`=== EINFACHER SERVER GESTARTET ===`);
  console.log(`Server läuft auf http://localhost:${PORT}`);
  console.log(`CORS ist aktiviert für alle Ursprünge`);
  console.log(`=====================================`);
}); 