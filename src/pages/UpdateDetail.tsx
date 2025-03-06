import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { format } from 'date-fns';
import { Clock, User, ArrowLeft } from 'lucide-react';

interface Update {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  author: string;
}

export function UpdateDetail() {
  const { id } = useParams<{ id: string }>();
  
  const { data: update, isLoading, error } = useQuery<Update>({
    queryKey: ['update', id],
    queryFn: async () => {
      const response = await axios.get(`/api/updates/${id}`);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-16">
          <div className="text-dark-300">Lade Update...</div>
        </div>
      </div>
    );
  }

  if (error || !update) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-16">
          <div className="text-red-500 mb-4">Fehler beim Laden des Updates</div>
          <Link to="/" className="text-neon-400 hover:text-neon-300">
            Zurück zur Startseite
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/" className="inline-flex items-center text-neon-400 hover:text-neon-300 mb-8">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Zurück zur Übersicht
      </Link>
      
      <div className="bg-dark-900 rounded-xl border border-dark-800 p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-neon-400 mb-4">{update.title}</h1>
        
        <div className="flex items-center text-dark-400 mb-8">
          <Clock className="h-4 w-4 mr-1" />
          <span>{format(new Date(update.created_at), 'MMMM d, yyyy')}</span>
          <span className="mx-2">•</span>
          <User className="h-4 w-4 mr-1" />
          <span>{update.author}</span>
        </div>
        
        <div 
          className="text-dark-200 update-content"
          dangerouslySetInnerHTML={{ __html: update.content }}
        />
      </div>
    </div>
  );
}
