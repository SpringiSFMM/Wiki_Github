import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { pool } from './db.ts';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

// Lade Umgebungsvariablen
dotenv.config();

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const USE_MOCK_DATA = true; // Immer Mock-Daten verwenden für Entwicklung

// Mock-Daten für Entwicklung
const mockData = {
  users: [
    { id: '1', username: 'admin', role: 'admin', email: 'admin@example.com', isMainAdmin: true, createdAt: '2023-01-01 00:00:00', lastLogin: '2023-01-01 00:00:00' },
    { id: '2', username: 'editor', role: 'editor', email: 'editor@example.com', isMainAdmin: false, createdAt: '2023-01-01 00:00:00', lastLogin: '2023-01-01 00:00:00' }
  ],
  settings: {
    maintenanceMode: false,
    maintenanceMessage: ''
  },
  articles: [
    { id: '1', title: 'Erste Schritte', slug: 'erste-schritte', description: 'Einführung in die Wiki', category: 'Grundlagen', categorySlug: 'grundlagen', lastUpdated: '2023-01-01 00:00:00', author: 'admin', views: 150 },
    { id: '2', title: 'Ausrüstung', slug: 'ausruestung', description: 'Alles über Ausrüstungen', category: 'Grundlagen', categorySlug: 'grundlagen', lastUpdated: '2023-01-02 00:00:00', author: 'admin', views: 120 }
  ],
  updates: [
    { id: '1', title: 'Neue Funktionen', content: 'Wir haben neue Funktionen hinzugefügt!', created_at: '2023-01-01 10:00:00', updated_at: '2023-01-01 10:00:00', author: 'admin' },
    { id: '2', title: 'Wartungsarbeiten', content: 'Am 15. Januar gibt es Wartungsarbeiten.', created_at: '2023-01-02 11:00:00', updated_at: '2023-01-02 11:00:00', author: 'admin' }
  ],
  stats: {
    totalArticles: 20,
    totalUsers: 5,
    totalViews: 1500,
    recentActivity: [
      { type: 'article_created', user: 'admin', timestamp: '2023-01-01 10:00:00', details: 'Neuer Artikel: Einführung' },
      { type: 'article_edited', user: 'editor', timestamp: '2023-01-01 11:00:00', details: 'Artikel bearbeitet: Einführung' }
    ]
  }
};

// KRITISCH: Vereinfachte CORS-Konfiguration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Standardeinstellungen
app.use(express.json());

// Middleware für Debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Hilfsfunktion zum Loggen von Systemereignissen
async function logSystemEvent(message: string, type: 'info' | 'warning' | 'error', userId?: string) {
  console.log(`[${type.toUpperCase()}] ${message}${userId ? ` (User: ${userId})` : ''}`);
}

// =====================
// ALLE ENDPUNKTE
// =====================

// Login endpoint
app.post('/api/login', (req, res) => {
  console.log('Login attempt');
  const { username, password } = req.body;
  
  // Für Entwicklung immer erfolgreich
  if (username === 'admin' && password === 'admin') {
    const token = jwt.sign({ id: '1', username: 'admin', role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
    console.log('Login successful');
    return res.json({ token, user: { id: '1', username: 'admin', role: 'admin' } });
  }
  
  return res.status(401).json({ message: 'Ungültige Anmeldedaten' });
});

// Get settings (public endpoint)
app.get('/api/settings', (req, res) => {
  console.log('Fetching settings');
  res.json(mockData.settings);
});

// Get updates (public endpoint)
app.get('/api/updates', (req, res) => {
  console.log('Fetching updates');
  res.json(mockData.updates);
});

// Get update by id (public endpoint)
app.get('/api/updates/:id', (req, res) => {
  const { id } = req.params;
  console.log(`Fetching update with id: ${id}`);
  const update = mockData.updates.find(u => u.id === id);
  if (!update) {
    return res.status(404).json({ message: 'Update nicht gefunden' });
  }
  res.json(update);
});

// Get articles (public endpoint)
app.get('/api/articles', (req, res) => {
  console.log('Fetching articles');
  res.json(mockData.articles);
});

// Get article by slug (public endpoint)
app.get('/api/articles/:slug', (req, res) => {
  const { slug } = req.params;
  console.log(`Fetching article with slug: ${slug}`);
  const article = mockData.articles.find(a => a.slug === slug);
  if (!article) {
    return res.status(404).json({ message: 'Artikel nicht gefunden' });
  }
  res.json(article);
});

// Get admin profile
app.get('/api/admin/profile', (req, res) => {
  console.log('Fetching admin profile');
  res.json({
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin',
    isMainAdmin: true,
    createdAt: '2023-01-01 00:00:00',
    lastLogin: '2023-01-01 00:00:00'
  });
});

// Get all users (admin only)
app.get('/api/admin/users', (req, res) => {
  console.log('Fetching users');
  res.json(mockData.users);
});

// Get admin stats
app.get('/api/admin/stats', (req, res) => {
  console.log('Fetching admin stats');
  res.json(mockData.stats);
});

// Get recent articles (admin)
app.get('/api/admin/articles/recent', (req, res) => {
  console.log('Fetching recent articles');
  res.json(mockData.articles);
});

// Update settings (admin only)
app.put('/api/admin/settings', (req, res) => {
  console.log('Updating settings');
  const { maintenanceMode, maintenanceMessage } = req.body;
  mockData.settings = {
    maintenanceMode: !!maintenanceMode,
    maintenanceMessage: maintenanceMessage || ''
  };
  res.json({ success: true });
});

// Get admin statistics
app.get('/api/admin/statistics', (req, res) => {
  console.log('Fetching admin statistics');
  res.json({
    articlesByCategory: [
      { category: 'Grundlagen', count: 5 },
      { category: 'Mechaniken', count: 8 },
      { category: 'Community', count: 3 },
      { category: 'Regeln', count: 4 }
    ],
    viewsOverTime: [
      { date: '2023-01-01', views: 100 },
      { date: '2023-01-02', views: 150 },
      { date: '2023-01-03', views: 120 },
      { date: '2023-01-04', views: 200 }
    ]
  });
});

// Starte den Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n=== SERVER GESTARTET ===`);
  console.log(`Server läuft auf http://localhost:${PORT}`);
  console.log(`Mock-Daten: Aktiviert`);
  console.log(`======================\n`);
});