import { CryptoCurrency, CoinGeckoResponse, CoinGeckoDetailedResponse, PricePoint, SearchResult } from '../types/crypto';
import { apiCache, requestDeduplicator } from './apiCache';

// 防止与浏览器扩展冲突
const CryptoTrackAPI = {
  API_KEY: process.env.NEXT_PUBLIC_COINGECKO_API_KEY || process.env.COINGECKO_API_KEY || '',
  BASE_URL: 'https://api.coingecko.com/api/v3'
};

// 检查API密钥是否配置
function checkApiKey(): boolean {
  if (!CryptoTrackAPI.API_KEY) {
    console.error('❌ CoinGecko API密钥未配置！');
    console.error('请在环境变量中设置 NEXT_PUBLIC_COINGECKO_API_KEY 或 COINGECKO_API_KEY');
    console.error('获取免费API密钥: https://www.coingecko.com/en/api');
    return false;
  }
  return true;
}

// DexScreener API for Solana/Pump.fun tokens
const DexScreenerAPI = {
  BASE_URL: 'https://api.dexscreener.com/latest',
  SEARCH: 'https://api.dexscreener.com/latest/dex/search',
  SOLANA_PAIRS: 'https://api.dexscreener.com/latest/dex/pairs/solana'
};

// Jupiter API for Solana token prices (backup)
const JupiterAPI = {
  PRICE: 'https://price.jup.ag/v4/price',
  TOKEN_LIST: 'https://token.jup.ag/all'
};

// Birdeye API for Solana token prices (alternative)
const BirdeyeAPI = {
  BASE_URL: 'https://public-api.birdeye.so',
  PRICE: 'https://public-api.birdeye.so/defi/price'
};

// GeckoTerminal API for multi-chain DEX data
const GeckoTerminalAPI = {
  BASE_URL: 'https://api.geckoterminal.com/api/v2',
  NETWORKS: 'https://api.geckoterminal.com/api/v2/networks',
  SEARCH: 'https://api.geckoterminal.com/api/v2/search/pools'
};

// 币种ID映射
const SUPPORTED_CRYPTO_IDS = {
  bitcoin: 'bitcoin',
  ethereum: 'ethereum',
  solana: 'solana',
  bnb: 'binancecoin' // BNB币
};

// 支持的区块链网络配置
const SUPPORTED_NETWORKS = {
  ethereum: {
    id: 'eth',
    name: 'Ethereum',
    coingecko_id: 'ethereum',
    address_pattern: /^0x[a-fA-F0-9]{40}$/,
    native_token: 'ethereum'
  },
  bsc: {
    id: 'bsc',
    name: 'BNB Chain',
    coingecko_id: 'binance-smart-chain',
    address_pattern: /^0x[a-fA-F0-9]{40}$/,
    native_token: 'binancecoin'
  },
  solana: {
    id: 'solana',
    name: 'Solana',
    coingecko_id: 'solana',
    address_pattern: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
    native_token: 'solana'
  }
};

export async function fetchCryptoPrices(coinIds?: string[], currency: string = 'usd'): Promise<CryptoCurrency[]> {
  // 检查API密钥
  if (!checkApiKey()) {
    throw new Error('CoinGecko API密钥未配置，请设置环境变量 NEXT_PUBLIC_COINGECKO_API_KEY');
  }

  if (!coinIds || coinIds.length === 0) {
    coinIds = Object.values(SUPPORTED_CRYPTO_IDS);
  }

  // 分离手动添加的币种和正常币种
  const manualCoins = coinIds.filter(id => id.startsWith('manual-'));
  const normalCoins = coinIds.filter(id => !id.startsWith('manual-'));

  const results: CryptoCurrency[] = [];

  // 处理正常币种
  if (normalCoins.length > 0) {
    const ids = normalCoins.join(',');
    const cacheKey = `crypto-prices-${ids}-${currency}`;

    // 检查缓存
    const cachedData = apiCache.get<CryptoCurrency[]>(cacheKey);
    if (cachedData) {
      results.push(...cachedData);
    } else {
      // 使用请求去重
      const normalData = await requestDeduplicator.deduplicate(cacheKey, async () => {
        try {
          // 使用更详细的API端点获取完整数据
          const url = `${CryptoTrackAPI.BASE_URL}/coins/markets?vs_currency=${currency}&ids=${ids}&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=24h,7d&x_cg_demo_api_key=${CryptoTrackAPI.API_KEY}`;

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

      results.push(...normalData);
    }
  }

  // 处理手动添加的币种 - 尝试从DexScreener获取实际价格
  if (manualCoins.length > 0) {
    const manualDataPromises = manualCoins.map(async (coinId) => {
      const coinName = coinId.replace('manual-', '').replace(/-/g, ' ');

      // 尝试从DexScreener获取实际价格数据
      try {
        const dexData = await searchAndGetTokenPrice(coinName);
        if (dexData) {
          // 如果找到了实际数据，使用它但保持原始ID
          return {
            ...dexData,
            id: coinId, // 保持手动添加的ID格式
            name: coinName.toUpperCase(),
          };
        }
      } catch (error) {
        console.log(`无法从DexScreener获取 ${coinName} 的价格:`, error);
      }

      // 如果DexScreener也没有数据，返回占位数据
      return {
        id: coinId,
        symbol: coinName.toUpperCase(),
        name: coinName.toUpperCase(),
        image: '',
        current_price: 0,
        price_change_percentage_24h: 0,
        price_change_percentage_7d: 0,
        market_cap: 0,
        market_cap_rank: 0,
        total_volume: 0,
        high_24h: 0,
        low_24h: 0,
        circulating_supply: 0,
        total_supply: 0,
        last_updated: new Date().toISOString(),
      };
    });

    const manualData = await Promise.all(manualDataPromises);
    results.push(...manualData);
  }

  return results;
}

// 获取历史价格数据
export async function fetchPriceHistory(coinId: string, days: number = 7): Promise<PricePoint[]> {
  // 检查API密钥
  if (!checkApiKey()) {
    console.error('无法获取历史价格数据：API密钥未配置');
    return [];
  }

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

  const cacheKey = `search-${query.toLowerCase()}`;

  // 检查缓存
  const cachedResults = apiCache.get<SearchResult[]>(cacheKey);
  if (cachedResults) {
    return cachedResults;
  }

  try {
    // 使用CoinGecko搜索API
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

    // 处理搜索结果
    let results: SearchResult[] = [];

    if (data.coins && data.coins.length > 0) {
      results = data.coins
        .slice(0, 20)
        .map((coin: any) => ({
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol.toUpperCase(),
          thumb: coin.thumb,
          market_cap_rank: coin.market_cap_rank || 0
        }));
    }

    // 如果没有找到结果，直接返回空数组
    if (results.length === 0) {
      console.log(`未找到 "${query}" 的搜索结果，可能是以下原因：`);
      console.log('1. 该币种未被CoinGecko收录');
      console.log('2. 该币种是新发布的meme币');
      console.log('3. 搜索关键词不匹配');

      // 直接返回空数组，让前端组件处理
      results = [];
    }

    // 缓存结果（较短时间，因为新币种可能会被快速添加）
    apiCache.set(cacheKey, results, 5 * 60 * 1000); // 5分钟缓存

    return results;
  } catch (error) {
    console.error('搜索币种失败:', error);

    // 返回空数组，让前端组件处理错误
    return [];
  }
}

// 专门搜索新币种和meme币的功能
export async function searchNewCoins(query: string): Promise<SearchResult[]> {
  if (!query.trim()) {
    return [];
  }

  try {
    // 尝试使用CoinGecko的coins/list API来搜索更全面的币种列表
    const response = await fetch(
      `${CryptoTrackAPI.BASE_URL}/coins/list?x_cg_demo_api_key=${CryptoTrackAPI.API_KEY}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`获取币种列表失败: ${response.status}`);
    }

    const coinsList = await response.json();
    const queryLower = query.toLowerCase();

    // 在完整列表中搜索匹配的币种
    const matches = coinsList
      .filter((coin: any) =>
        coin.name.toLowerCase().includes(queryLower) ||
        coin.symbol.toLowerCase().includes(queryLower) ||
        coin.id.toLowerCase().includes(queryLower)
      )
      .slice(0, 10)
      .map((coin: any) => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        thumb: '', // coins/list API不包含图片
        market_cap_rank: 0 // 新币种通常没有排名
      }));

    return matches;
  } catch (error) {
    console.error('搜索新币种失败:', error);
    return [];
  }
}

// 手动添加一些知名的meme币种ID（如果CoinGecko有收录的话）
export const POPULAR_MEME_COINS = [
  { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE' },
  { id: 'shiba-inu', name: 'Shiba Inu', symbol: 'SHIB' },
  { id: 'pepe', name: 'Pepe', symbol: 'PEPE' },
  { id: 'floki', name: 'FLOKI', symbol: 'FLOKI' },
  { id: 'bonk', name: 'Bonk', symbol: 'BONK' },
  { id: 'dogwifhat', name: 'dogwifhat', symbol: 'WIF' },
  { id: 'book-of-meme', name: 'Book of Meme', symbol: 'BOME' },
  { id: 'popcat', name: 'Popcat', symbol: 'POPCAT' },
  { id: 'mog-coin', name: 'Mog Coin', symbol: 'MOG' },
  { id: 'cat-in-a-dogs-world', name: 'Cat in a Dogs World', symbol: 'MEW' },
];

// 特殊的Pump.fun代币映射（已知的代币地址）
export const PUMP_FUN_TOKENS: { [key: string]: string } = {
  'v2ex': '9raUVuzeWUk53co63M4WXLWPWE4Xc6Lpn7RS9dnkpump', // V2EX代币地址
  // 可以添加更多已知的Pump.fun代币
};

// 获取热门meme币的建议
export function getMemeCoinSuggestions(query: string): SearchResult[] {
  if (!query.trim()) {
    return [];
  }

  const queryLower = query.toLowerCase();
  return POPULAR_MEME_COINS
    .filter(coin =>
      coin.name.toLowerCase().includes(queryLower) ||
      coin.symbol.toLowerCase().includes(queryLower)
    )
    .map(coin => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      thumb: '',
      market_cap_rank: 0
    }));
}

// DexScreener API functions for Solana/Pump.fun tokens
export async function searchTokenOnDexScreener(query: string): Promise<any[]> {
  if (!query.trim()) {
    return [];
  }

  const cacheKey = `dexscreener-search-${query.toLowerCase()}`;

  // 检查缓存
  const cachedResults = apiCache.get<any[]>(cacheKey);
  if (cachedResults) {
    return cachedResults;
  }

  try {
    const response = await fetch(`${DexScreenerAPI.SEARCH}?q=${encodeURIComponent(query)}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`DexScreener搜索失败: ${response.status}`);
    }

    const data = await response.json();

    // 过滤Solana链上的代币
    const solanaTokens = data.pairs?.filter((pair: any) =>
      pair.chainId === 'solana' &&
      pair.baseToken?.name?.toLowerCase().includes(query.toLowerCase())
    ) || [];

    // 缓存结果
    apiCache.set(cacheKey, solanaTokens, 2 * 60 * 1000); // 2分钟缓存

    return solanaTokens;
  } catch (error) {
    console.error('DexScreener搜索失败:', error);
    return [];
  }
}

// 从DexScreener获取代币价格数据
export async function getTokenPriceFromDexScreener(tokenAddress: string): Promise<CryptoCurrency | null> {
  if (!tokenAddress) {
    return null;
  }

  const cacheKey = `dexscreener-price-${tokenAddress}`;

  // 检查缓存
  const cachedData = apiCache.get<CryptoCurrency>(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    // 使用正确的DexScreener API端点 - 新版本API
    const response = await fetch(`https://api.dexscreener.com/tokens/v1/solana/${tokenAddress}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`DexScreener API响应: ${response.status}`, errorText);
      return null;
    }

    const data = await response.json();
    console.log('DexScreener响应数据:', JSON.stringify(data, null, 2));

    // 新API返回的是数组格式
    if (!Array.isArray(data) || data.length === 0) {
      console.log('DexScreener未找到交易对');
      console.log('响应结构:', typeof data, Array.isArray(data) ? `数组长度: ${data.length}` : Object.keys(data));
      return null;
    }

    // 取第一个交易对（通常是流动性最好的）
    const pair = data[0];
    const token = pair.baseToken;

    // 转换为我们的数据格式
    const cryptoData: CryptoCurrency = {
      id: `dex-${token.address}`,
      symbol: token.symbol?.toUpperCase() || 'UNKNOWN',
      name: token.name || token.symbol?.toUpperCase() || 'Unknown Token',
      image: pair.info?.imageUrl || '', // 使用DexScreener提供的图标
      current_price: parseFloat(pair.priceUsd) || 0,
      price_change_percentage_24h: parseFloat(pair.priceChange?.h24) || 0,
      price_change_percentage_7d: 0, // DexScreener没有7天数据
      market_cap: parseFloat(pair.marketCap) || 0,
      market_cap_rank: 0,
      total_volume: parseFloat(pair.volume?.h24) || 0,
      high_24h: 0, // DexScreener API不提供24h最高价，设为0
      low_24h: 0, // DexScreener API不提供24h最低价，设为0
      circulating_supply: 0,
      total_supply: 0,
      last_updated: new Date().toISOString(),
      // 添加DexScreener特有的数据
      dexscreener_data: {
        pairAddress: pair.pairAddress,
        dexId: pair.dexId,
        url: pair.url,
        liquidity: parseFloat(pair.liquidity?.usd) || 0,
        fdv: parseFloat(pair.fdv) || 0,
        pairCreatedAt: pair.pairCreatedAt,
        txns: pair.txns,
        volume: pair.volume,
        priceChange: pair.priceChange,
        quoteToken: pair.quoteToken,
        chainId: pair.chainId,
        info: pair.info, // 包含图标和其他信息
      }
    };

    // 缓存结果
    apiCache.set(cacheKey, cryptoData, 1 * 60 * 1000); // 1分钟缓存（更频繁更新）

    return cryptoData;
  } catch (error) {
    console.error('DexScreener价格获取失败:', error);
    return null;
  }
}

// 从Jupiter获取代币价格（备用方案）
export async function getTokenPriceFromJupiter(tokenAddress: string): Promise<CryptoCurrency | null> {
  try {
    const response = await fetch(`https://price.jup.ag/v4/price?ids=${tokenAddress}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (!data.data || !data.data[tokenAddress]) {
      return null;
    }

    const priceData = data.data[tokenAddress];

    return {
      id: `jupiter-${tokenAddress}`,
      symbol: 'UNKNOWN',
      name: 'Unknown Token',
      image: '',
      current_price: priceData.price || 0,
      price_change_percentage_24h: 0,
      price_change_percentage_7d: 0,
      market_cap: 0,
      market_cap_rank: 0,
      total_volume: 0,
      high_24h: priceData.price || 0,
      low_24h: priceData.price || 0,
      circulating_supply: 0,
      total_supply: 0,
      last_updated: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Jupiter价格获取失败:', error);
    return null;
  }
}

// 检测是否为Solana代币地址
function isSolanaTokenAddress(input: string): boolean {
  // Solana代币地址通常是44个字符的base58编码字符串
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(input);
}

// 检测代币地址所属的网络
function detectTokenNetwork(address: string): string | null {
  for (const [networkKey, network] of Object.entries(SUPPORTED_NETWORKS)) {
    if (network.address_pattern.test(address)) {
      return networkKey;
    }
  }
  return null;
}

// 检查是否为EVM兼容地址（以太坊、BSC等）
function isEVMTokenAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// 搜索多链代币（包括BSC）
export async function searchMultiChainTokens(query: string): Promise<SearchResult[]> {
  const results: SearchResult[] = [];

  try {
    // 首先尝试标准的CoinGecko搜索
    const coinGeckoResults = await searchCoins(query);
    results.push(...coinGeckoResults);

    // 如果CoinGecko结果不足，尝试GeckoTerminal搜索BSC代币
    if (results.length < 5) {
      const bscResults = await searchTokenOnGeckoTerminal(query, 'bsc');

      // 转换GeckoTerminal结果为SearchResult格式
      const convertedResults = bscResults.slice(0, 5 - results.length).map((pool: any) => {
        const token = pool.attributes?.base_token;
        return {
          id: `gt-bsc-${token?.address || 'unknown'}`,
          name: token?.name || 'Unknown Token',
          symbol: (token?.symbol || 'UNKNOWN').toUpperCase(),
          thumb: token?.image_url || '',
          market_cap_rank: 0
        };
      });

      results.push(...convertedResults);
    }

    return results;
  } catch (error) {
    console.error('多链代币搜索失败:', error);
    return results; // 返回已有结果，即使出错
  }
}

// 从 GeckoTerminal 搜索代币
export async function searchTokenOnGeckoTerminal(query: string, network?: string): Promise<any[]> {
  const cacheKey = `geckoterminal-search-${query.toLowerCase()}-${network || 'all'}`;

  // 检查缓存
  const cachedData = apiCache.get<any[]>(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    let url = `${GeckoTerminalAPI.SEARCH}?query=${encodeURIComponent(query)}`;
    if (network) {
      url += `&network=${network}`;
    }

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`GeckoTerminal搜索失败: ${response.status}`);
    }

    const data = await response.json();
    const pools = data.data || [];

    // 缓存结果
    apiCache.set(cacheKey, pools, 2 * 60 * 1000); // 2分钟缓存

    return pools;
  } catch (error) {
    console.error('GeckoTerminal搜索失败:', error);
    return [];
  }
}

// 从 GeckoTerminal 获取代币的主要交易池信息
async function getTokenMainPool(tokenAddress: string, network: string): Promise<any> {
  try {
    const networkConfig = SUPPORTED_NETWORKS[network as keyof typeof SUPPORTED_NETWORKS];
    if (!networkConfig) return null;

    // 获取代币信息，包含关联的池子
    const tokenUrl = `${GeckoTerminalAPI.BASE_URL}/networks/${networkConfig.id}/tokens/${tokenAddress}?include=top_pools`;
    const tokenResponse = await fetch(tokenUrl, {
      headers: { 'Accept': 'application/json' }
    });

    if (!tokenResponse.ok) return null;
    const tokenData = await tokenResponse.json();

    // 获取第一个（主要的）交易池
    const topPools = tokenData.data?.relationships?.top_pools?.data;
    if (!topPools || topPools.length === 0) return null;

    const mainPoolId = topPools[0].id;

    // 获取池子详细信息
    const poolUrl = `${GeckoTerminalAPI.BASE_URL}/networks/${networkConfig.id}/pools/${mainPoolId.split('_')[1]}`;
    const poolResponse = await fetch(poolUrl, {
      headers: { 'Accept': 'application/json' }
    });

    if (!poolResponse.ok) return null;
    return await poolResponse.json();
  } catch (error) {
    console.error('获取主要交易池失败:', error);
    return null;
  }
}

// 从 GeckoTerminal 获取代币价格
export async function getTokenPriceFromGeckoTerminal(tokenAddress: string, network: string): Promise<CryptoCurrency | null> {
  const cacheKey = `geckoterminal-price-${network}-${tokenAddress}`;

  // 检查缓存
  const cachedData = apiCache.get<CryptoCurrency>(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    // 获取网络配置
    const networkConfig = SUPPORTED_NETWORKS[network as keyof typeof SUPPORTED_NETWORKS];
    if (!networkConfig) {
      console.error(`不支持的网络: ${network}`);
      return null;
    }

    // 使用 GeckoTerminal API 获取代币信息
    const url = `${GeckoTerminalAPI.BASE_URL}/networks/${networkConfig.id}/tokens/${tokenAddress}`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.log(`GeckoTerminal API响应: ${response.status}`);
      return null;
    }

    const data = await response.json();
    console.log('GeckoTerminal响应数据:', data);

    if (!data.data) {
      console.log('GeckoTerminal未找到代币信息');
      return null;
    }

    const tokenData = data.data;
    const attributes = tokenData.attributes;

    // 暂时跳过价格变化数据获取，专注于基本信息
    let priceChange24h = 0;
    console.log('暂时跳过价格变化数据获取');

    // 转换为我们的数据格式
    const cryptoData: CryptoCurrency = {
      id: `gt-${network}-${tokenAddress}`,
      symbol: attributes.symbol?.toUpperCase() || 'UNKNOWN',
      name: attributes.name || attributes.symbol?.toUpperCase() || 'Unknown Token',
      image: attributes.image_url || '',
      current_price: parseFloat(attributes.price_usd) || 0,
      price_change_percentage_24h: priceChange24h,
      price_change_percentage_7d: 0,
      market_cap: parseFloat(attributes.market_cap_usd) || 0,
      market_cap_rank: 0,
      total_volume: parseFloat(attributes.volume_usd?.h24) || 0,
      high_24h: 0,
      low_24h: 0,
      circulating_supply: 0,
      total_supply: parseFloat(attributes.normalized_total_supply) || parseFloat(attributes.total_supply) || 0,
      last_updated: new Date().toISOString(),
      // 添加GeckoTerminal特有的数据
      dexscreener_data: {
        chainId: network,
        info: {
          imageUrl: attributes.image_url,
        }
      }
    };

    console.log('✅ 成功创建代币数据对象:', cryptoData);

    // 缓存结果
    apiCache.set(cacheKey, cryptoData, 1 * 60 * 1000); // 1分钟缓存

    return cryptoData;
  } catch (error) {
    console.error('GeckoTerminal价格获取失败:', error);
    return null;
  }
}

// 通过代币名称或地址搜索并获取价格（多数据源）
export async function searchAndGetTokenPrice(tokenNameOrAddress: string): Promise<CryptoCurrency | null> {
  try {
    const input = tokenNameOrAddress.trim();
    const inputLower = input.toLowerCase();

    // 检查是否是代币地址并检测网络
    const detectedNetwork = detectTokenNetwork(input);
    if (detectedNetwork) {
      console.log(`🔍 检测到${SUPPORTED_NETWORKS[detectedNetwork as keyof typeof SUPPORTED_NETWORKS].name}代币地址: ${input}`);

      // 根据网络类型选择合适的API
      if (detectedNetwork === 'solana') {
        // Solana网络使用现有的DexScreener和Jupiter API
        console.log('📡 尝试从DexScreener获取价格...');
        let priceData = await getTokenPriceFromDexScreener(input);
        if (priceData) {
          console.log('✅ DexScreener获取成功:', priceData);
          return priceData;
        }

        console.log('❌ DexScreener失败，尝试Jupiter...');
        priceData = await getTokenPriceFromJupiter(input);
        if (priceData) {
          console.log('✅ Jupiter获取成功:', priceData);
          return priceData;
        }
      } else if (detectedNetwork === 'ethereum' || detectedNetwork === 'bsc') {
        // EVM网络使用GeckoTerminal API
        console.log(`📡 尝试从GeckoTerminal获取${SUPPORTED_NETWORKS[detectedNetwork as keyof typeof SUPPORTED_NETWORKS].name}代币价格...`);
        const priceData = await getTokenPriceFromGeckoTerminal(input, detectedNetwork);
        console.log('GeckoTerminal返回的数据:', priceData);
        if (priceData) {
          console.log('✅ GeckoTerminal获取成功:', priceData);
          return priceData;
        } else {
          console.log('❌ GeckoTerminal返回null');
        }
      }

      console.log('❌ 所有价格API都失败了');
      return null;
    }

    // 如果不是地址，按原来的逻辑处理代币名称
    console.log(`🔍 搜索代币名称: ${input}`);

    // 首先检查是否是已知的Pump.fun代币
    if (PUMP_FUN_TOKENS[inputLower]) {
      const tokenAddress = PUMP_FUN_TOKENS[inputLower];
      console.log(`🎯 找到已知代币 ${input}，地址: ${tokenAddress}`);

      // 尝试多个数据源
      console.log('📡 尝试从DexScreener获取价格...');
      let priceData = await getTokenPriceFromDexScreener(tokenAddress);
      if (priceData) {
        console.log('✅ DexScreener获取成功:', priceData);
        return priceData;
      }

      console.log('❌ DexScreener失败，尝试Jupiter...');
      priceData = await getTokenPriceFromJupiter(tokenAddress);
      if (priceData) {
        console.log('✅ Jupiter获取成功:', priceData);
        return priceData;
      }

      console.log('❌ 所有价格API都失败了');
    } else {
      console.log(`❓ ${input} 不在已知代币列表中`);
      console.log('已知代币:', Object.keys(PUMP_FUN_TOKENS));
    }

    // 如果没有已知地址，尝试搜索
    console.log('尝试搜索代币...');
    const searchResults = await searchTokenOnDexScreener(input);

    if (searchResults.length === 0) {
      console.log(`在DexScreener上未找到 "${input}"`);
      return null;
    }

    // 取第一个匹配的结果
    const bestMatch = searchResults[0];
    const tokenAddress = bestMatch.baseToken?.address;

    if (!tokenAddress) {
      console.log(`未找到 "${input}" 的代币地址`);
      return null;
    }

    // 获取价格数据
    return await getTokenPriceFromDexScreener(tokenAddress);
  } catch (error) {
    console.error(`搜索和获取 "${tokenNameOrAddress}" 价格失败:`, error);
    return null;
  }
}
