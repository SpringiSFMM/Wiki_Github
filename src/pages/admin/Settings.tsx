import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, Save, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../lib/auth';

interface Settings {
  maintenanceMode: boolean;
  maintenanceMessage: string;
}

interface AdminProfile {
  username: string;
  email: string;
}

export function Settings() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [settings, setSettings] = React.useState<Settings>({
    maintenanceMode: false,
    maintenanceMessage: '',
  });
  const [profile, setProfile] = React.useState<AdminProfile>({
    username: '',
    email: '',
  });
  const [passwords, setPasswords] = React.useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [showPasswords, setShowPasswords] = React.useState(false);

  // Fetch settings
  const { data: settingsData } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await axios.get('/api/admin/settings');
      return response.data;
    },
  });

  // Fetch admin profile
  const { data: profileData } = useQuery({
    queryKey: ['adminProfile'],
    queryFn: async () => {
      const response = await axios.get('/api/admin/profile');
      return response.data;
    },
  });

  React.useEffect(() => {
    if (settingsData) {
      setSettings(settingsData);
    }
    if (profileData) {
      setProfile(profileData);
    }
  }, [settingsData, profileData]);

  // Update settings mutation
  const updateSettings = useMutation({
    mutationFn: async (data: Settings) => {
      return axios.put('/api/admin/settings', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Settings updated successfully');
    },
    onError: () => {
      toast.error('Failed to update settings');
    },
  });

  // Update profile mutation
  const updateProfile = useMutation({
    mutationFn: async (data: AdminProfile) => {
      return axios.put('/api/admin/profile', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProfile'] });
      toast.success('Profile updated successfully');
    },
    onError: () => {
      toast.error('Failed to update profile');
    },
  });

  // Change password mutation
  const changePassword = useMutation({
    mutationFn: async (data: typeof passwords) => {
      return axios.put('/api/admin/change-password', data);
    },
    onSuccess: () => {
      setPasswords({ current: '', new: '', confirm: '' });
      toast.success('Password changed successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to change password');
    },
  });

  const handleSettingsSave = () => {
    updateSettings.mutate(settings);
  };

  const handleProfileSave = () => {
    updateProfile.mutate(profile);
  };

  const handlePasswordChange = () => {
    if (passwords.new !== passwords.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    changePassword.mutate(passwords);
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-neon-400">Settings</h1>

      {/* Maintenance Mode */}
      <div className="bg-dark-900 rounded-xl border border-dark-800 p-6">
        <h2 className="text-xl font-semibold text-neon-400 mb-4">Maintenance Mode</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-neon-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-600"></div>
            </label>
            <span className="text-dark-200">Enable Maintenance Mode</span>
          </div>
          {settings.maintenanceMode && (
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-1" />
              <p className="text-sm text-yellow-500">
                When maintenance mode is enabled, only administrators can access the site.
                All other users will see the maintenance message.
              </p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-dark-200 mb-2">
              Maintenance Message
            </label>
            <textarea
              value={settings.maintenanceMessage}
              onChange={(e) => setSettings({ ...settings, maintenanceMessage: e.target.value })}
              className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-100 focus:outline-none focus:border-neon-500 h-24"
              placeholder="Enter the message to display during maintenance"
            />
          </div>
          <button
            onClick={handleSettingsSave}
            disabled={updateSettings.isPending}
            className="px-4 py-2 bg-neon-600 text-dark-950 rounded-lg hover:bg-neon-500 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{updateSettings.isPending ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>

      {/* Admin Profile */}
      <div className="bg-dark-900 rounded-xl border border-dark-800 p-6">
        <h2 className="text-xl font-semibold text-neon-400 mb-4">Admin Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-200 mb-2">
              Username
            </label>
            <input
              type="text"
              value={profile.username}
              onChange={(e) => setProfile({ ...profile, username: e.target.value })}
              className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-100 focus:outline-none focus:border-neon-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-200 mb-2">
              Email
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-100 focus:outline-none focus:border-neon-500"
            />
          </div>
          <button
            onClick={handleProfileSave}
            disabled={updateProfile.isPending}
            className="px-4 py-2 bg-neon-600 text-dark-950 rounded-lg hover:bg-neon-500 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{updateProfile.isPending ? 'Saving...' : 'Save Profile'}</span>
          </button>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-dark-900 rounded-xl border border-dark-800 p-6">
        <h2 className="text-xl font-semibold text-neon-400 mb-4">Change Password</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-200 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPasswords ? 'text' : 'password'}
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-100 focus:outline-none focus:border-neon-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-dark-400 hover:text-dark-300"
              >
                {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-200 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords ? 'text' : 'password'}
                value={passwords.new}
                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-100 focus:outline-none focus:border-neon-500 pr-10"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-200 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords ? 'text' : 'password'}
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-100 focus:outline-none focus:border-neon-500 pr-10"
              />
            </div>
          </div>
          <button
            onClick={handlePasswordChange}
            disabled={changePassword.isPending}
            className="px-4 py-2 bg-neon-600 text-dark-950 rounded-lg hover:bg-neon-500 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <Lock className="h-4 w-4" />
            <span>{changePassword.isPending ? 'Changing...' : 'Change Password'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}