'use client';

import { useState, useEffect, useCallback } from 'react';
import { CryptoCurrency } from '@/types/crypto';
import { fetchCryptoPrices } from '@/lib/api';
import CryptoCard from '@/components/CryptoCard';
import ThemeToggle from '@/components/ThemeToggle';
import RefreshButton from '@/components/RefreshButton';
import ErrorBoundary from '@/components/ErrorBoundary';
import { TrendingUp } from 'lucide-react';

export default function Home() {
  const [cryptos, setCryptos] = useState<CryptoCurrency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const loadCryptoData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 添加延迟以避免与浏览器扩展冲突
      await new Promise(resolve => setTimeout(resolve, 100));

      const data = await fetchCryptoPrices();
      setCryptos(data);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取数据失败');
      console.error('Error loading crypto data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 初始加载
  useEffect(() => {
    loadCryptoData();
  }, [loadCryptoData]);

  // 自动刷新 - 每5分钟
  useEffect(() => {
    const interval = setInterval(() => {
      loadCryptoData();
    }, 5 * 60 * 1000); // 5分钟

    return () => clearInterval(interval);
  }, [loadCryptoData]);

  const handleRefresh = () => {
    loadCryptoData();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      {/* 头部 */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  CryptoTrack
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  实时加密货币价格监测
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <RefreshButton onRefresh={handleRefresh} isLoading={isLoading} />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 状态信息 */}
        <div className="mb-8">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              实时价格
            </h2>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            数据每5分钟自动更新，点击刷新按钮可手动更新
          </div>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-400">
              ⚠️ {error}
            </p>
          </div>
        )}

        {/* 加密货币卡片网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading && cryptos.length === 0 ? (
            // 加载状态
            Array.from({ length: 4 }).map((_, index) => (
              <CryptoCard 
                key={index} 
                crypto={{} as CryptoCurrency} 
                isLoading={true} 
              />
            ))
          ) : (
            // 实际数据
            cryptos.map((crypto) => (
              <ErrorBoundary key={crypto.id}>
                <CryptoCard
                  crypto={crypto}
                  isLoading={false}
                />
              </ErrorBoundary>
            ))
          )}
        </div>

        {/* 投资理念文字 */}
        {!isLoading && cryptos.length > 0 && (
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-8 rounded-2xl border border-blue-200 dark:border-blue-800">
              <p className="text-xl font-serif italic text-gray-700 dark:text-gray-300 tracking-wide leading-relaxed">
                "Our favorite holding period is forever."
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                — Warren Buffett
              </p>
            </div>
          </div>
        )}

        {/* 空状态 */}
        {!isLoading && cryptos.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>暂无数据</p>
            </div>
          </div>
        )}
      </main>

      {/* 页脚 */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>数据来源: CoinGecko API | 每5分钟自动更新</p>
            <p className="mt-1">© 2024 CryptoTrack. Built with Next.js & Tailwind CSS</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
