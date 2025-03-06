import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Article {
  id: string;
  title: string;
  author: string;
  category: string;
  lastModified: string;
  status: 'published' | 'draft';
}

export function Articles() {
  const queryClient = useQueryClient();
  const [deleteArticleId, setDeleteArticleId] = React.useState<string | null>(null);

  // Fetch all articles
  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: ['articles'],
    queryFn: async () => {
      const response = await axios.get('/api/admin/articles');
      return Array.isArray(response.data) ? response.data : [];
    },
  });

  const handleDeleteArticle = async (id: string) => {
    try {
      await axios.delete(`/api/admin/articles/${id}`);
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      toast.success('Article deleted successfully');
      setDeleteArticleId(null);
    } catch (error) {
      toast.error('Failed to delete article');
    }
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-dark-300">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-neon-400">All Articles</h1>
        <Link
          to="/admin/articles/new"
          className="flex items-center px-4 py-2 bg-neon-600 text-dark-950 rounded-lg hover:bg-neon-500 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Article
        </Link>
      </div>

      {/* Articles Table */}
      <div className="bg-dark-900 rounded-xl border border-dark-800">
        <div className="p-6 border-b border-dark-800">
          <h2 className="text-xl font-semibold text-neon-400">Articles</h2>
        </div>
        <div className="overflow-x-auto">
          {articles.length === 0 ? (
            <div className="p-6 text-center text-dark-300">
              No articles found. Create your first article!
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-dark-800">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-dark-200">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-dark-200">Author</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-dark-200">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-dark-200">Last Modified</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-dark-200">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-dark-200">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-800">
                {articles.map((article) => (
                  <tr key={article.id} className="hover:bg-dark-800/50">
                    <td className="px-6 py-4 text-dark-100">{article.title}</td>
                    <td className="px-6 py-4 text-dark-200">{article.author}</td>
                    <td className="px-6 py-4 text-dark-200">{article.category}</td>
                    <td className="px-6 py-4 text-dark-200">{article.lastModified}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        article.status === 'published' 
                          ? 'bg-green-500/10 text-green-400' 
                          : 'bg-yellow-500/10 text-yellow-400'
                      }`}>
                        {article.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-3">
                        <Link 
                          to={`/admin/articles/${article.id}/edit`}
                          className="text-dark-200 hover:text-neon-400"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button 
                          onClick={() => setDeleteArticleId(article.id)}
                          className="text-dark-200 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Delete Article Confirmation Modal */}
      {deleteArticleId && (
        <div className="fixed inset-0 bg-dark-950/75 flex items-center justify-center p-4 z-50">
          <div className="bg-dark-900 rounded-xl p-6 max-w-md w-full border border-dark-800">
            <h3 className="text-xl font-semibold text-neon-400 mb-4">Delete Article</h3>
            <p className="text-dark-200 mb-6">
              Are you sure you want to delete this article? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setDeleteArticleId(null)}
                className="px-4 py-2 text-dark-200 hover:text-dark-100"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteArticleId && handleDeleteArticle(deleteArticleId)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
