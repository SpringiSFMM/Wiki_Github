import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Coins, Trophy, Users, Settings, BookOpen, Crown, Shield, Clock, Info } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { format } from 'date-fns';

interface Update {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  author: string;
}

export function Home() {
  const features = [
    {
      icon: <Sprout className="h-8 w-8" />,
      title: 'Grow Cacti',
      description: 'Master the art of cactus farming',
      link: '/wiki/growing',
      bgImage: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&q=80&w=2940'
    },
    {
      icon: <Coins className="h-8 w-8" />,
      title: 'Economy',
      description: 'Trade and earn money',
      link: '/wiki/economy',
      bgImage: 'https://images.unsplash.com/photo-1596470663180-7c3ad9b7e545?auto=format&fit=crop&q=80&w=2940'
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      title: 'Competitions',
      description: 'Compete with other farmers',
      link: '/wiki/competitions',
      bgImage: 'https://images.unsplash.com/photo-1533587045742-d84cc87ee4f4?auto=format&fit=crop&q=80&w=2940'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Multiplayer',
      description: 'Play with friends',
      link: '/wiki/multiplayer',
      bgImage: 'https://images.unsplash.com/photo-1528475478853-5b89bed65c4c?auto=format&fit=crop&q=80&w=2940'
    }
  ];

  const guides = [
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: 'Beginner Guide',
      description: 'Start your cactus empire',
      link: '/wiki/guides'
    },
    {
      icon: <Settings className="h-6 w-6" />,
      title: 'Automation',
      description: 'Build efficient farms',
      link: '/wiki/automation'
    },
    {
      icon: <Crown className="h-6 w-6" />,
      title: 'Ranks',
      description: 'Climb the farmer ranks',
      link: '/wiki/ranks'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Rules',
      description: 'Server guidelines',
      link: '/wiki/rules'
    }
  ];

  // Fetch latest updates
  const { data: updates = [], isLoading } = useQuery<Update[]>({
    queryKey: ['latest-updates'],
    queryFn: async () => {
      const response = await axios.get('/api/updates');
      return response.data;
    },
  });

  // Function to get the first paragraph of content
  const getExcerpt = (htmlContent: string) => {
    // Create a temporary div to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    // Get the first paragraph or first 150 characters
    const firstParagraph = tempDiv.querySelector('p');
    if (firstParagraph) {
      return firstParagraph.textContent?.slice(0, 150) + (firstParagraph.textContent?.length > 150 ? '...' : '');
    }
    
    // Fallback to plain text if no paragraphs
    return tempDiv.textContent?.slice(0, 150) + (tempDiv.textContent?.length > 150 ? '...' : '') || '';
  };

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="relative h-[500px] -mt-16 mb-16">
        <div className="absolute inset-0 bg-gradient-to-r from-dark-900 to-dark-800">
          <img
            src="https://images.unsplash.com/photo-1509549649946-f1b6276d4f35?auto=format&fit=crop&q=80&w=2940"
            alt="Desert background"
            className="w-full h-full object-cover opacity-20 mix-blend-overlay"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 to-transparent" />
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold text-neon-400 mb-6 leading-tight">
              Welcome to Cactus Tycoon
            </h1>
            <p className="text-xl text-dark-100 mb-8">
              Build your cactus empire in our unique Minecraft tycoon experience.
              Learn strategies, compete with others, and become the ultimate cactus farmer!
            </p>
            <div className="flex space-x-4">
              <Link
                to="/wiki/getting-started"
                className="px-6 py-3 bg-neon-600 hover:bg-neon-500 text-dark-950 rounded-lg font-semibold transition-colors"
              >
                Start Farming
              </Link>
              <Link
                to="/wiki/guides"
                className="px-6 py-3 bg-dark-800 hover:bg-dark-700 text-dark-100 rounded-lg font-semibold transition-colors border border-dark-700"
              >
                View Guides
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-neon-400 mb-8">Featured Content</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.link}
              className="group relative overflow-hidden rounded-xl h-64 border border-dark-800 bg-dark-900"
            >
              <div className="absolute inset-0">
                <img
                  src={feature.bgImage}
                  alt={feature.title}
                  className="w-full h-full object-cover opacity-20 mix-blend-overlay transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/60" />
              </div>
              <div className="relative h-full p-6 flex flex-col justify-end">
                <div className="mb-4 p-3 bg-neon-500/10 rounded-lg w-fit">
                  <div className="text-neon-400">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-bold text-neon-400 mb-2">{feature.title}</h3>
                <p className="text-dark-200">{feature.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Access Guides */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-neon-400 mb-8">Essential Guides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {guides.map((guide, index) => (
            <Link
              key={index}
              to={guide.link}
              className="bg-dark-900 rounded-xl p-6 hover:bg-dark-800 transition-colors border border-dark-800"
            >
              <div className="mb-4 p-3 bg-neon-500/10 rounded-lg w-fit">
                <div className="text-neon-400">{guide.icon}</div>
              </div>
              <h3 className="text-lg font-semibold text-neon-400 mb-2">{guide.title}</h3>
              <p className="text-dark-300">{guide.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Updates */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-dark-900 rounded-xl border border-dark-800 p-8">
          <h2 className="text-3xl font-bold text-neon-400 mb-6">Latest Updates</h2>
          <div className="space-y-6">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="text-dark-300">Loading updates...</div>
              </div>
            ) : updates.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-dark-300">No updates available yet.</div>
              </div>
            ) : (
              updates.map((update, index) => (
                <div key={update.id} className={`flex gap-6 items-start ${index < updates.length - 1 ? 'pb-6 border-b border-dark-800' : ''}`}>
                  <div className="flex-shrink-0 w-16 h-16 bg-neon-500/10 rounded-lg flex items-center justify-center">
                    <Info className="h-8 w-8 text-neon-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-neon-400 mb-2">{update.title}</h3>
                    <p className="text-dark-300 mb-3">
                      {getExcerpt(update.content)}
                    </p>
                    <div className="flex items-center text-sm text-dark-400">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{format(new Date(update.created_at), 'MMMM d, yyyy')}</span>
                      <span className="mx-2">•</span>
                      <span>By {update.author}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}