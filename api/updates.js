// Serverless API-Route für Updates
export default function handler(req, res) {
  // CORS-Header setzen
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // OPTIONS-Anfragen für CORS Preflight bearbeiten
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  try {
    // Mock-Updates zurückgeben
    const updates = [
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
    ];
    
    res.status(200).json(updates);
  } catch (error) {
    console.error('Fehler beim Abrufen der Updates:', error);
    // Leeres Array zurückgeben, wenn ein Fehler auftritt
    res.status(200).json([]);
  }
} 