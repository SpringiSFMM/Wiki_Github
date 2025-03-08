// Serverless API-Route für Site-Einstellungen
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
  
  // Mock-Einstellungen zurückgeben
  res.status(200).json({
    maintenance: false,
    maintenanceMessage: '',
    systemNotice: 'Willkommen im Wiki!',
    version: '1.0.0'
  });
} 