import { CryptoCurrency, CoinGeckoResponse } from '../types/crypto';

const API_KEY = 'CG-yueBVpChwNZbHLKqQxBbqpwR';
const BASE_URL = 'https://api.coingecko.com/api/v3';

// 币种ID映射
const CRYPTO_IDS = {
  bitcoin: 'bitcoin',
  ethereum: 'ethereum',
  solana: 'solana',
  bnb: 'binancecoin' // BNB币
};

export async function fetchCryptoPrices(): Promise<CryptoCurrency[]> {
  try {
    const ids = Object.values(CRYPTO_IDS).join(',');
    const url = `${BASE_URL}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&x_cg_demo_api_key=${API_KEY}`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CoinGeckoResponse = await response.json();

    // 转换数据格式
    const cryptos: CryptoCurrency[] = Object.entries(data).map(([id, priceData]) => {
      const symbolMap: { [key: string]: string } = {
        bitcoin: 'BTC',
        ethereum: 'ETH',
        solana: 'SOL',
        binancecoin: 'BNB'
      };

      const nameMap: { [key: string]: string } = {
        bitcoin: 'Bitcoin',
        ethereum: 'Ethereum',
        solana: 'Solana',
        binancecoin: 'BNB'
      };

      return {
        id,
        symbol: symbolMap[id] || id.toUpperCase(),
        name: nameMap[id] || id,
        current_price: priceData.usd,
        price_change_percentage_24h: priceData.usd_24h_change || 0,
        last_updated: new Date().toISOString(),
      };
    });

    return cryptos;
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    throw error;
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
