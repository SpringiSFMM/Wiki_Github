import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Coins, Trophy, Users, Settings, Server, Crown, Shield, Clock, Info, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { format } from 'date-fns';
import { useTheme } from '../contexts/ThemeContext';

interface Update {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  author: string;
}

export function Home() {
  const { isDarkMode } = useTheme();
  
  const features = [
    {
      icon: <Server className="h-8 w-8" />,
      title: 'Spielmodi',
      description: 'Entdecke unsere verschiedenen Spielmodi',
      link: '/wiki/spielmodi',
      bgImage: 'https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?auto=format&fit=crop&q=80'
    },
    {
      icon: <Coins className="h-8 w-8" />,
      title: 'Economy',
      description: 'Alles zum Wirtschaftssystem',
      link: '/wiki/economy',
      bgImage: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80'
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      title: 'Events',
      description: 'Regelmäßige Events und Wettbewerbe',
      link: '/wiki/events',
      bgImage: 'https://images.unsplash.com/photo-1567942712661-82b9b407abbf?auto=format&fit=crop&q=80'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Community',
      description: 'Werde Teil unserer Community',
      link: '/wiki/community',
      bgImage: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&q=80'
    }
  ];

  const guides = [
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: 'Einsteiger-Guide',
      description: 'Erste Schritte auf Cytooxien',
      link: '/wiki/guides',
      bgImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80'
    },
    {
      icon: <Settings className="h-6 w-6" />,
      title: 'Befehle',
      description: 'Wichtige Server-Befehle',
      link: '/wiki/befehle',
      bgImage: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80'
    },
    {
      icon: <Crown className="h-6 w-6" />,
      title: 'Ränge',
      description: 'Verfügbare Ränge und Vorteile',
      link: '/wiki/ränge',
      bgImage: 'https://images.unsplash.com/photo-1589988557744-7e25da0f3987?auto=format&fit=crop&q=80'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Regeln',
      description: 'Server-Regeln und Richtlinien',
      link: '/wiki/regeln',
      bgImage: 'https://images.unsplash.com/photo-1633613286848-e6f43bbafb8d?auto=format&fit=crop&q=80'
    }
  ];

  // Funktion zum Kürzen von HTML-Inhalten
  const truncateHTML = (html: string, maxLength: number) => {
    if (html.length <= maxLength) return html;
    
    // Einfache Kürzung, die HTML-Tags berücksichtigt
    // Für komplexere Fälle könnte eine HTML-Parser-Bibliothek verwendet werden
    const truncated = html.substring(0, maxLength);
    
    // Prüfen, ob wir einen Tag abgeschnitten haben
    const lastOpenTag = truncated.lastIndexOf('<');
    const lastCloseTag = truncated.lastIndexOf('>');
    
    if (lastOpenTag > lastCloseTag) {
      // Wir haben einen Tag abgeschnitten, kürzen wir vor dem letzten geöffneten Tag
      return truncated.substring(0, lastOpenTag) + '...';
    }
    
    return truncated + '...';
  };

  // Fetch latest updates
  const { data: updates = [], isLoading } = useQuery<Update[]>({
    queryKey: ['latest-updates'],
    queryFn: async () => {
      const response = await axios.get('/api/updates');
      return response.data;
    },
  });

  return (
    <div className="space-y-12 max-w-6xl mx-auto px-4">
      {/* Hero Section */}
      <section className={`relative overflow-hidden rounded-2xl ${isDarkMode ? 'bg-dark-900/70 border border-dark-700' : 'bg-white border border-slate-200 shadow-sm'} p-4 md:p-6`}>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className={`text-3xl md:text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-4`}>Willkommen im Community-Wiki für Cytooxien</h1>
          
          <p className={`text-lg ${isDarkMode ? 'text-dark-300' : 'text-slate-600'} max-w-2xl mb-8`}>Hier findest du alle wichtigen Informationen zum Minecraft-Server Cytooxien, Spielmodi, Befehlen und vielem mehr.</p>
          
          <div className="flex flex-wrap gap-4">
            <Link 
              to="/wiki/einsteiger" 
              className="relative px-6 py-3 rounded-lg overflow-hidden group flex items-center"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyto-600 to-cyto-700 transition-transform duration-300 group-hover:scale-105"></div>
              <div className="absolute inset-0 opacity-0 bg-gradient-to-r from-cyto-500 to-cyto-600 transition-opacity duration-300 group-hover:opacity-100"></div>
              <span className="relative z-10 text-white font-medium">Erste Schritte</span>
            </Link>
            
            <Link 
              to="/wiki" 
              className={`px-6 py-3 rounded-lg ${isDarkMode ? 'bg-dark-800 hover:bg-dark-700 text-dark-200 border border-dark-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'} transition-all duration-300 flex items-center`}
            >
              <span>Guides ansehen</span>
            </Link>
          </div>
          
          <div className={`mt-8 p-4 rounded-lg ${isDarkMode ? 'bg-dark-800/50 border border-dark-700/50' : 'bg-slate-50 border border-slate-200'} text-sm ${isDarkMode ? 'text-dark-400' : 'text-slate-500'}`}>Dieses Wiki wurde von einem Communitymitglied erstellt und wird von diesem betrieben. Es handelt sich um keine offizielle Seite von Cytooxien. Es findet keine Kooperation mit Cytooxien statt. Cytooxien haftet nicht und ist für diese Seite nicht verantwortlich.</div>
        </div>
      </section>
      
      {/* Featured Categories */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-cyto-400' : 'text-cyto-600'}`}>Beliebte Kategorien</h2>
          <Link 
            to="/wiki" 
            className={`flex items-center ${isDarkMode ? 'text-dark-300 hover:text-cyto-400' : 'text-slate-600 hover:text-cyto-600'} transition-colors duration-300`}
          >
            <span>Alle anzeigen</span>
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Link 
              key={index} 
              to={feature.link}
              className={`group relative overflow-hidden rounded-xl ${isDarkMode 
                ? 'bg-gradient-to-b from-dark-800 to-dark-900 hover:from-dark-700 hover:to-dark-800 border border-dark-700 hover:border-dark-600' 
                : 'bg-gradient-to-b from-white to-slate-50 hover:from-slate-50 hover:to-slate-100 border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow'} 
                transition-all duration-300 p-6 flex flex-col h-full`}
            >
              <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-dark-800/50' : 'bg-slate-100'} w-fit mb-4`}>
                {React.cloneElement(feature.icon, { className: `h-8 w-8 ${isDarkMode ? 'text-cyto-400' : 'text-cyto-600'}` })}
              </div>
              
              <h3 className={`text-lg font-medium ${isDarkMode ? 'text-dark-100' : 'text-slate-900'} mb-2`}>{feature.title}</h3>
              <p className={`text-sm ${isDarkMode ? 'text-dark-400' : 'text-slate-500'}`}>{feature.description}</p>
              
              <div className={`mt-auto pt-4 text-sm font-medium ${isDarkMode ? 'text-cyto-400' : 'text-cyto-600'} flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                <span>Mehr erfahren</span>
                <ArrowRight className="ml-1 h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Quick Access Guides */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-cyto-400' : 'text-cyto-600'}`}>Wichtige Guides</h2>
          <Link 
            to="/wiki" 
            className={`flex items-center ${isDarkMode ? 'text-dark-300 hover:text-cyto-400' : 'text-slate-600 hover:text-cyto-600'} transition-colors duration-300`}
          >
            <span>Alle anzeigen</span>
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {guides.map((guide, index) => (
            <Link 
              key={index} 
              to={guide.link}
              className={`group relative overflow-hidden rounded-xl ${isDarkMode 
                ? 'bg-gradient-to-b from-dark-800 to-dark-900 hover:from-dark-700 hover:to-dark-800 border border-dark-700 hover:border-dark-600' 
                : 'bg-gradient-to-b from-white to-slate-50 hover:from-slate-50 hover:to-slate-100 border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow'} 
                transition-all duration-300 p-6 flex flex-col h-full`}
            >
              <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-dark-800/50' : 'bg-slate-100'} w-fit mb-4`}>
                {React.cloneElement(guide.icon, { className: `h-6 w-6 ${isDarkMode ? 'text-cyto-400' : 'text-cyto-600'}` })}
              </div>
              
              <h3 className={`text-lg font-medium ${isDarkMode ? 'text-dark-100' : 'text-slate-900'} mb-2`}>{guide.title}</h3>
              <p className={`text-sm ${isDarkMode ? 'text-dark-400' : 'text-slate-500'}`}>{guide.description}</p>
              
              <div className={`mt-auto pt-4 text-sm font-medium ${isDarkMode ? 'text-cyto-400' : 'text-cyto-600'} flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                <span>Mehr erfahren</span>
                <ArrowRight className="ml-1 h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Latest Updates */}
      <section className={`rounded-2xl ${isDarkMode ? 'bg-dark-900/70 border border-dark-700' : 'bg-white border border-slate-200 shadow-sm'} overflow-hidden`}>
        <div className="p-6 md:p-8">
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-cyto-400' : 'text-cyto-600'} mb-6`}>Neueste Updates</h2>
          
          <div className="space-y-6 relative z-10">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="text-dark-300">Updates werden geladen...</div>
              </div>
            ) : updates.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-dark-300">Noch keine Updates verfügbar.</div>
              </div>
            ) : (
              updates.map((update, index) => (
                <div key={update.id} className={`flex gap-6 items-start ${index < updates.length - 1 ? 'pb-6 border-b border-dark-700' : ''} hover:bg-dark-800/30 p-4 rounded-lg transition-all duration-300 -mx-4`}>
                  <div className="flex-shrink-0 w-16 h-16 bg-cyto-600/20 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:bg-cyto-600/30">
                    <Info className="h-8 w-8 text-cyto-400 transition-colors duration-300 group-hover:text-cyto-300" />
                  </div>
                  <div className="flex-1">
                    <Link to={`/updates/${update.id}`}>
                      <h3 className="text-xl font-semibold text-cyto-400 mb-2 hover:text-cyto-300 transition-colors duration-300">{update.title}</h3>
                    </Link>
                    <div 
                      className="text-dark-300 mb-3 update-content hover:text-dark-200 transition-colors duration-300"
                      dangerouslySetInnerHTML={{ 
                        __html: update.content.length > 150 
                          ? truncateHTML(update.content, 150) 
                          : update.content 
                      }}
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-dark-400">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{format(new Date(update.created_at), 'dd.MM.yyyy')}</span>
                        <span className="mx-2">•</span>
                        <span>Von {update.author}</span>
                      </div>
                      <Link 
                        to={`/updates/${update.id}`}
                        className="text-sm text-cyto-500 hover:text-cyto-400 transition-colors duration-300 flex items-center group"
                      >
                        <span>Mehr lesen</span>
                        <span className="ml-1 transform transition-transform duration-300 group-hover:translate-x-0.5">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}