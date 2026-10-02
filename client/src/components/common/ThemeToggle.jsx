import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export function ThemeToggle({ className = '', size = 'middle' }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center justify-center rounded-xl p-2 transition-all cursor-pointer border ${
        isDark
          ? 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700 shadow-sm'
          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-xs'
      } ${className}`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDark ? (
        <Sun size={size === 'small' ? 15 : 18} className="text-amber-400 animate-fade-in" />
      ) : (
        <Moon size={size === 'small' ? 15 : 18} className="text-slate-600 animate-fade-in" />
      )}
    </button>
  );
}
