// Dieses Skript kopiert alle Markdown-Artikel in den public-Ordner,
// damit sie als statische Assets für Vercel verfügbar sind
import fs from 'fs';
import path from 'path';

// Verzeichnispfade
const sourceDir = path.join(process.cwd(), 'src', 'data', 'articleContents');
const targetDirs = [
  path.join(process.cwd(), 'public', 'articleContents'),
  path.join(process.cwd(), 'public', 'data', 'articleContents'),
  path.join(process.cwd(), 'dist', 'articleContents'),           // Falls dist bereits existiert
  path.join(process.cwd(), 'dist', 'data', 'articleContents')    // Falls dist bereits existiert
];

// Funktion zum Überprüfen des Vorhandenseins von Verzeichnissen
function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Verzeichnis erstellt: ${dir}`);
    } catch (error) {
      console.error(`❌ Fehler beim Erstellen des Verzeichnisses ${dir}:`, error);
      throw error;
    }
  } else {
    console.log(`ℹ️ Verzeichnis existiert bereits: ${dir}`);
  }
}

// Funktion zum rekursiven Kopieren von Verzeichnissen
function copyDirectoryRecursively(source, target) {
  // Zielverzeichnis erstellen, falls es nicht existiert
  ensureDirectoryExists(target);

  // Alle Dateien und Unterverzeichnisse lesen
  let entries;
  try {
    entries = fs.readdirSync(source, { withFileTypes: true });
  } catch (error) {
    console.error(`❌ Fehler beim Lesen des Verzeichnisses ${source}:`, error);
    throw error;
  }

  let copiedFiles = 0;

  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);

    if (entry.isDirectory()) {
      // Rekursiv für Unterverzeichnisse aufrufen
      const subDirResult = copyDirectoryRecursively(sourcePath, targetPath);
      copiedFiles += subDirResult;
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      // Nur Markdown-Dateien kopieren
      try {
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`📄 Kopiert: ${sourcePath} -> ${targetPath}`);
        copiedFiles++;
      } catch (error) {
        console.error(`❌ Fehler beim Kopieren von ${sourcePath} nach ${targetPath}:`, error);
        throw error;
      }
    }
  }
  
  return copiedFiles;
}

console.log('🚀 Starte Kopiervorgang für Markdown-Artikel...');
console.log(`📂 Quellverzeichnis: ${sourceDir}`);

// Prüfen, ob das Quellverzeichnis existiert
if (!fs.existsSync(sourceDir)) {
  console.error(`❌ FEHLER: Quellverzeichnis existiert nicht: ${sourceDir}`);
  process.exit(1);
}

let totalCopiedFiles = 0;

try {
  // Hauptfunktion zum Kopieren ausführen für alle Zielpfade
  for (const targetDir of targetDirs) {
    console.log(`\n📂 Kopiere nach: ${targetDir}`);
    const copiedFiles = copyDirectoryRecursively(sourceDir, targetDir);
    console.log(`✅ ${copiedFiles} Artikel nach ${targetDir} kopiert`);
    totalCopiedFiles += copiedFiles;
  }
  
  console.log(`\n🎉 Fertig! Insgesamt ${totalCopiedFiles} Artikel-Dateien kopiert.`);
} catch (error) {
  console.error('\n❌ Fehler beim Kopieren der Artikel:', error);
  process.exit(1);
} 