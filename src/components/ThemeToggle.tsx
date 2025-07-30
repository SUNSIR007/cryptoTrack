'use client';

import { useTheme } from '../lib/theme-context';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-3 rounded-full bg-gray-200 dark:bg-black hover:bg-gray-300 dark:hover:bg-gray-800 active:bg-gray-400 dark:active:bg-gray-700 transition-colors duration-200 shadow-lg border dark:border-gray-700 min-w-[44px] min-h-[44px] flex items-center justify-center"
      aria-label={theme === 'light' ? '切换到暗色模式' : '切换到亮色模式'}
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      ) : (
        <Sun className="w-5 h-5 text-yellow-500" />
      )}
    </button>
  );
}
