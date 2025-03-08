import fs from 'fs';
import path from 'path';
import { pool } from './db';
import { v4 as uuidv4 } from 'uuid';

/**
 * Importiert Artikel aus Markdown-Dateien in die Datenbank
 */
async function importArticles() {
  try {
    console.log('Starte Import der Artikel...');

    // Hole Admin-ID für den Autor
    const [adminRows] = await pool.execute('SELECT id FROM admins WHERE username = ?', ['cytooxien_admin']);
    
    if ((adminRows as any[]).length === 0) {
      throw new Error('Admin-Benutzer nicht gefunden. Bitte führe zuerst setup.ts aus.');
    }
    
    const adminId = (adminRows as any[])[0].id;
    
    // Basis-Verzeichnis für Artikel-Inhalte
    const baseDir = path.join(process.cwd(), 'src', 'data', 'articleContents');
    
    // Hole alle Kategorien aus der Datenbank
    const [categoryRows] = await pool.execute('SELECT id, name FROM categories');
    const existingCategories = (categoryRows as any[]).map(row => row.name);
    const categoryMap = (categoryRows as any[]).reduce((map, row) => {
      map[row.name] = row.id;
      return map;
    }, {});
    
    // Importiere Artikel aus dem articles.ts-File
    const articlesModule = await import('../data/articles');
    const articles = articlesModule.articles;
    
    console.log(`Gefundene Artikel: ${articles.length}`);
    
    // Für jeden Artikel in articles.ts
    for (const article of articles) {
      try {
        // Prüfe, ob die Kategorie existiert
        if (!existingCategories.includes(article.category)) {
          console.log(`Erstelle Kategorie: ${article.category}`);
          const categoryId = uuidv4();
          await pool.execute(
            'INSERT INTO categories (id, name, description) VALUES (?, ?, ?)',
            [categoryId, article.category, `Kategorie für ${article.category}`]
          );
          existingCategories.push(article.category);
          categoryMap[article.category] = categoryId;
        }
        
        // Pfad zur Markdown-Datei
        const markdownPath = path.join(baseDir, article.categorySlug, `${article.slug}.md`);
        
        // Prüfe, ob die Datei existiert
        if (!fs.existsSync(markdownPath)) {
          console.log(`Warnung: Datei nicht gefunden: ${markdownPath}`);
          continue;
        }
        
        // Lese den Inhalt der Markdown-Datei
        const content = fs.readFileSync(markdownPath, 'utf-8');
        
        // Erstelle einen Auszug (excerpt) aus dem Inhalt
        const excerpt = content.substring(0, 100) + '...';
        
        // Generiere eine UUID für den Artikel
        const articleId = uuidv4();
        
        // Prüfe, ob der Artikel bereits existiert
        const [existingArticleRows] = await pool.execute(
          'SELECT id FROM articles WHERE title = ? AND category = ?',
          [article.title, article.category]
        );
        
        if ((existingArticleRows as any[]).length > 0) {
          console.log(`Aktualisiere Artikel: ${article.title}`);
          await pool.execute(
            'UPDATE articles SET content = ?, updated_at = NOW() WHERE id = ?',
            [content, (existingArticleRows as any[])[0].id]
          );
        } else {
          console.log(`Erstelle Artikel: ${article.title}`);
          await pool.execute(
            'INSERT INTO articles (id, title, content, category, author_id, status) VALUES (?, ?, ?, ?, ?, ?)',
            [articleId, article.title, content, article.category, adminId, 'published']
          );
        }
      } catch (error) {
        console.error(`Fehler beim Importieren des Artikels ${article.title}:`, error);
      }
    }
    
    console.log('Import der Artikel abgeschlossen!');
  } catch (error) {
    console.error('Fehler beim Importieren der Artikel:', error);
  } finally {
    // Schließe die Datenbankverbindung
    pool.end();
  }
}

// Führe den Import aus
importArticles(); 