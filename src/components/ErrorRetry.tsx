'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorRetryProps {
  error: string;
  onRetry: () => void;
  isRetrying?: boolean;
}

export default function ErrorRetry({ error, onRetry, isRetrying = false }: ErrorRetryProps) {
  return (
    <div className="bg-white dark:bg-black rounded-2xl p-8 shadow-lg border border-red-200 dark:border-red-800 text-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
          <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            数据加载失败
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm">
            {error}
          </p>
        </div>

        <button
          onClick={onRetry}
          disabled={isRetrying}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-300 text-white rounded-lg transition-colors duration-200 disabled:cursor-not-allowed min-h-[44px]"
        >
          <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
          <span>{isRetrying ? '重试中...' : '重试'}</span>
        </button>

        <p className="text-xs text-gray-500 dark:text-gray-400">
          请检查网络连接后重试
        </p>
      </div>
    </div>
  );
}
