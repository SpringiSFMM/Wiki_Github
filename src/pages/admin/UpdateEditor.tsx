import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../lib/auth';
import TipTapEditor from '../../components/TipTapEditor';

interface Update {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'published';
}

export function UpdateEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [content, setContent] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [status, setStatus] = React.useState<'draft' | 'published'>('draft');

  // Fetch update data if editing
  const { data: update, isLoading: isLoadingUpdate } = useQuery({
    queryKey: ['update', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await axios.get(`/api/admin/updates/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  // Set form data when update is loaded
  React.useEffect(() => {
    if (update) {
      setTitle(update.title);
      setContent(update.content);
      setStatus(update.status);
    }
  }, [update]);

  // Create update mutation
  const createUpdateMutation = useMutation({
    mutationFn: async (data: { title: string; content: string; status: string }) => {
      const response = await axios.post('/api/admin/updates', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-updates'] });
      toast.success('Update created successfully');
      navigate('/admin/updates');
    },
    onError: () => {
      toast.error('Failed to create update');
    },
  });

  // Update update mutation
  const updateUpdateMutation = useMutation({
    mutationFn: async (data: { id: string; title: string; content: string; status: string }) => {
      const response = await axios.put(`/api/admin/updates/${data.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-updates'] });
      queryClient.invalidateQueries({ queryKey: ['update', id] });
      toast.success('Update updated successfully');
      navigate('/admin/updates');
    },
    onError: () => {
      toast.error('Failed to update update');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    
    if (!content.trim()) {
      toast.error('Content is required');
      return;
    }
    
    if (id) {
      updateUpdateMutation.mutate({ id, title, content, status });
    } else {
      createUpdateMutation.mutate({ title, content, status });
    }
  };

  if (isLoadingUpdate && id) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-dark-300">Loading update...</div>
      </div>
    );
  }

  return (
    <div className="bg-dark-950 text-dark-200 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-neon-400">
            {id ? 'Edit Update' : 'Create New Update'}
          </h1>
          <Link
            to="/admin/updates"
            className="flex items-center text-dark-300 hover:text-neon-400"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Updates
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-dark-900 rounded-lg shadow-md p-6">
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-dark-300 mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-md text-dark-200 focus:outline-none focus:ring-2 focus:ring-neon-500 focus:border-transparent"
                placeholder="Enter update title"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="content" className="block text-sm font-medium text-dark-300 mb-2">
                Content
              </label>
              <TipTapEditor
                value={content}
                onChange={setContent}
                style={{ height: '400px', marginBottom: '50px' }}
                placeholder="Enter your update content here..."
              />
            </div>

            <div className="mb-6">
              <label htmlFor="status" className="block text-sm font-medium text-dark-300 mb-2">
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-md text-dark-200 focus:outline-none focus:ring-2 focus:ring-neon-500 focus:border-transparent"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center bg-neon-500 hover:bg-neon-600 text-dark-950 px-4 py-2 rounded-md transition-colors"
                disabled={createUpdateMutation.isPending || updateUpdateMutation.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                {createUpdateMutation.isPending || updateUpdateMutation.isPending
                  ? 'Saving...'
                  : 'Save Update'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
