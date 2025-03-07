import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeToggleProps {
  variant?: 'icon' | 'button' | 'full';
  className?: string;
}

export function ThemeToggle({ variant = 'icon', className = '' }: ThemeToggleProps) {
  const { isDarkMode, toggleTheme } = useTheme();

  // Icon-only variant (for header)
  if (variant === 'icon') {
    return (
      <button
        onClick={toggleTheme}
        className={`p-2 rounded-lg bg-dark-800/50 hover:bg-dark-800 text-dark-300 hover:text-dark-100 transition-all duration-300 ${className}`}
        aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>
    );
  }

  // Button variant (for mobile menu)
  if (variant === 'button') {
    return (
      <button
        onClick={toggleTheme}
        className={`flex items-center space-x-2 px-4 py-2 w-full text-left hover:bg-dark-800/70 rounded-lg transition-all duration-300 ${className}`}
      >
        {isDarkMode ? <Sun className="h-5 w-5 text-dark-300" /> : <Moon className="h-5 w-5 text-dark-300" />}
        <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
      </button>
    );
  }

  // Full variant with animation (for settings page)
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <span className="text-sm font-medium text-dark-300">
        {isDarkMode ? 'Dark Mode' : 'Light Mode'}
      </span>
      <button
        onClick={toggleTheme}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${
          isDarkMode ? 'bg-cyto-600' : 'bg-dark-400'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${
            isDarkMode ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
        <span className="sr-only">{isDarkMode ? 'Activate Light Mode' : 'Activate Dark Mode'}</span>
      </button>
    </div>
  );
}
