'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { CryptoCurrency } from '@/types/crypto';
import { fetchCryptoPrices } from '@/lib/api';
import { getUserCoins, addUserCoin, removeUserCoin } from '@/lib/userCoins';
import { currencyManager } from '@/lib/currency';
import CryptoCard from '@/components/CryptoCard';
import ManualCoinCard from '@/components/ManualCoinCard';
import CryptoCardSkeleton from '@/components/CryptoCardSkeleton';
import ErrorRetry from '@/components/ErrorRetry';
import ThemeToggle from '@/components/ThemeToggle';
import RefreshButton from '@/components/RefreshButton';
import CoinSearch from '@/components/CoinSearch';
import ErrorBoundary from '@/components/ErrorBoundary';
import ExtensionGuard from '@/components/ExtensionGuard';
import ApiStatus from '@/components/ApiStatus';


export default function Home() {
  const [cryptos, setCryptos] = useState<CryptoCurrency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userCoins, setUserCoins] = useState<string[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const loadCryptoData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 添加延迟以避免与浏览器扩展冲突
      await new Promise(resolve => setTimeout(resolve, 100));

      const currentCurrency = currencyManager.getCurrentCurrency();
      const data = await fetchCryptoPrices(userCoins, currentCurrency.code);
      setCryptos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取数据失败');
      console.error('Error loading crypto data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userCoins]);

  // 初始化用户币种
  useEffect(() => {
    const coins = getUserCoins();
    setUserCoins(coins);
  }, []);

  // 加载数据
  useEffect(() => {
    if (userCoins.length > 0) {
      loadCryptoData();
    }
  }, [loadCryptoData, userCoins]);

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

  const handleAddCoin = (coinId: string) => {
    const newCoins = addUserCoin(coinId);
    setUserCoins(newCoins);
  };

  const handleRemoveCoin = (coinId: string) => {
    const newCoins = removeUserCoin(coinId);
    setUserCoins(newCoins);
  };

  const handleUpdateCoin = (coinId: string, newData: CryptoCurrency) => {
    setCryptos(prevCryptos =>
      prevCryptos.map(crypto =>
        crypto.id === coinId ? newData : crypto
      )
    );
  };

  return (
    <ExtensionGuard>
      <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      {/* 头部 */}
      <header className="bg-white dark:bg-black shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                CryptoTrack
              </h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-3 sm:p-3 md:p-3 rounded-full bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 text-white transition-colors duration-200 shadow-lg border border-yellow-400 min-w-[44px] min-h-[44px] flex items-center justify-center"
                title="添加币种"
              >
                <Plus className="w-5 h-5 sm:w-5 sm:h-5" />
              </button>
              <RefreshButton onRefresh={handleRefresh} isLoading={isLoading} />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* API 状态检查 */}
        <ApiStatus className="mb-6" />

        {/* 错误提示 */}
        {error && !isLoading && (
          <div className="mb-6">
            <ErrorRetry
              error={error}
              onRetry={handleRefresh}
              isRetrying={isLoading}
            />
          </div>
        )}

        {/* 加密货币卡片网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading && cryptos.length === 0 ? (
            // 加载状态 - 使用骨架屏
            Array.from({ length: 8 }).map((_, index) => (
              <CryptoCardSkeleton key={index} />
            ))
          ) : (
            // 实际数据
            cryptos.map((crypto) => (
              <ErrorBoundary key={crypto.id}>
                {crypto.id.startsWith('manual-') ? (
                  <ManualCoinCard
                    crypto={crypto}
                    onRemove={handleRemoveCoin}
                    onUpdate={handleUpdateCoin}
                    showRemoveButton={true}
                  />
                ) : (
                  <CryptoCard
                    crypto={crypto}
                    isLoading={false}
                    onRemove={handleRemoveCoin}
                    showRemoveButton={true}
                  />
                )}
              </ErrorBoundary>
            ))
          )}
        </div>

        {/* 投资理念文字 */}
        {!isLoading && cryptos.length > 0 && (
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-800 dark:via-slate-900 dark:to-gray-900 p-8 rounded-2xl border border-blue-200 dark:border-slate-700 relative overflow-hidden">
              {/* 星星效果 - 仅在深色模式显示 */}
              <div className="absolute inset-0 opacity-20 dark:opacity-30 hidden dark:block">
                <div className="absolute top-4 left-8 w-1 h-1 bg-white rounded-full animate-pulse"></div>
                <div className="absolute top-12 right-12 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-300"></div>
                <div className="absolute bottom-16 left-16 w-1 h-1 bg-white rounded-full animate-pulse delay-700"></div>
                <div className="absolute bottom-8 right-8 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-1000"></div>
                <div className="absolute top-20 left-1/3 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-500"></div>
                <div className="absolute bottom-12 right-1/4 w-1 h-1 bg-white rounded-full animate-pulse delay-200"></div>
              </div>
              <div className="relative z-10">
                <p className="text-xl font-serif italic text-gray-700 dark:text-gray-100 tracking-wide leading-relaxed">
                  "Our favorite holding period is forever."
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                  — Warren Buffett
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 空状态 */}
        {!isLoading && cryptos.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400">
              <p>暂无数据</p>
            </div>
          </div>
        )}
      </main>

      {/* 页脚 */}
      <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>数据来源: CoinGecko API | 每5分钟自动更新</p>
            <p className="mt-1">© 2024 CryptoTrack. Built with Next.js & Tailwind CSS</p>
          </div>
        </div>
      </footer>

      {/* 币种搜索弹窗 */}
      <CoinSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onAddCoin={handleAddCoin}
      />
      </div>
    </ExtensionGuard>
  );
}
