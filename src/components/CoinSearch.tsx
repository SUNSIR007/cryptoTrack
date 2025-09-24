'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Plus, X } from 'lucide-react';
import { SearchResult } from '@/types/crypto';
import { searchCoins, searchNewCoins, getMemeCoinSuggestions, searchAndGetTokenPrice, searchMultiChainTokens } from '@/lib/api';
import { apiCache } from '@/lib/apiCache';

// 检测代币地址类型
function detectTokenAddressType(address: string): { isValid: boolean; network?: string; networkName?: string } {
  // Solana地址
  if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) {
    return { isValid: true, network: 'solana', networkName: 'Solana' };
  }

  // EVM地址（以太坊、BSC等）
  if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return { isValid: true, network: 'evm', networkName: 'EVM (Ethereum/BSC)' };
  }

  return { isValid: false };
}

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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 防抖搜索
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowSuggestions(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      setError(null);

      try {
        // 检测代币地址类型
        const addressInfo = detectTokenAddressType(query.trim());

        if (addressInfo.isValid) {
          console.log(`检测到${addressInfo.networkName}代币地址，尝试获取代币信息...`);

          // 尝试获取代币信息
          console.log(`🔍 尝试获取代币信息: ${query.trim()}`);
          const tokenData = await searchAndGetTokenPrice(query.trim());
          console.log('🔍 searchAndGetTokenPrice 返回结果:', tokenData);

          if (tokenData) {
            // 将代币数据转换为搜索结果格式
            const tokenName = tokenData.name || tokenData.symbol || 'Unknown Token';
            const tokenResult = {
              id: tokenData.id, // 使用从API获取的原始ID
              name: tokenName,
              symbol: tokenData.symbol || 'UNKNOWN',
              thumb: tokenData.image || '',
              market_cap_rank: tokenData.market_cap_rank || 0
            };

            console.log('成功获取代币信息:', tokenResult);
            setResults([tokenResult]);
            setShowSuggestions(false);
            setError(null);
            setIsLoading(false);
            return;
          } else {
            console.log('无法获取代币信息');
            // 不显示错误，而是提供手动添加选项
            setResults([]);
            setShowSuggestions(false);
            setError(null);
            setIsLoading(false);
            return;
          }
        }

        // 清除相关的搜索缓存以确保获取最新结果
        apiCache.clearByPrefix(`search-${query.toLowerCase()}`);

        // 首先尝试多链搜索（包括BSC）
        let searchResults = await searchMultiChainTokens(query);
        console.log(`多链搜索 "${query}" 的结果:`, searchResults);

        // 如果多链搜索没有结果，尝试新币种搜索
        if (searchResults.length === 0) {
          console.log('多链搜索无结果，尝试新币种搜索...');
          const newCoinResults = await searchNewCoins(query);
          if (newCoinResults.length > 0) {
            searchResults = newCoinResults;
            console.log('新币种搜索结果:', newCoinResults);
          }
        }

        // 如果还是没有结果，显示meme币建议
        if (searchResults.length === 0) {
          const suggestions = getMemeCoinSuggestions(query);
          if (suggestions.length > 0) {
            searchResults = suggestions;
            setShowSuggestions(true);
          } else {
            setShowSuggestions(false);
          }
        } else {
          setShowSuggestions(false);
        }

        setResults(searchResults);
      } catch (err) {
        console.error('搜索失败:', err);
        setError('搜索失败，请稍后重试');
        setResults([]);
        setShowSuggestions(false);
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
    // 检查是否是有效的币种ID
    if (!coinId || coinId === '') {
      setError('无法添加此币种，请尝试其他搜索词');
      return;
    }

    onAddCoin(coinId);
    setQuery('');
    setResults([]);
    setShowSuggestions(false);
    onClose();
  };

  // 手动添加币种（用于未收录的币种）
  const handleManualAdd = async () => {
    if (!query.trim()) {
      setError('请输入币种名称或代币地址');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 检测代币地址类型
      const addressInfo = detectTokenAddressType(query.trim());

      if (addressInfo.isValid) {
        console.log(`检测到${addressInfo.networkName}代币地址，尝试获取代币信息...`);

        // 尝试获取代币信息
        const tokenData = await searchAndGetTokenPrice(query.trim());

        if (tokenData) {
          // 使用代币的真实名称创建ID
          const tokenName = tokenData.name || tokenData.symbol || 'Unknown';
          const manualCoinId = `manual-${tokenName.toLowerCase().replace(/\s+/g, '-')}`;

          console.log(`成功获取代币信息: ${tokenName}`);
          onAddCoin(manualCoinId);
        } else {
          // 如果无法获取代币信息，使用地址的简化版本
          const shortAddress = `${query.slice(0, 6)}...${query.slice(-4)}`;
          const manualCoinId = `manual-${shortAddress}`;
          console.log('无法获取代币信息，使用简化地址');
          onAddCoin(manualCoinId);
        }
      } else {
        // 普通币种名称
        const manualCoinId = `manual-${query.toLowerCase().replace(/\s+/g, '-')}`;
        onAddCoin(manualCoinId);
      }

      setQuery('');
      setResults([]);
      setShowSuggestions(false);
      onClose();
    } catch (error) {
      console.error('手动添加币种失败:', error);
      setError('添加失败，请检查输入的币种名称或地址');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        ref={searchRef}
        className="w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Google风格的搜索框 */}
        <div className="relative">
          <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索币种名称、符号或代币地址（支持 Solana、BSC、Ethereum）..."
            className="w-full pl-14 pr-14 py-4 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-800 text-base text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 shadow-lg hover:shadow-xl"
            autoFocus
          />
          {isLoading && (
            <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-500"></div>
            </div>
          )}
        </div>

        {/* 搜索结果 - 简化版本 */}
        {(results.length > 0 || (!isLoading && !error && query && results.length === 0)) && (
          <div className="mt-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden max-h-80 overflow-y-auto">
            {results.length > 0 ? (
              <div>
                {results.map((coin) => (
                  <button
                    key={coin.id}
                    onClick={() => handleAddCoin(coin.id)}
                    className="w-full flex items-center space-x-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 border-b border-gray-100 dark:border-gray-700 last:border-b-0 group"
                  >
                    <div className="relative">
                      <img
                        src={coin.thumb}
                        alt={coin.name}
                        className="w-10 h-10 rounded-full shadow-sm"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {coin.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {coin.symbol}
                      </div>
                    </div>
                    <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 transition-colors">
                      <Plus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center">
                <button
                  onClick={handleManualAdd}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium transition-colors"
                >
                  添加 "{query}" 到监控列表
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
