// Einfacher Express-Server mit ES-Modulen - Ohne Admin-Authentifizierung
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import fs from 'fs/promises';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Projekt-Stammverzeichnis bestimmen
const PROJECT_ROOT = resolve(__dirname, '..');

console.log('Projekt-Stammverzeichnis:', PROJECT_ROOT);

const app = express();
const PORT = 5001; // Anderer Port als 5000

// CORS manuell implementieren, ohne cors-Modul
app.use((req, res, next) => {
  // Explizite CORS-Header für alle Anfragen setzen
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Preflight-Anfragen beantworten
  if (req.method === 'OPTIONS') {
    console.log('Preflight-Anfrage erhalten, beantworte mit 200');
    return res.status(200).end();
  }
  
  next();
});

// JSON-Parser für Request-Body
app.use(express.json());

// Einfacher Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Artikelverzeichnis definieren
const ARTICLES_DIR = join(PROJECT_ROOT, 'src', 'data', 'articleContents');

console.log('Artikelverzeichnis:', ARTICLES_DIR);

// Hilfsfunktion: Rekursives Durchsuchen eines Verzeichnisses nach Markdown-Dateien
async function findMarkdownFiles(dir, categorySlug = '') {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  
  let results = [];
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Wenn es ein Verzeichnis ist, handelt es sich um eine Kategorie
      const subCategorySlug = entry.name;
      const subResults = await findMarkdownFiles(fullPath, subCategorySlug);
      results = [...results, ...subResults];
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      // Wenn es eine Markdown-Datei ist
      const slug = entry.name.replace('.md', '');
      results.push({
        slug,
        categorySlug,
        filePath: fullPath
      });
    }
  }
  
  return results;
}

// Artikelzuordnung laden
let articleMap = [];
let articleIdMap = {};

async function loadArticleMapping() {
  try {
    // Alle Markdown-Dateien finden
    const markdownFiles = await findMarkdownFiles(ARTICLES_DIR);
    
    // Artikel aus der articles.ts-Datei laden
    const articlesFilePath = join(PROJECT_ROOT, 'src', 'data', 'articles.ts');
    console.log('Artikel-Konfigurationsdatei:', articlesFilePath);
    const articlesContent = await fs.readFile(articlesFilePath, 'utf8');
    
    // Artikel-IDs aus der Datei extrahieren
    const articleMatches = articlesContent.matchAll(/id:\s*(\d+)[^]*?title:\s*['"]([^'"]+)['"][^]*?slug:\s*['"]([^'"]+)['"][^]*?categorySlug:\s*['"]([^'"]+)['"][^]*?category:\s*['"]([^'"]+)['"][^]*?lastUpdated:\s*['"]([^'"]+)['"]/g);
    
    const articlesFromFile = Array.from(articleMatches).map(match => ({
      id: parseInt(match[1]),
      title: match[2],
      slug: match[3],
      categorySlug: match[4],
      category: match[5],
      lastUpdated: match[6]
    }));
    
    // Zuordnung erstellen
    let idCounter = 0;
    articleMap = markdownFiles.map(file => {
      // Versuche, diesen Artikel in der articles.ts-Datei zu finden
      const matchingArticle = articlesFromFile.find(a => 
        a.slug === file.slug && a.categorySlug === file.categorySlug
      );
      
      if (matchingArticle) {
        return {
          ...file,
          id: matchingArticle.id,
          title: matchingArticle.title,
          description: "", // Beschreibung fehlt in der Extraktion, könnten wir aber auch parsen
          category: matchingArticle.category,
          lastUpdated: matchingArticle.lastUpdated,
          author: 'KaktusTycoon Team',
          status: 'published',
          views: 100 + matchingArticle.id,
          lastModified: matchingArticle.lastUpdated // Für die Article.tsx-Komponente
        };
      } else {
        // Wenn wir keinen passenden Artikel finden, generieren wir eine neue ID
        const newId = 1000 + idCounter;
        idCounter++;
        return {
          ...file,
          id: newId,
          title: `${file.slug.charAt(0).toUpperCase() + file.slug.slice(1).replace(/-/g, ' ')}`,
          description: `Artikel über ${file.slug.replace(/-/g, ' ')}`,
          category: getCategoryNameBySlug(file.categorySlug),
          lastUpdated: new Date().toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' }),
          author: 'KaktusTycoon Team',
          status: 'published',
          views: 50,
          lastModified: new Date().toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' }) // Für die Article.tsx-Komponente
        };
      }
    });
    
    // Eine Map erstellen für schnelleren Zugriff nach ID
    articleIdMap = {};
    for (const article of articleMap) {
      articleIdMap[article.id] = article;
    }
    
    console.log(`${articleMap.length} Artikel geladen.`);
  } catch (error) {
    console.error('Fehler beim Laden der Artikelzuordnung:', error);
  }
}

// Lade die Artikelzuordnung beim Start
loadArticleMapping();

// API-Routen
// Öffentliche Endpunkte
app.get('/api/settings', (req, res) => {
  console.log('Sende Settings');
  res.json({
    maintenance: false,
    maintenanceMessage: '',
    systemNotice: 'Willkommen im Wiki!',
    version: '1.0.0'
  });
});

app.get('/api/updates', (req, res) => {
  console.log('Sende Updates');
  res.json([
    { 
      id: 1, 
      title: 'Neue Artikel', 
      content: 'Wir haben neue Artikel zu Kaktus Tycoon hinzugefügt.', 
      date: '2024-03-15',
      created_at: '2024-03-15T10:00:00Z',
      author: 'KaktusTycoon Team'
    },
    { 
      id: 2, 
      title: 'Website-Update', 
      content: 'Die Website wurde aktualisiert.', 
      date: '2024-03-14',
      created_at: '2024-03-14T14:30:00Z',
      author: 'KaktusTycoon Team'
    }
  ]);
});

// Öffentliche Artikelliste (nur Published)
app.get('/api/articles', (req, res) => {
  console.log('Sende öffentliche Artikelliste (nur published)');
  
  // Nur veröffentlichte Artikel senden
  const publishedArticles = articleMap
    .filter(article => article.status === 'published')
    .map(article => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      description: article.description || '',
      categorySlug: article.categorySlug,
      category: article.category,
      lastUpdated: article.lastUpdated,
      author: article.author
    }));
  
  console.log(`Sende ${publishedArticles.length} veröffentlichte Artikel (von insgesamt ${articleMap.length})`);
  res.json(publishedArticles);
});

// ARTIKELVERWALTUNG IM ADMIN-BEREICH

// Alle Artikel-Metadaten für den Admin-Bereich auflisten
app.get('/api/admin/articles', async (req, res) => {
  try {
    console.log('Sende Admin-Artikelliste');
    
    // Wir geben die vollständigen Artikeldaten zurück, aber ohne Inhalt
    const adminArticles = articleMap.map(article => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      description: article.description,
      categorySlug: article.categorySlug,
      category: article.category,
      lastUpdated: article.lastUpdated,
      lastModified: article.lastModified || article.lastUpdated,
      author: article.author,
      status: article.status || 'published',
      views: article.views
    }));
    
    res.json(adminArticles);
  } catch (error) {
    console.error('Fehler beim Abrufen der Artikel:', error);
    res.status(500).json({ message: 'Interner Serverfehler beim Abrufen der Artikel' });
  }
});

// Einen bestimmten Artikel für das Admin-Dashboard abrufen (mit Inhalt)
app.get('/api/admin/articles/:id', async (req, res) => {
  try {
    const articleId = parseInt(req.params.id);
    
    console.log(`Artikel mit ID ${articleId} wird für Admin angefordert`);
    
    // Artikel in der Map suchen
    const article = articleIdMap[articleId];
    
    if (!article) {
      console.error(`Artikel mit ID ${articleId} nicht gefunden`);
      return res.status(404).json({ 
        message: `Artikel mit ID ${articleId} nicht gefunden`,
        requestedId: articleId,
        availableIds: Object.keys(articleIdMap).join(', ')
      });
    }
    
    try {
      // Datei lesen
      const content = await fs.readFile(article.filePath, 'utf8');
      
      // Artikel-Objekt mit Inhalt, angepasst an das vom Frontend erwartete Format
      const fullArticle = {
        id: article.id,
        title: article.title,
        slug: article.slug,
        description: article.description || '',
        categorySlug: article.categorySlug || '',
        category: article.category || '',
        content: content,
        status: article.status || 'published',
        lastUpdated: article.lastUpdated,
        lastModified: article.lastModified || article.lastUpdated,
        author: article.author,
        views: article.views
      };
      
      console.log(`Sende Artikel #${articleId} (${article.slug}) an Admin`);
      res.json(fullArticle);
    } catch (error) {
      console.error(`Fehler beim Lesen der Datei ${article.filePath}:`, error);
      res.status(404).json({ 
        message: 'Artikeldatei nicht gefunden',
        error: error.message,
        filePath: article.filePath
      });
    }
  } catch (error) {
    console.error('Fehler beim Abrufen des Artikels:', error);
    res.status(500).json({ 
      message: 'Interner Serverfehler beim Abrufen des Artikels',
      error: error.message 
    });
  }
});

// Einen bestimmten Artikel für die öffentliche Ansicht abrufen
app.get('/api/articles/:slug', async (req, res) => {
  try {
    const slug = req.params.slug;
    
    console.log(`Öffentlicher Zugriff auf Artikel mit Slug: ${slug}`);
    
    // Finde den Artikel mit dem angegebenen Slug
    const article = articleMap.find(a => a.slug === slug && a.status === 'published');
    
    if (!article) {
      console.log(`Artikel "${slug}" nicht gefunden oder nicht veröffentlicht (Draft)`);
      return res.status(404).json({ message: 'Artikel nicht gefunden oder nicht veröffentlicht' });
    }
    
    try {
      // Datei lesen
      const content = await fs.readFile(article.filePath, 'utf8');
      
      // Artikel-Objekt mit Inhalt
      const fullArticle = {
        ...article,
        content: content
      };
      
      console.log(`Sende öffentlichen Artikel: ${article.slug} (Status: ${article.status})`);
      res.json(fullArticle);
    } catch (error) {
      console.error(`Fehler beim Lesen der Datei ${article.filePath}:`, error);
      res.status(404).json({ message: 'Artikeldatei nicht gefunden' });
    }
  } catch (error) {
    console.error('Fehler beim Abrufen des Artikels:', error);
    res.status(500).json({ message: 'Interner Serverfehler beim Abrufen des Artikels' });
  }
});

// Artikel aktualisieren
app.put('/api/admin/articles/:id', async (req, res) => {
  try {
    const articleId = parseInt(req.params.id);
    const { content, title, description, categorySlug, category, slug, status } = req.body;
    
    console.log(`Artikel #${articleId} wird aktualisiert:`, { 
      title, 
      categorySlug: categorySlug || category,
      status: status || 'published',
      content: content ? content.substring(0, 50) + '...' : 'Kein Inhalt' 
    });
    
    if (!content) {
      return res.status(400).json({ message: 'Inhalt ist erforderlich' });
    }
    
    // Artikel in der Map suchen
    const article = articleIdMap[articleId];
    
    if (!article) {
      console.error(`Artikel mit ID ${articleId} nicht gefunden für Aktualisierung`);
      return res.status(404).json({ 
        message: `Artikel mit ID ${articleId} nicht gefunden`,
        requestedId: articleId,
        availableIds: Object.keys(articleIdMap).join(', ')
      });
    }
    
    // Pfad zur Markdown-Datei
    const filePath = article.filePath;
    
    try {
      // Inhalt in die Datei schreiben
      await fs.writeFile(filePath, content, 'utf8');
      
      // Aktualisiere auch die Metadaten im Speicher
      if (title) article.title = title;
      if (description) article.description = description;
      if (categorySlug) article.categorySlug = categorySlug;
      if (category) article.category = category;
      if (status) article.status = status;
      
      // Aktualisiere das lastUpdated-Datum
      const now = new Date().toLocaleDateString('de-DE', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
      });
      article.lastUpdated = now;
      article.lastModified = now;
      
      console.log(`Artikel #${articleId} (${article.slug}) erfolgreich aktualisiert mit Status: ${article.status}`);
      res.json({ 
        success: true,
        message: 'Artikel erfolgreich aktualisiert',
        id: articleId,
        title: article.title,
        slug: article.slug,
        description: article.description,
        categorySlug: article.categorySlug,
        category: article.category,
        status: article.status,
        lastUpdated: article.lastUpdated
      });
    } catch (error) {
      console.error(`Fehler beim Schreiben der Datei ${filePath}:`, error);
      res.status(500).json({ 
        message: 'Fehler beim Speichern des Artikels',
        error: error.message,
        filePath 
      });
    }
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Artikels:', error);
    res.status(500).json({ 
      message: 'Interner Serverfehler beim Aktualisieren des Artikels',
      error: error.message 
    });
  }
});

// Hilfsfunktion zur Kategorienamensbestimmung
function getCategoryNameBySlug(slug) {
  const categories = {
    'grundlagen': 'Spielgrundlagen',
    'wirtschaft': 'Wirtschaft & Handel',
    'mechaniken': 'Spielmechaniken',
    'community': 'Community & Events',
    'regeln': 'Regeln & Richtlinien',
    'hilfe': 'Hilfe & Support'
  };
  return categories[slug] || 'Unbekannte Kategorie';
}

// Mock-Daten für Admin-Bereich (ohne Authentifizierung)
// Diese Endpunkte werden genauso behandelt wie öffentliche Endpunkte
app.get('/api/admin/stats', (req, res) => {
  console.log('Sende Admin-Stats (ohne Auth)');
  res.json({
    totalUsers: 1200,
    activeUsers: 850,
    totalArticles: articleMap.length,
    totalViews: 45000
  });
});

app.get('/api/admin/articles/recent', (req, res) => {
  console.log('Sende kürzlich bearbeitete Artikel (ohne Auth)');
  
  // Sortiere Artikel nach lastUpdated-Datum, neueste zuerst
  const sortedArticles = [...articleMap]
    .sort((a, b) => {
      const dateA = new Date(a.lastUpdated ? a.lastUpdated.split('.').reverse().join('-') : 0);
      const dateB = new Date(b.lastUpdated ? b.lastUpdated.split('.').reverse().join('-') : 0);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 5)
    .map(article => ({
      id: article.id,
      title: article.title,
      author: article.author,
      date: article.lastUpdated,
      views: article.views
    }));
  
  res.json(sortedArticles);
});

app.get('/api/admin/statistics', (req, res) => {
  console.log('Sende Admin-Statistiken (ohne Auth)');
  res.json({
    dailyActiveUsers: [120, 150, 140, 160, 180, 190, 210],
    weeklyActiveUsers: [800, 820, 850, 870, 900],
    monthlyPageViews: [5000, 5200, 5400, 5600, 5800, 6000]
  });
});

// Login-Endpunkt (vereinfacht, akzeptiert jeden Login)
app.post('/api/login', (req, res) => {
  console.log('Login-Anfrage erhalten, akzeptiere jede Anmeldung');
  const { username, password } = req.body;
  
  // Akzeptiere jeden Login
  res.json({
    success: true,
    token: 'demo-token-12345',
    user: {
      id: 1,
      username: username || 'admin',
      role: 'admin'
    }
  });
});

// Kategorien abrufen
app.get('/api/admin/categories', (req, res) => {
  console.log('Kategorien werden angefordert');
  
  // Statische Liste von Kategorien zurückgeben
  const categories = [
    {
      id: 'grundlagen',
      name: 'Spielgrundlagen',
      description: 'Grundlegende Artikel zum Spielsystem'
    },
    {
      id: 'wirtschaft',
      name: 'Wirtschaft & Handel',
      description: 'Artikel zu Wirtschaft und Handelssystem'
    },
    {
      id: 'mechaniken',
      name: 'Spielmechaniken',
      description: 'Detaillierte Erklärungen zu Spielmechaniken'
    },
    {
      id: 'community',
      name: 'Community & Events',
      description: 'Community-bezogene Artikel und Events'
    },
    {
      id: 'regeln',
      name: 'Regeln & Richtlinien',
      description: 'Spielregeln und Verhaltensrichtlinien'
    },
    {
      id: 'hilfe',
      name: 'Hilfe & Support',
      description: 'Hilfe und Support-Artikel'
    }
  ];
  
  res.json(categories);
});

// Catch-all für nicht implementierte API-Routen
app.all('/api/*', (req, res) => {
  console.log(`Nicht implementierter Endpunkt aufgerufen: ${req.method} ${req.originalUrl}`);
  res.json({ message: 'API-Endpunkt noch nicht implementiert' });
});

// Server starten
app.listen(PORT, () => {
  console.log(`=== EINFACHER SERVER OHNE AUTH GESTARTET ===`);
  console.log(`Server läuft auf http://localhost:${PORT}`);
  console.log(`CORS ist aktiviert für alle Ursprünge`);
  console.log(`Admin-Bereich ist ohne Authentifizierung zugänglich`);
  console.log(`Markdown-Artikel können bearbeitet werden`);
  console.log(`=============================================`);
}); 