import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../lib/auth';
import TipTapEditor from '../../components/TipTapEditor';

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  status: 'draft' | 'published';
}

interface Category {
  id: string;
  name: string;
  description: string;
}

export function ArticleEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [content, setContent] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [status, setStatus] = React.useState<'draft' | 'published'>('draft');

  // Fetch article data if editing
  const { data: article, isLoading: isLoadingArticle } = useQuery({
    queryKey: ['article', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await axios.get(`/api/admin/articles/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  // Fetch categories
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get('/api/admin/categories');
      return response.data;
    },
  });

  // Set form data when article is loaded
  React.useEffect(() => {
    if (article) {
      setTitle(article.title);
      setContent(article.content);
      setCategory(article.category);
      setStatus(article.status);
    }
  }, [article]);

  // Create/Update article mutation
  const mutation = useMutation({
    mutationFn: async (data: Partial<Article>) => {
      if (id) {
        return axios.put(`/api/admin/articles/${id}`, data);
      }
      return axios.post('/api/admin/articles', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      toast.success(id ? 'Article updated successfully' : 'Article created successfully');
      navigate('/admin');
    },
    onError: (error: any) => {
      console.error('Save error:', error);
      toast.error(error.response?.data?.message || 'Failed to save article');
    },
  });

  const handleSave = () => {
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!category) {
      toast.error('Category is required');
      return;
    }
    if (!content.trim()) {
      toast.error('Content is required');
      return;
    }

    mutation.mutate({
      title: title.trim(),
      content: content.trim(),
      category,
      status,
    });
  };

  if (isLoadingArticle || isLoadingCategories) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-dark-300">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="bg-dark-900 border-b border-dark-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/admin" className="text-dark-200 hover:text-neon-400">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Article Title"
              className="bg-dark-800 text-dark-100 px-4 py-2 rounded-lg border border-dark-700 focus:outline-none focus:border-neon-500 w-64"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-dark-800 text-dark-100 px-4 py-2 rounded-lg border border-dark-700 focus:outline-none focus:border-neon-500"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
              className="bg-dark-800 text-dark-100 px-4 py-2 rounded-lg border border-dark-700 focus:outline-none focus:border-neon-500"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <button
            onClick={handleSave}
            disabled={mutation.isPending}
            className="px-4 py-2 bg-neon-600 text-dark-950 rounded-lg hover:bg-neon-500 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4 mr-2" />
            {mutation.isPending ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <TipTapEditor
          value={content}
          onChange={setContent}
          style={{ height: 'calc(100vh - 8rem)' }}
          placeholder="Gib hier deinen Artikelinhalt ein..."
        />
      </div>
    </div>
  );
}