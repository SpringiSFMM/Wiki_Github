// Serverless API-Route für Kategorien
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
  
  // Statische Liste von Kategorien zurückgeben
  const categories = [
    {
      id: 1,
      name: 'Spielgrundlagen',
      icon: '🎮',
      slug: 'grundlagen',
      description: 'Grundlegende Informationen zum Spiel'
    },
    {
      id: 2,
      name: 'Wirtschaft & Handel',
      icon: '💰',
      slug: 'wirtschaft',
      description: 'Alles über das Wirtschaftssystem'
    },
    {
      id: 3,
      name: 'Spielmechaniken',
      icon: '⚙️',
      slug: 'mechaniken',
      description: 'Detaillierte Spielmechaniken'
    },
    {
      id: 4,
      name: 'Community & Events',
      icon: '🎉',
      slug: 'community',
      description: 'Community-Aktivitäten und Events'
    },
    {
      id: 5,
      name: 'Regeln & Richtlinien',
      icon: '📜',
      slug: 'regeln',
      description: 'Serverregeln und Richtlinien'
    },
    {
      id: 6,
      name: 'Hilfe & Support',
      icon: '❓',
      slug: 'hilfe',
      description: 'Hilfestellung und Support'
    }
  ];
  
  res.status(200).json(categories);
} 