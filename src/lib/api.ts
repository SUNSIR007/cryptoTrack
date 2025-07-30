import { CryptoCurrency, CoinGeckoResponse, CoinGeckoDetailedResponse, PricePoint, SearchResult } from '../types/crypto';
import { apiCache, requestDeduplicator } from './apiCache';

// 防止与浏览器扩展冲突
const CryptoTrackAPI = {
  API_KEY: 'CG-yueBVpChwNZbHLKqQxBbqpwR',
  BASE_URL: 'https://api.coingecko.com/api/v3'
};

// 币种ID映射
const SUPPORTED_CRYPTO_IDS = {
  bitcoin: 'bitcoin',
  ethereum: 'ethereum',
  solana: 'solana',
  bnb: 'binancecoin' // BNB币
};

export async function fetchCryptoPrices(coinIds?: string[], currency: string = 'usd'): Promise<CryptoCurrency[]> {
  const ids = coinIds ? coinIds.join(',') : Object.values(SUPPORTED_CRYPTO_IDS).join(',');
  const cacheKey = `crypto-prices-${ids}-${currency}`;

  // 检查缓存
  const cachedData = apiCache.get<CryptoCurrency[]>(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  // 使用请求去重
  return requestDeduplicator.deduplicate(cacheKey, async () => {
    try {
      // 使用更详细的API端点获取完整数据
      const url = `${CryptoTrackAPI.BASE_URL}/coins/markets?vs_currency=${currency}&ids=${ids}&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h,7d&x_cg_demo_api_key=${CryptoTrackAPI.API_KEY}`;

      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

    // 转换数据格式
    const cryptos: CryptoCurrency[] = data.map((coin: any) => {
      return {
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        image: coin.image,
        current_price: coin.current_price || 0,
        price_change_percentage_24h: coin.price_change_percentage_24h || 0,
        price_change_percentage_7d: coin.price_change_percentage_7d_in_currency || 0,
        market_cap: coin.market_cap || 0,
        market_cap_rank: coin.market_cap_rank || 0,
        total_volume: coin.total_volume || 0,
        high_24h: coin.high_24h || 0,
        low_24h: coin.low_24h || 0,
        circulating_supply: coin.circulating_supply || 0,
        total_supply: coin.total_supply || 0,
        last_updated: coin.last_updated || new Date().toISOString(),
      };
    });

    // 缓存结果
    apiCache.set(cacheKey, cryptos, 2 * 60 * 1000); // 缓存2分钟
    return cryptos;
    } catch (error) {
      console.error('Error fetching crypto prices:', error);
      throw error;
    }
  });
}

// 获取历史价格数据
export async function fetchPriceHistory(coinId: string, days: number = 7): Promise<PricePoint[]> {
  try {
    const url = `${CryptoTrackAPI.BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=${days <= 1 ? 'hourly' : 'daily'}&x_cg_demo_api_key=${CryptoTrackAPI.API_KEY}`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // 转换价格数据格式
    const priceHistory: PricePoint[] = data.prices.map((price: [number, number]) => ({
      timestamp: price[0],
      price: price[1]
    }));

    return priceHistory;
  } catch (error) {
    console.error('Error fetching price history:', error);
    return [];
  }
}

// 格式化价格显示
export function formatPrice(price: number): string {
  if (price >= 1) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  } else {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 4,
      maximumFractionDigits: 6,
    }).format(price);
  }
}

// 格式化百分比变化
export function formatPercentage(percentage: number): string {
  const sign = percentage >= 0 ? '+' : '';
  return `${sign}${percentage.toFixed(2)}%`;
}

// 格式化市值和交易量
export function formatMarketCap(value: number): string {
  if (value >= 1e12) {
    return `$${(value / 1e12).toFixed(2)}T`;
  } else if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`;
  } else if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`;
  } else if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(2)}K`;
  } else {
    return `$${value.toFixed(2)}`;
  }
}

// 格式化供应量
export function formatSupply(value: number): string {
  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(2)}B`;
  } else if (value >= 1e6) {
    return `${(value / 1e6).toFixed(2)}M`;
  } else if (value >= 1e3) {
    return `${(value / 1e3).toFixed(2)}K`;
  } else {
    return value.toFixed(0);
  }
}

// 搜索币种
export async function searchCoins(query: string): Promise<SearchResult[]> {
  if (!query.trim()) {
    return [];
  }

  try {
    const response = await fetch(
      `${CryptoTrackAPI.BASE_URL}/search?query=${encodeURIComponent(query)}&x_cg_demo_api_key=${CryptoTrackAPI.API_KEY}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`搜索失败: ${response.status}`);
    }

    const data = await response.json();

    // 只返回前10个结果，并过滤掉没有市值排名的币种
    return data.coins
      .filter((coin: any) => coin.market_cap_rank !== null)
      .slice(0, 10)
      .map((coin: any) => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        thumb: coin.thumb,
        market_cap_rank: coin.market_cap_rank
      }));
  } catch (error) {
    console.error('搜索币种失败:', error);
    throw error;
  }
}
