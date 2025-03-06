import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Plus, Edit, Trash2, Eye, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useAuth } from '../../lib/auth';

interface Update {
  id: string;
  title: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  author: string;
}

export function UpdatesManager() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Fetch all updates
  const { data: updates = [], isLoading, isError } = useQuery<Update[]>({
    queryKey: ['admin-updates'],
    queryFn: async () => {
      const response = await axios.get('/api/admin/updates');
      return response.data;
    },
  });

  // Delete update mutation
  const deleteUpdateMutation = useMutation({
    mutationFn: async (updateId: string) => {
      await axios.delete(`/api/admin/updates/${updateId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-updates'] });
      toast.success('Update deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete update');
    },
  });

  const handleDelete = (updateId: string, updateTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${updateTitle}"?`)) {
      deleteUpdateMutation.mutate(updateId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-dark-300">Loading updates...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle className="h-8 w-8 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-dark-200 mb-2">Error Loading Updates</h2>
        <p className="text-dark-300">Failed to load updates. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="bg-dark-950 text-dark-200 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-neon-400">Updates Manager</h1>
          <Link
            to="/admin/updates/new"
            className="flex items-center bg-neon-500 hover:bg-neon-600 text-dark-950 px-4 py-2 rounded-md transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Update
          </Link>
        </div>

        <div className="bg-dark-900 rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-dark-800">
              <thead className="bg-dark-850">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">
                    Author
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-dark-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-dark-900 divide-y divide-dark-800">
                {updates.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-dark-400">
                      No updates found. Create your first update!
                    </td>
                  </tr>
                ) : (
                  updates.map((update) => (
                    <tr key={update.id} className="hover:bg-dark-850">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-dark-200">{update.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          update.status === 'published' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {update.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-dark-300">{update.author}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-300">
                        {format(new Date(update.updated_at), 'MMM d, yyyy HH:mm')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => navigate(`/admin/updates/${update.id}`)}
                            className="text-neon-400 hover:text-neon-300"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(update.id, update.title)}
                            className="text-red-500 hover:text-red-400"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
