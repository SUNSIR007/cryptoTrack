export interface CryptoCurrency {
  id: string;
  symbol: string;
  name: string;
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

export interface CryptoCardProps {
  crypto: CryptoCurrency;
  isLoading?: boolean;
  priceHistory?: PricePoint[];
}
