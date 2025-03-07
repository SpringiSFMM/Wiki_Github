import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, Trash2, Edit, Plus, Check, X, Shield, UserPlus, UserMinus, UserCog } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useTheme } from '../../contexts/ThemeContext';

interface UserData {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  isMainAdmin: boolean;
  createdAt: string;
  lastLogin: string;
}

export function Users() {
  const { isDarkMode } = useTheme();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'viewer' as 'admin' | 'editor' | 'viewer'
  });
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Benutzer abrufen
  const { data: users = [], isLoading } = useQuery<UserData[]>({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        const response = await axios.get('/api/admin/users');
        return response.data;
      } catch (error) {
        console.error('Fehler beim Abrufen der Benutzer:', error);
        return [];
      }
    }
  });

  // Benutzer erstellen
  const createUserMutation = useMutation({
    mutationFn: async (userData: typeof formData) => {
      const response = await axios.post('/api/admin/users', userData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Benutzer erfolgreich erstellt');
      resetForm();
      setIsModalOpen(false);
    },
    onError: (error) => {
      console.error('Fehler beim Erstellen des Benutzers:', error);
      toast.error('Fehler beim Erstellen des Benutzers');
    }
  });

  // Benutzer aktualisieren
  const updateUserMutation = useMutation({
    mutationFn: async (userData: Partial<UserData> & { id: string }) => {
      const { id, ...data } = userData;
      const response = await axios.put(`/api/admin/users/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Benutzer erfolgreich aktualisiert');
      resetForm();
      setIsModalOpen(false);
      setEditingUser(null);
    },
    onError: (error) => {
      console.error('Fehler beim Aktualisieren des Benutzers:', error);
      toast.error('Fehler beim Aktualisieren des Benutzers');
    }
  });

  // Benutzer löschen
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      await axios.delete(`/api/admin/users/${userId}`);
      return userId;
    },
    onSuccess: (userId) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Benutzer erfolgreich gelöscht');
      setDeleteConfirmId(null);
    },
    onError: (error) => {
      console.error('Fehler beim Löschen des Benutzers:', error);
      toast.error('Fehler beim Löschen des Benutzers');
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUser) {
      // Benutzer aktualisieren
      const updateData: any = {
        id: editingUser.id,
        username: formData.username,
        email: formData.email,
        role: formData.role
      };
      
      // Passwort nur hinzufügen, wenn es geändert wurde
      if (formData.password) {
        updateData.password = formData.password;
      }
      
      updateUserMutation.mutate(updateData);
    } else {
      // Neuen Benutzer erstellen
      createUserMutation.mutate(formData);
    }
  };

  const handleEdit = (user: UserData) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '', // Passwort-Feld leer lassen beim Bearbeiten
      role: user.role
    });
    setIsModalOpen(true);
  };

  const handleDelete = (userId: string) => {
    // Prüfen, ob es sich um den Hauptadmin handelt
    const user = users.find(u => u.id === userId);
    if (user?.isMainAdmin) {
      toast.error('Der Hauptadmin-Account kann nicht gelöscht werden');
      return;
    }
    
    deleteUserMutation.mutate(userId);
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'viewer'
    });
    setEditingUser(null);
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin':
        return isDarkMode 
          ? 'bg-red-500/20 text-red-400 border-red-500/30' 
          : 'bg-red-100 text-red-700 border-red-200';
      case 'editor':
        return isDarkMode 
          ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' 
          : 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return isDarkMode 
          ? 'bg-gray-500/20 text-gray-400 border-gray-500/30' 
          : 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-dark-950' : 'bg-gray-100'} min-h-screen`}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-cyto-400' : 'text-cyto-600'}`}>
            Benutzerverwaltung
          </h1>
          <p className={`mt-1 ${isDarkMode ? 'text-dark-300' : 'text-gray-600'}`}>
            Verwalte Benutzerkonten und Berechtigungen
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className={`inline-flex items-center px-4 py-2 rounded-lg ${
            isDarkMode 
              ? 'bg-cyto-600 text-white hover:bg-cyto-500' 
              : 'bg-cyto-500 text-white hover:bg-cyto-600'
          } transition-colors duration-300`}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Neuer Benutzer
        </button>
      </div>

      {/* Benutzerliste */}
      <div className={`rounded-xl border ${
        isDarkMode ? 'bg-dark-900/70 border-dark-800' : 'bg-white border-gray-200'
      } overflow-hidden shadow-sm`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${isDarkMode ? 'bg-dark-800' : 'bg-gray-50'}`}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-dark-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  Benutzer
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-dark-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  Rolle
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-dark-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  Erstellt am
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-dark-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  Letzter Login
                </th>
                <th className={`px-6 py-3 text-right text-xs font-medium ${isDarkMode ? 'text-dark-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  Aktionen
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-dark-800' : 'divide-gray-200'}`}>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className={`px-6 py-4 text-center ${isDarkMode ? 'text-dark-300' : 'text-gray-500'}`}>
                    Benutzer werden geladen...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className={`px-6 py-4 text-center ${isDarkMode ? 'text-dark-300' : 'text-gray-500'}`}>
                    Keine Benutzer gefunden
                  </td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className={`${isDarkMode ? 'hover:bg-dark-800/50' : 'hover:bg-gray-50'} transition-colors duration-150`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                          isDarkMode ? 'bg-dark-800' : 'bg-gray-100'
                        }`}>
                          <User className={`h-5 w-5 ${isDarkMode ? 'text-dark-300' : 'text-gray-500'}`} />
                        </div>
                        <div className="ml-4">
                          <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {user.username}
                            {user.isMainAdmin && (
                              <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400`}>
                                <Shield className="w-3 h-3 mr-1" />
                                Hauptadmin
                              </span>
                            )}
                          </div>
                          <div className={`text-sm ${isDarkMode ? 'text-dark-400' : 'text-gray-500'}`}>
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeClass(user.role)}`}>
                        {user.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                        {user.role === 'editor' && <Edit className="w-3 h-3 mr-1" />}
                        {user.role === 'viewer' && <User className="w-3 h-3 mr-1" />}
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-dark-300' : 'text-gray-500'}`}>
                      {new Date(user.createdAt).toLocaleDateString('de-DE')}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-dark-300' : 'text-gray-500'}`}>
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('de-DE') : 'Nie'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(user)}
                        className={`text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3`}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      {deleteConfirmId === user.id ? (
                        <>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-2"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(user.id)}
                          className={`text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 ${user.isMainAdmin ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={user.isMainAdmin}
                          title={user.isMainAdmin ? 'Hauptadmin kann nicht gelöscht werden' : 'Benutzer löschen'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal für Benutzer erstellen/bearbeiten */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={() => setIsModalOpen(false)}></div>
            
            <div className={`relative z-10 w-full max-w-md p-6 rounded-lg shadow-xl ${
              isDarkMode ? 'bg-dark-900 border border-dark-700' : 'bg-white'
            }`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {editingUser ? 'Benutzer bearbeiten' : 'Neuen Benutzer erstellen'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className={`${isDarkMode ? 'text-dark-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="username" className={`block text-sm font-medium ${isDarkMode ? 'text-dark-200' : 'text-gray-700'} mb-1`}>
                      Benutzername
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                      className={`block w-full rounded-md shadow-sm ${
                        isDarkMode 
                          ? 'bg-dark-800 border-dark-700 text-white focus:border-cyto-500 focus:ring-cyto-500' 
                          : 'border-gray-300 focus:border-cyto-500 focus:ring-cyto-500'
                      } sm:text-sm`}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className={`block text-sm font-medium ${isDarkMode ? 'text-dark-200' : 'text-gray-700'} mb-1`}>
                      E-Mail
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={`block w-full rounded-md shadow-sm ${
                        isDarkMode 
                          ? 'bg-dark-800 border-dark-700 text-white focus:border-cyto-500 focus:ring-cyto-500' 
                          : 'border-gray-300 focus:border-cyto-500 focus:ring-cyto-500'
                      } sm:text-sm`}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="password" className={`block text-sm font-medium ${isDarkMode ? 'text-dark-200' : 'text-gray-700'} mb-1`}>
                      {editingUser ? 'Passwort (leer lassen, um nicht zu ändern)' : 'Passwort'}
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required={!editingUser}
                      className={`block w-full rounded-md shadow-sm ${
                        isDarkMode 
                          ? 'bg-dark-800 border-dark-700 text-white focus:border-cyto-500 focus:ring-cyto-500' 
                          : 'border-gray-300 focus:border-cyto-500 focus:ring-cyto-500'
                      } sm:text-sm`}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="role" className={`block text-sm font-medium ${isDarkMode ? 'text-dark-200' : 'text-gray-700'} mb-1`}>
                      Rolle
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md shadow-sm ${
                        isDarkMode 
                          ? 'bg-dark-800 border-dark-700 text-white focus:border-cyto-500 focus:ring-cyto-500' 
                          : 'border-gray-300 focus:border-cyto-500 focus:ring-cyto-500'
                      } sm:text-sm`}
                    >
                      <option value="viewer">Viewer</option>
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      isDarkMode 
                        ? 'bg-dark-800 text-dark-200 hover:bg-dark-700' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Abbrechen
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 rounded-md text-sm font-medium bg-cyto-600 text-white hover:bg-cyto-700`}
                  >
                    {editingUser ? 'Aktualisieren' : 'Erstellen'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 