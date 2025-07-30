'use client';

import { RefreshCw } from 'lucide-react';

interface RefreshButtonProps {
  onRefresh: () => void;
  isLoading: boolean;
}

export default function RefreshButton({ onRefresh, isLoading }: RefreshButtonProps) {
  return (
    <button
      onClick={onRefresh}
      disabled={isLoading}
      className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-300 text-white transition-colors duration-200 shadow-lg disabled:cursor-not-allowed min-w-[44px] min-h-[44px] flex items-center justify-center"
      aria-label="刷新价格数据"
    >
      <RefreshCw 
        className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} 
      />
    </button>
  );
}
