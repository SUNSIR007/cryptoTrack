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
      className="p-3 rounded-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300 text-black transition-colors duration-200 shadow-lg disabled:cursor-not-allowed"
      aria-label="刷新价格数据"
    >
      <RefreshCw 
        className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} 
      />
    </button>
  );
}
