#!/bin/bash

# Vercel Build-Skript für das Cytooxien-Wiki
echo "===== VERCEL BUILD START ====="

# Fehlerbehandlung aktivieren
set -e  # Beendet das Skript, wenn ein Befehl fehlschlägt
set -u  # Beendet das Skript, wenn eine undefinierte Variable verwendet wird

# Funktion für erfolgreichen Abschluss
function finish_success {
  echo "===== VERCEL BUILD ERFOLGREICH ABGESCHLOSSEN ====="
  exit 0
}

# Funktion für Fehler
function finish_error {
  echo "❌ FEHLER: $1"
  echo "===== VERCEL BUILD FEHLGESCHLAGEN ====="
  exit 1
}

# 1. Install dependencies
echo "📦 Installiere Abhängigkeiten..."
npm install || finish_error "Fehler bei der Installation der Abhängigkeiten"

# 2. Ensure necessary directories exist
echo "📂 Erstelle Verzeichnisstruktur..."
mkdir -p public/data/articleContents
mkdir -p public/articleContents
mkdir -p dist/data/articleContents  # Für den Fall, dass dist bereits existiert
mkdir -p dist/articleContents       # Für den Fall, dass dist bereits existiert

echo "🔍 Überprüfe Verzeichnisse..."
echo "Quellverzeichnis src/data/articleContents:"
ls -la src/data/articleContents || echo "⚠️ Quellverzeichnis nicht gefunden!"

echo "Zielverzeichnisse:"
echo "public/data/articleContents:"
ls -la public/data/articleContents || echo "⚠️ Verzeichnis nicht gefunden!"
echo "public/articleContents:"
ls -la public/articleContents || echo "⚠️ Verzeichnis nicht gefunden!"

# 3. Copy articles
echo "📋 Kopiere Artikel..."
node copy-articles.js || finish_error "Fehler beim Kopieren der Artikel"

# Überprüfe, ob Artikel kopiert wurden
echo "🔍 Überprüfe kopierte Artikel..."
articlesInPublic=$(find public/articleContents -name "*.md" | wc -l)
articlesInPublicData=$(find public/data/articleContents -name "*.md" | wc -l)

echo "Anzahl der Artikel in public/articleContents: $articlesInPublic"
echo "Anzahl der Artikel in public/data/articleContents: $articlesInPublicData"

if [ "$articlesInPublic" -eq 0 ] && [ "$articlesInPublicData" -eq 0 ]; then
  finish_error "Keine Artikel wurden kopiert!"
fi

# 4. Build the application
echo "🏗️ Baue die Anwendung..."
npm run build || finish_error "Fehler beim Bauen der Anwendung"

# 5. Verify the build output
echo "🔍 Überprüfe Build-Ausgabe..."
if [ -d "dist" ]; then
  echo "✅ dist-Verzeichnis existiert"
  
  # Überprüfen, ob Artikel im dist-Verzeichnis vorhanden sind
  articlesInDist=$(find dist/articleContents -name "*.md" 2>/dev/null | wc -l)
  articlesInDistData=$(find dist/data/articleContents -name "*.md" 2>/dev/null | wc -l)
  
  echo "Anzahl der Artikel in dist/articleContents: $articlesInDist"
  echo "Anzahl der Artikel in dist/data/articleContents: $articlesInDistData"
  
  # Wenn keine Artikel im dist-Verzeichnis sind, kopiere sie dorthin
  if [ "$articlesInDist" -eq 0 ] && [ "$articlesInDistData" -eq 0 ]; then
    echo "⚠️ Keine Artikel im dist-Verzeichnis gefunden, kopiere sie manuell..."
    mkdir -p dist/articleContents
    mkdir -p dist/data/articleContents
    cp -r public/articleContents/* dist/articleContents/ 2>/dev/null || echo "⚠️ Keine Artikel zum Kopieren gefunden"
    cp -r public/data/articleContents/* dist/data/articleContents/ 2>/dev/null || echo "⚠️ Keine Artikel zum Kopieren gefunden"
  fi
else
  finish_error "dist-Verzeichnis existiert nicht nach dem Build"
fi

finish_success 