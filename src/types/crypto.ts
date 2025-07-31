export interface CryptoCurrency {
  id: string;
  symbol: string;
  name: string;
  image?: string;
  current_price: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  circulating_supply: number;
  total_supply: number;
  last_updated: string;
  // DexScreener特有数据（可选）
  dexscreener_data?: {
    pairAddress?: string;
    dexId?: string;
    url?: string;
    liquidity?: number;
    fdv?: number;
    pairCreatedAt?: number;
    txns?: {
      h24?: {
        buys?: number;
        sells?: number;
      };
    };
    volume?: {
      h1?: number;
      h6?: number;
      h24?: number;
    };
    priceChange?: {
      h1?: number;
      h6?: number;
      h24?: number;
    };
    quoteToken?: {
      address?: string;
      name?: string;
      symbol?: string;
    };
    chainId?: string;
    info?: {
      imageUrl?: string;
      websites?: string[];
      socials?: any[];
      [key: string]: any;
    };
  };
}

export interface CoinGeckoDetailedResponse {
  [key: string]: {
    id: string;
    symbol: string;
    name: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    total_volume: number;
    high_24h: number;
    low_24h: number;
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    circulating_supply: number;
    total_supply: number;
    last_updated: string;
  }[];
}

export interface CoinGeckoResponse {
  [key: string]: {
    usd: number;
    usd_24h_change: number;
  };
}

export interface PricePoint {
  timestamp: number;
  price: number;
}

export interface SearchResult {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
  market_cap_rank: number;
}

export interface CryptoCardProps {
  crypto: CryptoCurrency;
  isLoading?: boolean;
  priceHistory?: PricePoint[];
  onRemove?: (coinId: string) => void;
  showRemoveButton?: boolean;
}
