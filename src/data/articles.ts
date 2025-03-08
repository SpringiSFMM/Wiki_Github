export interface Article {
  id: number;
  title: string;
  slug: string;
  description: string;
  categorySlug: string;
  category: string;
  lastUpdated: string;
  author: string;
}

export const articles: Article[] = [
  // Spielgrundlagen
  {
    id: 1,
    title: 'Erste Schritte in Kaktus Tycoon',
    slug: 'erste-schritte',
    description: 'Ein Leitfaden für neue Spieler, um in Kaktus Tycoon durchzustarten.',
    categorySlug: 'grundlagen',
    category: 'Spielgrundlagen',
    lastUpdated: '15. März 2024',
    author: 'KaktusTycoon Team'
  },
  {
    id: 2,
    title: 'Grundlegende Spielbefehle',
    slug: 'spielbefehle',
    description: 'Eine Übersicht aller wichtigen Befehle im Spiel.',
    categorySlug: 'grundlagen',
    category: 'Spielgrundlagen',
    lastUpdated: '15. März 2024',
    author: 'KaktusTycoon Team'
  },
  {
    id: 13,
    title: 'Das Spielsystem von Kaktus Tycoon',
    slug: 'spielsystem',
    description: 'Detaillierte Erklärung des Spielsystems und der Progression.',
    categorySlug: 'grundlagen',
    category: 'Spielgrundlagen',
    lastUpdated: '16. März 2024',
    author: 'KaktusTycoon Team'
  },
  {
    id: 14,
    title: 'Ausrüstung & Verbesserungen',
    slug: 'ausruestung',
    description: 'Alles über Ausrüstungsgegenstände und wie du sie verbesserst.',
    categorySlug: 'grundlagen',
    category: 'Spielgrundlagen',
    lastUpdated: '16. März 2024',
    author: 'KaktusTycoon Team'
  },
  {
    id: 15,
    title: 'Missionen & Belohnungen',
    slug: 'missionen',
    description: 'Übersicht aller Missionen und deren Belohnungen.',
    categorySlug: 'grundlagen',
    category: 'Spielgrundlagen',
    lastUpdated: '16. März 2024',
    author: 'KaktusTycoon Team'
  },

  // Wirtschaft & Handel
  {
    id: 3,
    title: 'Das Wirtschaftssystem',
    slug: 'wirtschaftssystem',
    description: 'Alles über die Wirtschaft, Währung und Handel im Spiel.',
    categorySlug: 'wirtschaft',
    category: 'Wirtschaft & Handel',
    lastUpdated: '15. März 2024',
    author: 'KaktusTycoon Team'
  },
  {
    id: 4,
    title: 'Handel & Marktplatz',
    slug: 'handel-marktplatz',
    description: 'Wie du erfolgreich mit anderen Spielern handelst.',
    categorySlug: 'wirtschaft',
    category: 'Wirtschaft & Handel',
    lastUpdated: '15. März 2024',
    author: 'KaktusTycoon Team'
  },

  // Spielmechaniken
  {
    id: 5,
    title: 'Spielmechaniken & Features',
    slug: 'mechaniken-features',
    description: 'Detaillierte Erklärungen zu allen Spielmechaniken.',
    categorySlug: 'mechaniken',
    category: 'Spielmechaniken',
    lastUpdated: '15. März 2024',
    author: 'KaktusTycoon Team'
  },
  {
    id: 6,
    title: 'Level & Fortschritt',
    slug: 'level-system',
    description: 'Das Levelsystem und Fortschrittssystem erklärt.',
    categorySlug: 'mechaniken',
    category: 'Spielmechaniken',
    lastUpdated: '15. März 2024',
    author: 'KaktusTycoon Team'
  },
  {
    id: 16,
    title: 'Monster & Kampfsystem',
    slug: 'monster-kampf',
    description: 'Alles über Monster, ihre Drops und Kampfstrategien.',
    categorySlug: 'mechaniken',
    category: 'Spielmechaniken',
    lastUpdated: '16. März 2024',
    author: 'KaktusTycoon Team'
  },
  {
    id: 17,
    title: 'Maschinen & Automatisierung',
    slug: 'maschinen-automatisierung',
    description: 'Detaillierte Informationen zu allen Maschinen und deren Optimierung.',
    categorySlug: 'mechaniken',
    category: 'Spielmechaniken',
    lastUpdated: '16. März 2024',
    author: 'KaktusTycoon Team'
  },
  {
    id: 18,
    title: 'Booster & Forschung',
    slug: 'booster-forschung',
    description: 'Das Forschungssystem und alle verfügbaren Booster erklärt.',
    categorySlug: 'mechaniken',
    category: 'Spielmechaniken',
    lastUpdated: '16. März 2024',
    author: 'KaktusTycoon Team'
  },

  // Community & Events
  {
    id: 7,
    title: 'Community-Events',
    slug: 'events',
    description: 'Übersicht über regelmäßige Events und Community-Aktivitäten.',
    categorySlug: 'community',
    category: 'Community & Events',
    lastUpdated: '15. März 2024',
    author: 'KaktusTycoon Team'
  },
  {
    id: 8,
    title: 'Discord-Community',
    slug: 'discord',
    description: 'Alles über unsere Discord-Community und wie du beitreten kannst.',
    categorySlug: 'community',
    category: 'Community & Events',
    lastUpdated: '15. März 2024',
    author: 'KaktusTycoon Team'
  },

  // Regeln & Richtlinien
  {
    id: 9,
    title: 'Serverregeln',
    slug: 'serverregeln',
    description: 'Die wichtigsten Regeln für ein faires Miteinander.',
    categorySlug: 'regeln',
    category: 'Regeln & Richtlinien',
    lastUpdated: '15. März 2024',
    author: 'KaktusTycoon Team'
  },
  {
    id: 10,
    title: 'Chat- und Kommunikationsrichtlinien',
    slug: 'chat-richtlinien',
    description: 'Richtlinien für die Kommunikation im Spiel und auf Discord.',
    categorySlug: 'regeln',
    category: 'Regeln & Richtlinien',
    lastUpdated: '15. März 2024',
    author: 'KaktusTycoon Team'
  },
  {
    id: 19,
    title: 'Handelsrichtlinien',
    slug: 'handelsrichtlinien',
    description: 'Regeln und Richtlinien für den fairen Handel im Spiel.',
    categorySlug: 'regeln',
    category: 'Regeln & Richtlinien',
    lastUpdated: '16. März 2024',
    author: 'KaktusTycoon Team'
  },
  {
    id: 20,
    title: 'Sicherheitsrichtlinien',
    slug: 'sicherheitsrichtlinien',
    description: 'Wichtige Hinweise zum Schutz deines Accounts und deiner Daten.',
    categorySlug: 'regeln',
    category: 'Regeln & Richtlinien',
    lastUpdated: '16. März 2024',
    author: 'KaktusTycoon Team'
  },

  // Hilfe & Support
  {
    id: 11,
    title: 'FAQ - Häufig gestellte Fragen',
    slug: 'faq',
    description: 'Antworten auf die häufigsten Fragen unserer Spieler.',
    categorySlug: 'hilfe',
    category: 'Hilfe & Support',
    lastUpdated: '15. März 2024',
    author: 'KaktusTycoon Team'
  },
  {
    id: 12,
    title: 'Support kontaktieren',
    slug: 'support',
    description: 'Wie du bei Problemen Hilfe erhältst.',
    categorySlug: 'hilfe',
    category: 'Hilfe & Support',
    lastUpdated: '15. März 2024',
    author: 'KaktusTycoon Team'
  }
]; 