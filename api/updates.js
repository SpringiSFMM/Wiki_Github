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
  
  // Mock-Updates zurückgeben
  res.status(200).json([
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
} 