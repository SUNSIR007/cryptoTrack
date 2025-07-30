'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Plus, X } from 'lucide-react';
import { SearchResult } from '@/types/crypto';
import { searchCoins } from '@/lib/api';

interface CoinSearchProps {
  onAddCoin: (coinId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function CoinSearch({ onAddCoin, isOpen, onClose }: CoinSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 防抖搜索
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const searchResults = await searchCoins(query);
        setResults(searchResults);
      } catch (err) {
        setError('搜索失败，请稍后重试');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // 点击外部关闭
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // 自动聚焦搜索框
      setTimeout(() => inputRef.current?.focus(), 100);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // ESC键关闭
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleAddCoin = (coinId: string) => {
    onAddCoin(coinId);
    setQuery('');
    setResults([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        ref={searchRef}
        className="bg-white dark:bg-black rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700"
      >
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            添加币种
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* 搜索框 */}
        <div className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索币种名称或符号..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* 搜索结果 */}
        <div className="max-h-80 overflow-y-auto">
          {isLoading && (
            <div className="p-6 text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">搜索中...</p>
            </div>
          )}

          {error && (
            <div className="p-6 text-center">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          {!isLoading && !error && query && results.length === 0 && (
            <div className="p-6 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">未找到相关币种</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="pb-4">
              {results.map((coin) => (
                <button
                  key={coin.id}
                  onClick={() => handleAddCoin(coin.id)}
                  className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                >
                  <img 
                    src={coin.thumb} 
                    alt={coin.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {coin.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {coin.symbol} • 排名 #{coin.market_cap_rank}
                    </div>
                  </div>
                  <Plus className="w-5 h-5 text-gray-400" />
                </button>
              ))}
            </div>
          )}
        </div>

        {!query && (
          <div className="p-6 text-center border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              输入币种名称或符号开始搜索
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
