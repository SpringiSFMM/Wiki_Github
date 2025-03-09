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
  // Alle möglichen Pfade, die wir versuchen werden
  const paths = [
    `/articleContents/${categorySlug}/${articleSlug}.md`,
    `/data/articleContents/${categorySlug}/${articleSlug}.md`,
    `/${categorySlug}/${articleSlug}.md`,
    `/public/articleContents/${categorySlug}/${articleSlug}.md`,
    `/public/data/articleContents/${categorySlug}/${articleSlug}.md`,
  ];
  
  console.log(`Versuche Artikel zu laden: ${categorySlug}/${articleSlug}`);
  
  try {
    // Versuche jeden Pfad nacheinander
    for (const path of paths) {
      console.log(`Versuche Pfad: ${path}`);
      try {
        const response = await fetch(path);
        
        if (response.ok) {
          console.log(`Erfolg! Artikel gefunden unter: ${path}`);
          return await response.text();
        } else {
          console.log(`Fehlgeschlagen für ${path}: ${response.status} - ${response.statusText}`);
        }
      } catch (pathError) {
        console.log(`Fehler bei ${path}:`, pathError);
      }
    }
    
    // Wenn alle Pfade fehlschlugen, wirf einen Fehler
    console.error(`Alle Pfade für Artikel ${categorySlug}/${articleSlug} fehlgeschlagen.`);
    console.error(`Versuchte Pfade:`, paths);
    throw new Error(`Artikel konnte nicht geladen werden: ${categorySlug}/${articleSlug}`);
  } catch (error) {
    console.error('Error loading article:', error);
    return `# Fehler beim Laden des Artikels

Der Artikel konnte nicht geladen werden.

**Details:**
- Kategorie: ${categorySlug}
- Artikel: ${articleSlug}

Bitte überprüfe, ob der Artikel existiert und der Pfad korrekt ist.`;
  }
} 