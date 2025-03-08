# Cytooxien Wiki - Kaktus Tycoon

Ein umfassendes Wiki für das Spiel Kaktus Tycoon, optimiert für Vercel-Hosting.

## Features

- Moderne, responsive Benutzeroberfläche
- Dunkelmodus-Unterstützung
- Markdown-basierte Artikel
- Kategorisierung von Inhalten
- Admin-Bereich mit Artikel-Editor
- Draft-System für Artikel

## Technologien

- React 18
- TypeScript
- Vite
- TailwindCSS
- Vercel Serverless Functions

## Lokale Entwicklung

1. Repository klonen:
   ```bash
   git clone https://github.com/yourusername/cytooxien-wiki.git
   cd cytooxien-wiki
   ```

2. Abhängigkeiten installieren:
   ```bash
   npm install
   ```

3. Entwicklungsserver starten:
   ```bash
   npm run dev
   ```

## Vercel-Bereitstellung

Diese Anwendung ist für Vercel optimiert. Um sie auf Vercel zu deployen:

1. Erstelle ein Konto auf [Vercel](https://vercel.com) falls du noch keines hast
2. Installiere die Vercel CLI:
   ```bash
   npm install -g vercel
   ```

3. Login in Vercel:
   ```bash
   vercel login
   ```

4. Projekt deployen:
   ```bash
   vercel
   ```

5. Für Produktionsbereitstellung:
   ```bash
   vercel --prod
   ```

Die Anwendung verwendet Vercel Serverless Functions für die API-Endpunkte, wodurch kein separater Backend-Server erforderlich ist.

## Projektstruktur

- `/api` - Vercel Serverless Functions für API-Endpunkte
- `/src` - Frontend-Code
  - `/components` - React-Komponenten
  - `/contexts` - React Context Provider
  - `/data` - Daten und Inhalte für Artikel
  - `/pages` - Haupt-Seitenkomponenten
- `/public` - Statische Dateien

## Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert. Siehe [LICENSE](LICENSE) für Details. 