'use client';

import { useState, useEffect } from 'react';
import { X, RefreshCw, Clock } from 'lucide-react';
import { CryptoCurrency } from '@/types/crypto';
import { searchAndGetTokenPrice } from '@/lib/api';

interface ManualCoinCardProps {
  crypto: CryptoCurrency;
  onRemove?: (coinId: string) => void;
  onUpdate?: (coinId: string, newData: CryptoCurrency) => void;
  showRemoveButton?: boolean;
}

export default function ManualCoinCard({ crypto, onRemove, onUpdate, showRemoveButton = true }: ManualCoinCardProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [tokenIcon, setTokenIcon] = useState<string>('');
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);
  const coinName = crypto.name;
  const isManualCoin = crypto.id.startsWith('manual-');
  const hasRealData = crypto.current_price > 0;

  // 判断是否为meme币（这里可以根据实际需求调整判断逻辑）
  const isMemeToken = coinName.toLowerCase().includes('meme') ||
                     coinName.toLowerCase().includes('pepe') ||
                     coinName.toLowerCase().includes('doge') ||
                     coinName.toLowerCase().includes('trump') ||
                     coinName.toLowerCase().includes('v2ex') ||
                     crypto.symbol?.toLowerCase().includes('meme') ||
                     crypto.symbol?.toLowerCase().includes('v2ex') ||
                     // 可以根据需要添加更多meme币的判断条件
                     false;

  if (!isManualCoin) {
    return null;
  }

  // 初始化刷新时间 - 如果有真实数据但没有刷新时间，设置为当前时间
  useEffect(() => {
    if (hasRealData && !lastRefreshTime) {
      setLastRefreshTime(new Date());
    }
  }, [hasRealData, lastRefreshTime]);

  // 获取代币图标
  useEffect(() => {
    const fetchTokenIcon = async () => {
      try {
        // 首先检查是否已有图标
        if (crypto.image) {
          setTokenIcon(crypto.image);
          return;
        }

        // 特殊处理一些知名代币
        const specialTokens: { [key: string]: string } = {
          'v2ex': 'https://cdn.v2ex.com/gravatar/c4ca4238a0b923820dcc509a6f75849b?s=64&d=retro',
          'trump': 'https://assets.coingecko.com/coins/images/33441/large/trump.png',
          'pepe': 'https://assets.coingecko.com/coins/images/29850/large/pepe-token.jpeg',
          'doge': 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png',
        };

        const tokenKey = coinName.toLowerCase();
        const symbolKey = (crypto.symbol || '').toLowerCase();

        // 检查币名或符号是否匹配特殊代币
        if (specialTokens[tokenKey] || specialTokens[symbolKey]) {
          const iconUrl = specialTokens[tokenKey] || specialTokens[symbolKey];
          console.log('使用特殊图标:', iconUrl);
          setTokenIcon(iconUrl);
          return;
        }

        // 尝试从多个来源获取图标
        const queries = [coinName, crypto.symbol].filter(Boolean);

        for (const query of queries) {
          try {
            // 使用无需API key的CoinGecko搜索
            const response = await fetch(
              `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`,
              {
                headers: {
                  'Accept': 'application/json',
                },
              }
            );

            if (response.ok) {
              const data = await response.json();
              console.log(`CoinGecko搜索 ${query} 结果:`, data);

              if (data.coins && data.coins.length > 0) {
                // 寻找最匹配的币种
                const exactMatch = data.coins.find((c: any) =>
                  c.name.toLowerCase() === query.toLowerCase() ||
                  c.symbol.toLowerCase() === query.toLowerCase()
                );

                const coin = exactMatch || data.coins[0]; // 如果没有精确匹配，使用第一个结果

                if (coin && (coin.thumb || coin.large || coin.small)) {
                  const iconUrl = coin.large || coin.thumb || coin.small;
                  console.log('找到CoinGecko图标:', iconUrl);
                  setTokenIcon(iconUrl);
                  return;
                }
              }
            }
          } catch (error) {
            console.log(`搜索 ${query} 图标失败:`, error);
          }
        }

        // 如果CoinGecko失败，尝试使用通用的加密货币图标服务
        const symbolLower = (crypto.symbol || coinName).toLowerCase();
        const fallbackIcons = [
          `https://cryptoicons.org/api/icon/${symbolLower}/200`,
          `https://assets.coincap.io/assets/icons/${symbolLower}@2x.png`,
          `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${symbolLower}.png`,
          // 为V2EX添加更多备用选项
          ...(tokenKey === 'v2ex' ? [
            'https://v2ex.com/static/img/v2ex@2x.png',
            'https://v2ex.com/static/img/icon_rayps_64.png',
            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTIiIGZpbGw9IiMzMzMiLz4KPHRleHQgeD0iMzIiIHk9IjM4IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VjwvdGV4dD4KPC9zdmc+'
          ] : [])
        ];

        for (const iconUrl of fallbackIcons) {
          try {
            const response = await fetch(iconUrl, { method: 'HEAD' });
            if (response.ok) {
              console.log('使用备用图标:', iconUrl);
              setTokenIcon(iconUrl);
              return;
            }
          } catch (error) {
            console.log('备用图标失败:', error);
          }
        }

      } catch (error) {
        console.error('获取代币图标失败:', error);
      }
    };

    if (hasRealData && !tokenIcon) {
      fetchTokenIcon();
    }
  }, [coinName, crypto.symbol, crypto.image, hasRealData, tokenIcon]);

  // 自动刷新逻辑 - 只有meme币才自动刷新
  useEffect(() => {
    if (!isMemeToken || !onUpdate) return;

    const refreshPrice = async () => {
      console.log(`开始自动刷新 ${coinName}...`);
      setIsRefreshing(true);
      try {
        const tokenName = coinName.toLowerCase();
        const newData = await searchAndGetTokenPrice(tokenName);
        console.log(`${coinName} 刷新结果:`, newData);

        if (newData) {
          const updatedData = {
            ...newData,
            id: crypto.id,
            name: crypto.name,
            symbol: newData.symbol || crypto.symbol || coinName.toUpperCase(),
          };
          console.log(`更新 ${coinName} 数据:`, updatedData);
          onUpdate(crypto.id, updatedData);
          setLastRefreshTime(new Date());
        }
      } catch (error) {
        console.error(`${coinName} 自动刷新价格失败:`, error);
      } finally {
        setIsRefreshing(false);
      }
    };

    // 设置1分钟间隔自动刷新（不立即执行，避免页面加载时的重复请求）
    const interval = setInterval(refreshPrice, 60000); // 60秒

    return () => {
      console.log(`清理 ${coinName} 的自动刷新定时器`);
      clearInterval(interval);
    };
  }, [isMemeToken, coinName, crypto.id, onUpdate]); // 移除isRefreshing依赖，避免无限循环



  const formatPrice = (price: number) => {
    if (price === 0) return 'N/A';
    if (price < 0.01) return price.toFixed(6);
    return price.toFixed(4);
  };

  const formatPercentage = (percentage: number) => {
    if (percentage === undefined || percentage === null) return 'N/A';
    if (percentage === 0) return '0.00%';
    const sign = percentage >= 0 ? '+' : '';
    return `${sign}${percentage.toFixed(2)}%`;
  };

  return (
    <div className="bg-white dark:bg-black rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 relative group">
      {/* Mac风格关闭按钮 */}
      {showRemoveButton && onRemove && (
        <button
          onClick={() => onRemove(crypto.id)}
          className="absolute top-2 right-2 w-5 h-5 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 z-10 shadow-md"
          title="移除此币种"
        >
          <X className="w-2.5 h-2.5 text-white opacity-0 hover:opacity-100 transition-opacity duration-200" />
        </button>
      )}

      <div className="space-y-4">
        {/* 币种信息和操作按钮 - 与左边卡片布局一致 */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {coinName}
              </h3>
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                {crypto.symbol || coinName.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {hasRealData ? 'DexScreener' : '等待数据'}
            </p>
          </div>

          {/* 币种头像 - 放在最右边 */}
          <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
            {tokenIcon ? (
              <img
                src={tokenIcon}
                alt={coinName}
                className="w-full h-full object-cover rounded-full"
                onError={() => setTokenIcon('')} // 如果图片加载失败，回退到文字
              />
            ) : (
              <span className="text-lg font-bold text-gray-600 dark:text-gray-300">
                {coinName.charAt(0)}
              </span>
            )}
          </div>
        </div>

        {/* 价格信息 - 简化版本与左边卡片一致 */}
        <div className="mb-4">
          <div className="flex items-baseline space-x-2 mb-1">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              ${hasRealData ? formatPrice(crypto.current_price) : '0.00'}
            </span>
          </div>
          <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
            <span>高: {(() => {
              // 优先使用DexScreener的24h最高价
              if (crypto.dexscreener_data?.priceChange?.h24 !== undefined && crypto.current_price) {
                const changePercent = crypto.dexscreener_data.priceChange.h24 / 100;
                const estimatedHigh = crypto.current_price * (1 + Math.abs(changePercent));
                return `$${formatPrice(estimatedHigh)}`;
              }
              // 其次使用标准的24h最高价
              if (hasRealData && crypto.high_24h) {
                return `$${formatPrice(crypto.high_24h)}`;
              }
              // 最后使用当前价格
              if (hasRealData && crypto.current_price) {
                return `$${formatPrice(crypto.current_price)}`;
              }
              return '--';
            })()}</span>
            <span>低: {(() => {
              // 优先使用DexScreener的24h最低价
              if (crypto.dexscreener_data?.priceChange?.h24 !== undefined && crypto.current_price) {
                const changePercent = crypto.dexscreener_data.priceChange.h24 / 100;
                const estimatedLow = crypto.current_price * (1 - Math.abs(changePercent));
                return `$${formatPrice(estimatedLow)}`;
              }
              // 其次使用标准的24h最低价
              if (hasRealData && crypto.low_24h) {
                return `$${formatPrice(crypto.low_24h)}`;
              }
              // 最后使用当前价格
              if (hasRealData && crypto.current_price) {
                return `$${formatPrice(crypto.current_price)}`;
              }
              return '--';
            })()}</span>
          </div>
        </div>

        {/* 项目简介 */}
        <div className="mb-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">项目简介</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              {coinName === 'V2EX'
                ? 'V2EX是一个关于分享和探索的地方，汇聚了众多技术爱好者和创意工作者。这里有最新的技术讨论、创意分享和思维碰撞。'
                : `${coinName}是一个新兴的数字资产项目，致力于为用户提供创新的区块链解决方案和优质的社区体验。`
              }
              {isMemeToken && (
                <span className="block mt-1 text-blue-600 dark:text-blue-400 text-xs">
                  🔄 Meme币 - 自动刷新中
                </span>
              )}
            </p>
          </div>
        </div>

        {/* 基础统计 - 简化版本 */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">24h变化</span>
            <span className={`font-medium ${
              hasRealData && crypto.price_change_percentage_24h >= 0
                ? 'text-green-600 dark:text-green-400'
                : hasRealData && crypto.price_change_percentage_24h < 0
                ? 'text-red-600 dark:text-red-400'
                : 'text-gray-400'
            }`}>
              {(() => {
                // 优先使用DexScreener的24h变化数据
                if (crypto.dexscreener_data?.priceChange?.h24 !== undefined) {
                  return formatPercentage(crypto.dexscreener_data.priceChange.h24);
                }
                // 其次使用标准的24h变化数据
                if (hasRealData && crypto.price_change_percentage_24h !== undefined) {
                  return formatPercentage(crypto.price_change_percentage_24h);
                }
                return '--';
              })()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">流动性</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {(() => {
                // 显示流动性而不是7d变化，因为DexScreener通常没有7d数据
                if (crypto.dexscreener_data?.liquidity && crypto.dexscreener_data.liquidity > 0) {
                  return `$${(crypto.dexscreener_data.liquidity / 1000).toFixed(0)}K`;
                }
                return '--';
              })()}
            </span>
          </div>
        </div>

        {/* 市场数据 - 简化版本，与左边卡片一致 */}
        {hasRealData && (
          <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600 dark:text-gray-400">市值</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {(() => {
                  // 优先使用DexScreener的FDV数据
                  if (crypto.dexscreener_data?.fdv && crypto.dexscreener_data.fdv > 0) {
                    return `$${(crypto.dexscreener_data.fdv / 1000000).toFixed(1)}M`;
                  }
                  // 其次使用market_cap
                  if (crypto.market_cap > 0) {
                    return `$${(crypto.market_cap / 1000000).toFixed(1)}M`;
                  }
                  return '--';
                })()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600 dark:text-gray-400">24h交易量</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {(() => {
                  // 优先使用DexScreener的volume数据
                  if (crypto.dexscreener_data?.volume?.h24 && crypto.dexscreener_data.volume.h24 > 0) {
                    return `$${(crypto.dexscreener_data.volume.h24 / 1000).toFixed(0)}K`;
                  }
                  // 其次使用total_volume
                  if (crypto.total_volume > 0) {
                    return `$${(crypto.total_volume / 1000000).toFixed(1)}M`;
                  }
                  return '--';
                })()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600 dark:text-gray-400">24h交易次数</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {(() => {
                  // 显示24h交易次数
                  if (crypto.dexscreener_data?.txns?.h24) {
                    const buys = crypto.dexscreener_data.txns.h24.buys || 0;
                    const sells = crypto.dexscreener_data.txns.h24.sells || 0;
                    return `${buys + sells}`;
                  }
                  return '--';
                })()}
              </span>
            </div>

            {/* Meme币额外信息 */}
            {isMemeToken && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600 dark:text-gray-400">买卖比例</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {(() => {
                      if (crypto.dexscreener_data?.txns?.h24) {
                        const buys = crypto.dexscreener_data.txns.h24.buys || 0;
                        const sells = crypto.dexscreener_data.txns.h24.sells || 0;
                        const total = buys + sells;
                        if (total > 0) {
                          const buyRatio = ((buys / total) * 100).toFixed(0);
                          return `${buyRatio}% 买入`;
                        }
                      }
                      return '--';
                    })()}
                  </span>
                </div>


              </>
            )}

          </div>
        )}

        {/* 刷新时间显示 */}
        <div className="pt-3 border-t border-gray-100 dark:border-gray-800 mt-4">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>
                {(() => {
                  if (!hasRealData) {
                    return '暂无数据';
                  }

                  if (lastRefreshTime) {
                    return `更新于 ${lastRefreshTime.toLocaleTimeString('zh-CN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}`;
                  }

                  // 如果有数据但没有刷新时间，使用crypto的last_updated
                  if (crypto.last_updated) {
                    const updateTime = new Date(crypto.last_updated);
                    return `更新于 ${updateTime.toLocaleTimeString('zh-CN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}`;
                  }

                  return '数据已加载';
                })()}
              </span>
            </div>

            {isMemeToken && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>自动刷新</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
