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
      bgImage: 'https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?auto=format&fit=crop&q=80'
    },
    {
      icon: <Coins className="h-8 w-8" />,
      title: 'Economy',
      description: 'Trade and earn money',
      link: '/wiki/economy',
      bgImage: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80'
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      title: 'Competitions',
      description: 'Compete with other farmers',
      link: '/wiki/competitions',
      bgImage: 'https://images.unsplash.com/photo-1567942712661-82b9b407abbf?auto=format&fit=crop&q=80'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Multiplayer',
      description: 'Play with friends',
      link: '/wiki/multiplayer',
      bgImage: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&q=80'
    }
  ];

  const guides = [
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: 'Beginner Guide',
      description: 'Start your cactus empire',
      link: '/wiki/guides',
      bgImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80'
    },
    {
      icon: <Settings className="h-6 w-6" />,
      title: 'Automation',
      description: 'Build efficient farms',
      link: '/wiki/automation',
      bgImage: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80'
    },
    {
      icon: <Crown className="h-6 w-6" />,
      title: 'Ranks',
      description: 'Climb the farmer ranks',
      link: '/wiki/ranks',
      bgImage: 'https://images.unsplash.com/photo-1589988557744-7e25da0f3987?auto=format&fit=crop&q=80'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Rules',
      description: 'Server guidelines',
      link: '/wiki/rules',
      bgImage: 'https://images.unsplash.com/photo-1633613286848-e6f43bbafb8d?auto=format&fit=crop&q=80'
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

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="relative h-[600px] -mt-16 mb-16">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1591251438125-8c0e944805d4?auto=format&fit=crop&q=80"
            alt="Desert landscape with cacti"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark-900/95 via-dark-900/80 to-dark-900/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/80 to-transparent" />
        </div>
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="max-w-3xl">
            <h1 className="text-6xl font-bold text-neon-400 mb-6 leading-tight">
              Welcome to Cactus Tycoon
            </h1>
            <p className="text-xl text-dark-100 mb-8 leading-relaxed">
              Build your cactus empire in our unique Minecraft tycoon experience.
              Learn strategies, compete with others, and become the ultimate cactus farmer!
            </p>
            <div className="flex space-x-4">
              <Link
                to="/wiki/getting-started"
                className="px-6 py-3 bg-neon-600 hover:bg-neon-500 text-dark-950 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-neon-500/20"
              >
                Start Farming
              </Link>
              <Link
                to="/wiki/guides"
                className="px-6 py-3 bg-dark-800/80 hover:bg-dark-700 text-dark-100 rounded-lg font-semibold transition-colors border border-dark-700 backdrop-blur-sm"
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
              className="group relative overflow-hidden rounded-xl h-80 border border-dark-800 bg-dark-900 hover:border-neon-500/30 transition-all duration-300"
            >
              <div className="absolute inset-0">
                <img
                  src={feature.bgImage}
                  alt={feature.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/90 to-dark-900/50 group-hover:from-dark-900/90 group-hover:via-dark-900/80 group-hover:to-dark-900/40 transition-colors duration-300" />
              </div>
              <div className="relative h-full p-6 flex flex-col justify-end">
                <div className="mb-4 p-4 bg-neon-500/10 rounded-lg w-fit backdrop-blur-sm border border-neon-500/20 group-hover:border-neon-500/30 transition-colors">
                  <div className="text-neon-400">{feature.icon}</div>
                </div>
                <h3 className="text-2xl font-bold text-neon-400 mb-2 group-hover:text-neon-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-dark-200 group-hover:text-dark-100 transition-colors">
                  {feature.description}
                </p>
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
              className="bg-dark-900 rounded-xl p-6 hover:bg-dark-800 transition-all duration-300 border border-dark-800 hover:border-neon-500/30 hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="absolute inset-0">
                <img
                  src={guide.bgImage}
                  alt={guide.title}
                  className="w-full h-full object-cover opacity-10"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/90 to-dark-900/70" />
              </div>
              <div className="relative z-10">
                <div className="mb-4 p-3 bg-neon-500/10 rounded-lg w-fit backdrop-blur-sm border border-neon-500/20">
                  <div className="text-neon-400">{guide.icon}</div>
                </div>
                <h3 className="text-lg font-semibold text-neon-400 mb-2">{guide.title}</h3>
                <p className="text-dark-300">{guide.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Latest Updates */}
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
                      {update.content.length > 150 ? update.content.substring(0, 150) + '...' : update.content}
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