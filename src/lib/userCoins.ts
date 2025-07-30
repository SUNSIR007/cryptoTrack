// 用户自定义币种管理

const USER_COINS_KEY = 'cryptotrack_user_coins';

// 默认币种
const DEFAULT_COINS = ['bitcoin', 'ethereum', 'binancecoin', 'solana'];

// 获取用户币种列表
export function getUserCoins(): string[] {
  if (typeof window === 'undefined') {
    return DEFAULT_COINS;
  }

  try {
    const stored = localStorage.getItem(USER_COINS_KEY);
    if (stored) {
      const userCoins = JSON.parse(stored);
      // 确保至少有默认币种
      return userCoins.length > 0 ? userCoins : DEFAULT_COINS;
    }
  } catch (error) {
    console.error('读取用户币种失败:', error);
  }

  return DEFAULT_COINS;
}

// 保存用户币种列表
export function saveUserCoins(coins: string[]): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(USER_COINS_KEY, JSON.stringify(coins));
  } catch (error) {
    console.error('保存用户币种失败:', error);
  }
}

// 添加币种
export function addUserCoin(coinId: string): string[] {
  const currentCoins = getUserCoins();
  
  // 检查是否已存在
  if (currentCoins.includes(coinId)) {
    return currentCoins;
  }

  const newCoins = [...currentCoins, coinId];
  saveUserCoins(newCoins);
  return newCoins;
}

// 移除币种
export function removeUserCoin(coinId: string): string[] {
  const currentCoins = getUserCoins();
  const newCoins = currentCoins.filter(id => id !== coinId);
  
  // 确保至少保留一个币种
  if (newCoins.length === 0) {
    return currentCoins;
  }

  saveUserCoins(newCoins);
  return newCoins;
}

// 重置为默认币种
export function resetToDefaultCoins(): string[] {
  saveUserCoins(DEFAULT_COINS);
  return DEFAULT_COINS;
}

// 检查是否为默认币种
export function isDefaultCoin(coinId: string): boolean {
  return DEFAULT_COINS.includes(coinId);
}

// 重新排序币种
export function reorderUserCoins(newOrder: string[]): string[] {
  saveUserCoins(newOrder);
  return newOrder;
}
