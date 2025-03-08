import { articles } from './articles';

// Zähle die Artikel pro Kategorie
const articleCounts = articles.reduce((counts, article) => {
  counts[article.categorySlug] = (counts[article.categorySlug] || 0) + 1;
  return counts;
}, {} as Record<string, number>);

export const categories = [
  {
    id: 1,
    name: 'Spielgrundlagen',
    icon: '🎮',
    slug: 'grundlagen',
    description: 'Grundlegende Informationen zum Spiel',
    articleCount: articleCounts['grundlagen'] || 0
  },
  {
    id: 2,
    name: 'Wirtschaft & Handel',
    icon: '💰',
    slug: 'wirtschaft',
    description: 'Alles über das Wirtschaftssystem',
    articleCount: articleCounts['wirtschaft'] || 0
  },
  {
    id: 3,
    name: 'Spielmechaniken',
    icon: '⚙️',
    slug: 'mechaniken',
    description: 'Detaillierte Spielmechaniken',
    articleCount: articleCounts['mechaniken'] || 0
  },
  {
    id: 4,
    name: 'Community & Events',
    icon: '🎉',
    slug: 'community',
    description: 'Community-Aktivitäten und Events',
    articleCount: articleCounts['community'] || 0
  },
  {
    id: 5,
    name: 'Regeln & Richtlinien',
    icon: '📜',
    slug: 'regeln',
    description: 'Serverregeln und Richtlinien',
    articleCount: articleCounts['regeln'] || 0
  },
  {
    id: 6,
    name: 'Hilfe & Support',
    icon: '❓',
    slug: 'hilfe',
    description: 'Hilfestellung und Support',
    articleCount: articleCounts['hilfe'] || 0
  }
]; 