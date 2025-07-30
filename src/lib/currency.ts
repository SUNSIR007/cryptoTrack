// 货币单位管理系统

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  locale: string;
}

export const currencies: Currency[] = [
  {
    code: 'usd',
    name: '美元',
    symbol: '$',
    locale: 'en-US'
  },
  {
    code: 'cny',
    name: '人民币',
    symbol: '¥',
    locale: 'zh-CN'
  },
  {
    code: 'eur',
    name: '欧元',
    symbol: '€',
    locale: 'de-DE'
  },
  {
    code: 'jpy',
    name: '日元',
    symbol: '¥',
    locale: 'ja-JP'
  },
  {
    code: 'gbp',
    name: '英镑',
    symbol: '£',
    locale: 'en-GB'
  },
  {
    code: 'krw',
    name: '韩元',
    symbol: '₩',
    locale: 'ko-KR'
  },
  {
    code: 'inr',
    name: '印度卢比',
    symbol: '₹',
    locale: 'en-IN'
  },
  {
    code: 'cad',
    name: '加拿大元',
    symbol: 'C$',
    locale: 'en-CA'
  },
  {
    code: 'aud',
    name: '澳大利亚元',
    symbol: 'A$',
    locale: 'en-AU'
  },
  {
    code: 'chf',
    name: '瑞士法郎',
    symbol: 'CHF',
    locale: 'de-CH'
  }
];

// 货币管理器
class CurrencyManager {
  private currentCurrency: Currency = currencies[0]; // 默认USD
  private listeners: ((currency: Currency) => void)[] = [];

  constructor() {
    this.loadCurrency();
  }

  // 加载保存的货币设置
  private loadCurrency() {
    if (typeof window !== 'undefined') {
      const savedCurrencyCode = localStorage.getItem('cryptotrack-currency');
      if (savedCurrencyCode) {
        const currency = currencies.find(c => c.code === savedCurrencyCode);
        if (currency) {
          this.currentCurrency = currency;
        }
      }
    }
  }

  // 设置货币
  setCurrency(currencyCode: string) {
    const currency = currencies.find(c => c.code === currencyCode);
    if (currency) {
      this.currentCurrency = currency;
      
      // 保存到localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('cryptotrack-currency', currencyCode);
      }

      // 通知监听器
      this.listeners.forEach(listener => listener(currency));
    }
  }

  // 获取当前货币
  getCurrentCurrency(): Currency {
    return this.currentCurrency;
  }

  // 获取所有货币
  getAllCurrencies(): Currency[] {
    return currencies;
  }

  // 添加货币变更监听器
  addListener(listener: (currency: Currency) => void) {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // 格式化价格
  formatPrice(price: number): string {
    const currency = this.currentCurrency;
    
    try {
      return new Intl.NumberFormat(currency.locale, {
        style: 'currency',
        currency: currency.code.toUpperCase(),
        minimumFractionDigits: price < 1 ? 6 : 2,
        maximumFractionDigits: price < 1 ? 6 : 2,
      }).format(price);
    } catch (error) {
      // 如果Intl.NumberFormat失败，使用简单格式
      return `${currency.symbol}${price.toLocaleString(currency.locale)}`;
    }
  }

  // 格式化市值
  formatMarketCap(marketCap: number): string {
    const currency = this.currentCurrency;
    
    if (marketCap >= 1e12) {
      return `${currency.symbol}${(marketCap / 1e12).toFixed(2)}T`;
    } else if (marketCap >= 1e9) {
      return `${currency.symbol}${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `${currency.symbol}${(marketCap / 1e6).toFixed(2)}M`;
    } else if (marketCap >= 1e3) {
      return `${currency.symbol}${(marketCap / 1e3).toFixed(2)}K`;
    } else {
      return `${currency.symbol}${marketCap.toFixed(2)}`;
    }
  }

  // 格式化交易量
  formatVolume(volume: number): string {
    return this.formatMarketCap(volume); // 使用相同的格式
  }
}

export const currencyManager = new CurrencyManager();
