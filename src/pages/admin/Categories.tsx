import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useTheme } from '../../contexts/ThemeContext';

interface Category {
  id: string;
  name: string;
  description: string;
}

export function Categories() {
  const queryClient = useQueryClient();
  const { isDarkMode } = useTheme();
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(null);
  const [newCategory, setNewCategory] = React.useState({ name: '', description: '' });
  const [deleteConfirmId, setDeleteConfirmId] = React.useState<string | null>(null);

  // Fetch categories
  const { data: categories = [], isLoading } = useQuery<Category[]>({
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
      toast.success('Kategorie erfolgreich erstellt');
    },
    onError: () => {
      toast.error('Fehler beim Erstellen der Kategorie');
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
      toast.success('Kategorie erfolgreich aktualisiert');
    },
    onError: () => {
      toast.error('Fehler beim Aktualisieren der Kategorie');
    },
  });

  // Delete category mutation
  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      return axios.delete(`/api/admin/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setDeleteConfirmId(null);
      toast.success('Kategorie erfolgreich gelöscht');
    },
    onError: () => {
      toast.error('Fehler beim Löschen der Kategorie');
    },
  });

  return (
    <div className={`p-6 space-y-8 ${isDarkMode ? 'bg-dark-950' : 'bg-gray-100'} min-h-screen`}>
      <div className="flex justify-between items-center">
        <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-cyto-400' : 'text-cyto-600'}`}>Kategorien</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className={`flex items-center px-4 py-2 ${isDarkMode ? 'bg-cyto-600 hover:bg-cyto-500' : 'bg-cyto-500 hover:bg-cyto-600'} text-white rounded-lg transition-colors duration-300`}
        >
          <Plus className="h-5 w-5 mr-2" />
          Neue Kategorie
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-t-transparent rounded-full border-cyto-500 animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.length === 0 ? (
            <div className={`col-span-full p-8 text-center rounded-xl border transition-all duration-300 ${
              isDarkMode 
                ? 'bg-dark-900 border-dark-800 text-dark-300' 
                : 'bg-white border-gray-200 text-gray-500'
            }`}>
              <p>Keine Kategorien gefunden. Erstellen Sie Ihre erste Kategorie.</p>
            </div>
          ) : (
            categories.map((category) => (
              <div
                key={category.id}
                className={`rounded-xl p-6 border transition-all duration-300 hover:shadow-lg ${
                  isDarkMode 
                    ? 'bg-dark-900 border-dark-800 hover:shadow-dark-950/30' 
                    : 'bg-white border-gray-200 hover:shadow-gray-200/30'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-cyto-400' : 'text-cyto-600'} mb-2`}>
                      {category.name}
                    </h3>
                    <p className={`${isDarkMode ? 'text-dark-300' : 'text-gray-500'} text-sm`}>{category.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingCategory(category)}
                      className={`p-2 rounded-lg transition-colors ${
                        isDarkMode 
                          ? 'text-dark-300 hover:text-white hover:bg-dark-800' 
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(category.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        isDarkMode 
                          ? 'text-dark-300 hover:text-white hover:bg-red-900/20' 
                          : 'text-gray-500 hover:text-gray-700 hover:bg-red-100'
                      }`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Category Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl p-6 max-w-md w-full ${isDarkMode ? 'bg-dark-900' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Neue Kategorie</h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className={`p-1 rounded-full ${isDarkMode ? 'hover:bg-dark-800' : 'hover:bg-gray-100'}`}
              >
                <X className={`h-5 w-5 ${isDarkMode ? 'text-dark-300' : 'text-gray-500'}`} />
              </button>
            </div>
            
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (newCategory.name) {
                  createCategory.mutate(newCategory);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-dark-200' : 'text-gray-700'}`}>
                  Name
                </label>
                <input 
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-all ${
                    isDarkMode 
                      ? 'bg-dark-800 border-dark-700 text-white focus:ring-cyto-500/50' 
                      : 'bg-white border-gray-300 text-gray-900 focus:ring-cyto-500/30'
                  }`}
                  required
                />
              </div>
              
              <div>
                <label className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-dark-200' : 'text-gray-700'}`}>
                  Beschreibung
                </label>
                <textarea 
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  rows={3}
                  className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-all ${
                    isDarkMode 
                      ? 'bg-dark-800 border-dark-700 text-white focus:ring-cyto-500/50' 
                      : 'bg-white border-gray-300 text-gray-900 focus:ring-cyto-500/30'
                  }`}
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'bg-dark-800 text-dark-300 hover:bg-dark-700' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 ${isDarkMode ? 'bg-cyto-600 hover:bg-cyto-500' : 'bg-cyto-500 hover:bg-cyto-600'} text-white rounded-lg transition-colors`}
                >
                  Erstellen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl p-6 max-w-md w-full ${isDarkMode ? 'bg-dark-900' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Kategorie bearbeiten</h3>
              <button 
                onClick={() => setEditingCategory(null)}
                className={`p-1 rounded-full ${isDarkMode ? 'hover:bg-dark-800' : 'hover:bg-gray-100'}`}
              >
                <X className={`h-5 w-5 ${isDarkMode ? 'text-dark-300' : 'text-gray-500'}`} />
              </button>
            </div>
            
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (editingCategory.name) {
                  updateCategory.mutate(editingCategory);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-dark-200' : 'text-gray-700'}`}>
                  Name
                </label>
                <input 
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-all ${
                    isDarkMode 
                      ? 'bg-dark-800 border-dark-700 text-white focus:ring-cyto-500/50' 
                      : 'bg-white border-gray-300 text-gray-900 focus:ring-cyto-500/30'
                  }`}
                  required
                />
              </div>
              
              <div>
                <label className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-dark-200' : 'text-gray-700'}`}>
                  Beschreibung
                </label>
                <textarea 
                  value={editingCategory.description}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  rows={3}
                  className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-all ${
                    isDarkMode 
                      ? 'bg-dark-800 border-dark-700 text-white focus:ring-cyto-500/50' 
                      : 'bg-white border-gray-300 text-gray-900 focus:ring-cyto-500/30'
                  }`}
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'bg-dark-800 text-dark-300 hover:bg-dark-700' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 ${isDarkMode ? 'bg-cyto-600 hover:bg-cyto-500' : 'bg-cyto-500 hover:bg-cyto-600'} text-white rounded-lg transition-colors`}
                >
                  Aktualisieren
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl p-6 max-w-md w-full ${isDarkMode ? 'bg-dark-900' : 'bg-white'}`}>
            <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Löschen bestätigen</h3>
            <p className={`mb-6 ${isDarkMode ? 'text-dark-300' : 'text-gray-500'}`}>
              Möchten Sie diese Kategorie wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className={`px-4 py-2 rounded-lg ${
                  isDarkMode 
                    ? 'bg-dark-800 text-dark-300 hover:bg-dark-700' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } transition-colors`}
              >
                Abbrechen
              </button>
              <button
                onClick={() => deleteCategory.mutate(deleteConfirmId)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}