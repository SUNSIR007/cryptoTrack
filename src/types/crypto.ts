export interface CryptoCurrency {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  last_updated: string;
}

export interface CoinGeckoResponse {
  [key: string]: {
    usd: number;
    usd_24h_change: number;
  };
}

export interface CryptoCardProps {
  crypto: CryptoCurrency;
  isLoading?: boolean;
}
