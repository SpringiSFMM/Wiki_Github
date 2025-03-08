/**
 * Artikel-Loader für die Wiki-Anwendung
 * 
 * Diese Datei stellt Funktionen bereit, um Artikel-Inhalte zu laden.
 */

/**
 * Lädt den Inhalt eines Artikels basierend auf der Kategorie und dem Slug.
 * 
 * @param categorySlug - Der Slug der Kategorie
 * @param articleSlug - Der Slug des Artikels
 * @returns Eine Promise, die den Inhalt des Artikels als String zurückgibt
 */
export async function loadArticleContent(categorySlug: string, articleSlug: string): Promise<string> {
  try {
    // Versuche, den Artikel-Inhalt aus dem public-Verzeichnis zu laden
    const response = await fetch(`/data/articleContents/${categorySlug}/${articleSlug}.md`);
    
    if (!response.ok) {
      throw new Error(`Artikel konnte nicht geladen werden: ${response.status}`);
    }
    
    return await response.text();
  } catch (error) {
    console.error('Error loading article:', error);
    return '# Fehler\nDer Artikel konnte nicht geladen werden.';
  }
} 