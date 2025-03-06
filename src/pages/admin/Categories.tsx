import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Save } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Category {
  id: string;
  name: string;
  description: string;
}

export function Categories() {
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(null);
  const [newCategory, setNewCategory] = React.useState({ name: '', description: '' });

  // Fetch categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get('/api/admin/categories');
      return response.data;
    },
  });

  // Create category mutation
  const createCategory = useMutation({
    mutationFn: async (data: { name: string; description: string }) => {
      return axios.post('/api/admin/categories', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsAddModalOpen(false);
      setNewCategory({ name: '', description: '' });
      toast.success('Category created successfully');
    },
    onError: () => {
      toast.error('Failed to create category');
    },
  });

  // Update category mutation
  const updateCategory = useMutation({
    mutationFn: async (data: Category) => {
      return axios.put(`/api/admin/categories/${data.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setEditingCategory(null);
      toast.success('Category updated successfully');
    },
    onError: () => {
      toast.error('Failed to update category');
    },
  });

  // Delete category mutation
  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      return axios.delete(`/api/admin/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete category');
    },
  });

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-neon-400">Categories</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center px-4 py-2 bg-neon-600 text-dark-950 rounded-lg hover:bg-neon-500 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-dark-900 rounded-lg p-6 border border-dark-800"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-neon-400 mb-2">
                  {category.name}
                </h3>
                <p className="text-dark-300 text-sm">{category.description}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingCategory(category)}
                  className="p-2 text-dark-200 hover:text-neon-400 rounded-lg"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => deleteCategory.mutate(category.id)}
                  className="p-2 text-dark-200 hover:text-red-400 rounded-lg"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Category Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-dark-950/75 flex items-center justify-center p-4 z-50">
          <div className="bg-dark-900 rounded-xl p-6 max-w-md w-full border border-dark-800">
            <h3 className="text-xl font-semibold text-neon-400 mb-4">Add New Category</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-100 focus:outline-none focus:border-neon-500"
                  placeholder="Category name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-1">
                  Description
                </label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-100 focus:outline-none focus:border-neon-500 h-24"
                  placeholder="Category description"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-dark-200 hover:text-dark-100"
              >
                Cancel
              </button>
              <button
                onClick={() => createCategory.mutate(newCategory)}
                disabled={createCategory.isPending}
                className="px-4 py-2 bg-neon-600 text-dark-950 rounded-lg hover:bg-neon-500 disabled:opacity-50"
              >
                {createCategory.isPending ? 'Creating...' : 'Create Category'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 bg-dark-950/75 flex items-center justify-center p-4 z-50">
          <div className="bg-dark-900 rounded-xl p-6 max-w-md w-full border border-dark-800">
            <h3 className="text-xl font-semibold text-neon-400 mb-4">Edit Category</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, name: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-100 focus:outline-none focus:border-neon-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-1">
                  Description
                </label>
                <textarea
                  value={editingCategory.description}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, description: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-100 focus:outline-none focus:border-neon-500 h-24"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setEditingCategory(null)}
                className="px-4 py-2 text-dark-200 hover:text-dark-100"
              >
                Cancel
              </button>
              <button
                onClick={() => updateCategory.mutate(editingCategory)}
                disabled={updateCategory.isPending}
                className="px-4 py-2 bg-neon-600 text-dark-950 rounded-lg hover:bg-neon-500 disabled:opacity-50"
              >
                {updateCategory.isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}