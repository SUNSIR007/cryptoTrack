'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import { CryptoCardProps, PricePoint } from '../types/crypto';
import { formatPrice, formatPercentage, formatMarketCap, formatSupply, fetchPriceHistory } from '../lib/api';
import { useDebounce, useMemoizedCalculation } from '../hooks/usePerformance';
import PriceChart from './PriceChart';
import ChartControls from './ChartControls';
import { TrendingUp, TrendingDown, BarChart3, X, Clock } from 'lucide-react';
import { isDefaultCoin } from '../lib/userCoins';

// 获取代币网络信息
function getTokenNetworkInfo(crypto: any): { network: string; networkName: string; color: string } | null {
  // 检查是否有DexScreener数据
  if (crypto.dexscreener_data?.chainId) {
    const chainId = crypto.dexscreener_data.chainId;
    if (chainId === 'solana') {
      return { network: 'SOL', networkName: 'Solana', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' };
    } else if (chainId === 'bsc') {
      return { network: 'BSC', networkName: 'BNB Chain', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' };
    } else if (chainId === 'ethereum') {
      return { network: 'ETH', networkName: 'Ethereum', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' };
    }
  }

  // 检查ID前缀 - DexScreener 代币
  if (crypto.id.startsWith('dex-')) {
    const parts = crypto.id.split('-');
    if (parts.length >= 2) {
      const chainId = parts[1];
      if (chainId === 'bsc') {
        return { network: 'BSC', networkName: 'BNB Chain', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' };
      } else if (chainId === 'ethereum') {
        return { network: 'ETH', networkName: 'Ethereum', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' };
      } else if (chainId === 'solana') {
        return { network: 'SOL', networkName: 'Solana', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' };
      }
    }
  }

  // 检查ID前缀 - GeckoTerminal 代币
  if (crypto.id.startsWith('gt-bsc-')) {
    return { network: 'BSC', networkName: 'BNB Chain', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' };
  }

  if (crypto.id.startsWith('gt-eth-')) {
    return { network: 'ETH', networkName: 'Ethereum', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' };
  }

  // 默认主流币种
  const mainnetTokens = ['bitcoin', 'ethereum', 'binancecoin', 'solana'];
  if (mainnetTokens.includes(crypto.id)) {
    return null; // 主流币种不显示网络标签
  }

  return null;
}

const CryptoCard = memo(function CryptoCard({ crypto, isLoading = false, onRemove, showRemoveButton = true }: CryptoCardProps) {
  const [chartPeriod, setChartPeriod] = useState('7');
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([]);
  const [chartLoading, setChartLoading] = useState(false);

  // 获取价格历史数据
  const loadPriceHistory = useCallback(async (period: string) => {
    if (!crypto?.id) return;

    setChartLoading(true);
    try {
      const history = await fetchPriceHistory(crypto.id, parseInt(period), crypto.current_price);
      setPriceHistory(history);
    } catch (error) {
      console.error('Failed to load price history:', error);
      setPriceHistory([]);
    } finally {
      setChartLoading(false);
    }
  }, [crypto?.id]);

  // 当组件加载或周期改变时加载数据
  useEffect(() => {
    if (crypto?.id) {
      loadPriceHistory(chartPeriod);
    }
  }, [chartPeriod, crypto?.id, loadPriceHistory]);

  // 防止无效数据渲染
  if (!crypto || (!isLoading && !crypto.id)) {
    return (
      <div className="bg-white dark:bg-black rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p>数据加载失败</p>
        </div>
      </div>
    );
  }

  // 防抖的图表周期变更
  const debouncedPeriodChange = useDebounce((period: string) => {
    setChartPeriod(period);
  }, 300);

  // 处理周期变化
  const handlePeriodChange = (period: string) => {
    debouncedPeriodChange(period);
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-black rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 animate-pulse">
        <div className="space-y-4">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
          <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
          <div className="space-y-2 mt-4">
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  // 使用记忆化计算优化性能
  const { isPositive, changeColor, formattedPrice, formattedMarketCap } = useMemoizedCalculation(() => {
    const isPositive = crypto.price_change_percentage_24h >= 0;
    return {
      isPositive,
      changeColor: isPositive
        ? 'text-green-600 dark:text-green-400'
        : 'text-red-600 dark:text-red-400',
      formattedPrice: formatPrice(crypto.current_price),
      formattedMarketCap: formatMarketCap(crypto.market_cap)
    };
  }, [crypto.price_change_percentage_24h, crypto.current_price, crypto.market_cap]);

  // 获取币种图标URL
  const getIconUrl = () => {
    console.log(`🔍 获取图标 URL for ${crypto.symbol}:`, {
      id: crypto.id,
      image: crypto.image,
      name: crypto.name
    });

    // 优先使用API返回的图标
    if (crypto.image && crypto.image.trim() !== '') {
      console.log(`✅ 使用 API 图标: ${crypto.image}`);
      return crypto.image;
    }

    // 备用图标映射
    const iconMap: { [key: string]: string } = {
      bitcoin: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
      ethereum: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
      solana: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
      binancecoin: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png'
    };

    // 如果是已知的主流币种，使用映射
    if (iconMap[crypto.id]) {
      console.log(`✅ 使用主流币种图标: ${iconMap[crypto.id]}`);
      return iconMap[crypto.id];
    }

    // 对于 DexScreener 代币，尝试从地址获取图标
    if (crypto.id.startsWith('dex-')) {
      const parts = crypto.id.split('-');
      if (parts.length >= 3) {
        const chainId = parts[1];
        const tokenAddress = parts.slice(2).join('-');

        let iconUrl = '';
        if (chainId === 'bsc') {
          iconUrl = `https://tokens.pancakeswap.finance/images/${tokenAddress}.png`;
        } else if (chainId === 'ethereum') {
          iconUrl = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${tokenAddress}/logo.png`;
        }

        if (iconUrl) {
          console.log(`✅ 使用 DexScreener 代币图标: ${iconUrl}`);
          return iconUrl;
        }
      }
    }

    // 对于 GeckoTerminal 代币，尝试从地址获取图标
    if (crypto.id.startsWith('gt-')) {
      const parts = crypto.id.split('-');
      if (parts.length >= 3) {
        const chainId = parts[1];
        const tokenAddress = parts.slice(2).join('-');

        let iconUrl = '';
        if (chainId === 'bsc') {
          iconUrl = `https://tokens.pancakeswap.finance/images/${tokenAddress}.png`;
        } else if (chainId === 'ethereum') {
          iconUrl = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${tokenAddress}/logo.png`;
        }

        if (iconUrl) {
          console.log(`✅ 使用 GeckoTerminal 代币图标: ${iconUrl}`);
          return iconUrl;
        }
      }
    }

    // 最后使用占位符
    const placeholderUrl = `https://via.placeholder.com/40x40/6366f1/ffffff?text=${crypto.symbol.charAt(0)}`;
    console.log(`⚠️ 使用占位符图标: ${placeholderUrl}`);
    return placeholderUrl;
  };

  return (
    <div className="bg-white dark:bg-black rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-102 relative group">
      {/* Mac风格关闭按钮 */}
      {showRemoveButton && onRemove && (
        <button
          onClick={() => onRemove(crypto.id)}
          className="absolute top-2 right-2 w-5 h-5 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 z-10 shadow-md group/button"
          title="移除此币种"
        >
          <X className="w-2.5 h-2.5 text-white opacity-0 group-hover/button:opacity-100 transition-opacity duration-200" />
        </button>
      )}

      <div className="space-y-4">
        {/* 币种名称和符号 */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 flex-wrap">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {crypto.symbol}
              </h3>
              {crypto.market_cap_rank > 0 && (
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
                  #{crypto.market_cap_rank}
                </span>
              )}
              {(() => {
                const networkInfo = getTokenNetworkInfo(crypto);
                return networkInfo ? (
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${networkInfo.color}`}
                    title={`${networkInfo.networkName} 网络`}
                  >
                    {networkInfo.network}
                  </span>
                ) : null;
              })()}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {crypto.name}
            </p>
          </div>

          {/* 币种图标 - 点击跳转到相应页面 */}
          <div
            className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all duration-200"
            onClick={() => {
              let targetUrl = '';
              let siteName = '';

              // 根据代币类型选择跳转目标
              if (crypto.id.startsWith('dex-')) {
                // DexScreener 代币跳转到 DexScreener
                const parts = crypto.id.split('-');
                if (parts.length >= 3) {
                  const chainId = parts[1];
                  const tokenAddress = parts.slice(2).join('-');
                  targetUrl = `https://dexscreener.com/${chainId}/${tokenAddress}`;
                  siteName = 'DexScreener';
                }
              } else if (crypto.id.startsWith('manual-') || crypto.id.startsWith('gt-')) {
                // 手动添加的代币或 GeckoTerminal 代币，尝试跳转到 DexScreener
                if (crypto.dexscreener_data?.pairAddress) {
                  const chainId = crypto.dexscreener_data.chainId || 'bsc';
                  targetUrl = `https://dexscreener.com/${chainId}/${crypto.dexscreener_data.pairAddress}`;
                  siteName = 'DexScreener';
                } else {
                  // 备用：跳转到 CoinGecko
                  const coinName = crypto.name.toLowerCase().replace(/\s+/g, '-');
                  targetUrl = `https://www.coingecko.com/en/coins/${coinName}`;
                  siteName = 'CoinGecko';
                }
              } else {
                // 主流币种跳转到 CoinGecko
                targetUrl = `https://www.coingecko.com/en/coins/${crypto.id}`;
                siteName = 'CoinGecko';
              }

              if (targetUrl) {
                window.open(targetUrl, '_blank', 'noopener,noreferrer');
              }
            }}
            title={`查看 ${crypto.name} 详情`}
          >
          <img
            src={getIconUrl()}
            alt={crypto.name}
            className="w-10 h-10 object-cover rounded-full"
            onLoad={(e) => {
              const target = e.target as HTMLImageElement;
              console.log(`✅ 图标加载成功: ${target.src}`);
            }}
            onError={(e) => {
              // 如果图片加载失败，尝试备用图标
              const target = e.target as HTMLImageElement;
              const currentSrc = target.src;

              console.log(`❌ 图标加载失败: ${currentSrc}`);

              // 如果当前是 PancakeSwap 图标失败，尝试 Trust Wallet
              if (currentSrc.includes('pancakeswap.finance') && (crypto.id.startsWith('dex-') || crypto.id.startsWith('gt-'))) {
                const parts = crypto.id.split('-');
                if (parts.length >= 3) {
                  const tokenAddress = parts.slice(2).join('-');
                  const trustWalletUrl = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/${tokenAddress}/logo.png`;
                  console.log(`🔄 尝试 Trust Wallet 图标: ${trustWalletUrl}`);
                  target.src = trustWalletUrl;
                  return;
                }
              }

              // 如果是 Trust Wallet 图标失败，尝试通用占位符
              if (currentSrc.includes('trustwallet') || currentSrc.includes('github.com')) {
                const placeholderUrl = `https://via.placeholder.com/40x40/6366f1/ffffff?text=${crypto.symbol.charAt(0)}`;
                console.log(`🔄 尝试占位符图标: ${placeholderUrl}`);
                target.src = placeholderUrl;
                return;
              }

              // 最终失败，显示首字母
              console.log(`💀 所有图标都失败，显示首字母: ${crypto.symbol.charAt(0)}`);
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent && !parent.querySelector('span')) {
                const span = document.createElement('span');
                span.className = 'text-gray-600 dark:text-gray-300 font-bold text-sm';
                span.textContent = crypto.symbol.charAt(0);
                parent.appendChild(span);
              }
            }}
          />
          </div>
        </div>

        {/* 价格 */}
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatPrice(crypto.current_price)}
          </p>
          {/* 24小时高低价 */}
          <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
            <span>高: {formatPrice(crypto.high_24h)}</span>
            <span>低: {formatPrice(crypto.low_24h)}</span>
          </div>
        </div>

        {/* 价格图表 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">价格走势</h4>
            <ChartControls
              selectedPeriod={chartPeriod}
              onPeriodChange={handlePeriodChange}
            />
          </div>

          {chartLoading ? (
            <div className="h-32 flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <PriceChart
              data={priceHistory}
              symbol={crypto.symbol}
              isPositive={crypto.price_change_percentage_24h >= 0}
              period={chartPeriod}
            />
          )}
        </div>

        {/* 价格变化 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col">
            <span className="text-xs text-gray-600 dark:text-gray-400">24h变化</span>
            <div className="flex items-center space-x-2">
              {crypto.price_change_percentage_24h >= 0 ? (
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400 font-bold" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400 font-bold" />
              )}
              <span className={`text-base font-bold ${changeColor}`}>
                {formatPercentage(crypto.price_change_percentage_24h)}
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-600 dark:text-gray-400">7d变化</span>
            <div className="flex items-center space-x-2">
              {crypto.price_change_percentage_7d >= 0 ? (
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400 font-bold" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400 font-bold" />
              )}
              <span className={`text-base font-bold ${crypto.price_change_percentage_7d >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatPercentage(crypto.price_change_percentage_7d)}
              </span>
            </div>
          </div>
        </div>

        {/* 市值和交易量 */}
        <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600 dark:text-gray-400">市值</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {formatMarketCap(crypto.market_cap)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600 dark:text-gray-400">24h交易量</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {formatMarketCap(crypto.total_volume)}
            </span>
          </div>
          {/* 只有当流通供应量大于0时才显示 */}
          {crypto.circulating_supply > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600 dark:text-gray-400">流通供应量</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {formatSupply(crypto.circulating_supply)}
              </span>
            </div>
          )}
        </div>

        {/* 刷新时间显示 */}
        <div className="pt-3 border-t border-gray-100 dark:border-gray-800 mt-4">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>
                更新于 {new Date(crypto.last_updated).toLocaleTimeString('zh-CN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </span>
            </div>

            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>实时数据</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
});

export default CryptoCard;
