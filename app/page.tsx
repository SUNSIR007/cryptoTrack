'use client';

import { useState, useEffect, useCallback } from 'react';
import { CryptoCurrency } from '../src/types/crypto';
import { fetchCryptoPrices } from '../src/lib/api';
import CryptoCard from '../src/components/CryptoCard';
import ThemeToggle from '../src/components/ThemeToggle';
import RefreshButton from '../src/components/RefreshButton';
import { TrendingUp, Clock } from 'lucide-react';

export default function Home() {
  const [cryptos, setCryptos] = useState<CryptoCurrency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const loadCryptoData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
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
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300 flex flex-col">
      {/* 头部 */}
      <header className="bg-white dark:bg-black shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                CryptoTrack
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                实时加密货币价格监测
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <RefreshButton onRefresh={handleRefresh} isLoading={isLoading} />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* 状态信息 */}
          <div className="mb-8">
            {lastUpdate && (
              <div className="flex justify-end">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4 mr-1" />
                  最后更新: {lastUpdate.toLocaleTimeString('zh-CN')}
                </div>
              </div>
            )}
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
          <div className="w-full">
            <div className="crypto-grid">
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
                <CryptoCard
                  key={crypto.id}
                  crypto={crypto}
                  isLoading={false}
                />
              ))
            )}
            </div>
          </div>

          {/* 空状态 */}
          {!isLoading && cryptos.length === 0 && !error && (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>暂无数据</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 mt-auto">
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
