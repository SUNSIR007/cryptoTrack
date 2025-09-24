// 用户自定义币种管理

const USER_COINS_KEY = 'cryptotrack_user_coins';

// 默认币种
const DEFAULT_COINS = ['bitcoin', 'ethereum', 'binancecoin', 'solana'];

// 代币数量限制配置
export const COIN_LIMITS = {
  MAX_COINS: 20, // 最大代币数量
  WARNING_THRESHOLD: 15, // 警告阈值
  PERFORMANCE_THRESHOLD: 10 // 性能建议阈值
};

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

// 检查是否可以添加更多代币
export function canAddMoreCoins(currentCoins?: string[]): { canAdd: boolean; reason?: string; currentCount: number; maxCount: number } {
  const coins = currentCoins || getUserCoins();
  const currentCount = coins.length;

  if (currentCount >= COIN_LIMITS.MAX_COINS) {
    return {
      canAdd: false,
      reason: `已达到最大代币数量限制 (${COIN_LIMITS.MAX_COINS}个)。请删除一些代币后再添加新的。`,
      currentCount,
      maxCount: COIN_LIMITS.MAX_COINS
    };
  }

  return {
    canAdd: true,
    currentCount,
    maxCount: COIN_LIMITS.MAX_COINS
  };
}

// 获取代币数量警告信息
export function getCoinCountWarning(currentCoins?: string[]): { hasWarning: boolean; message?: string; level: 'info' | 'warning' | 'error' } {
  const coins = currentCoins || getUserCoins();
  const currentCount = coins.length;

  if (currentCount >= COIN_LIMITS.MAX_COINS) {
    return {
      hasWarning: true,
      message: `已达到最大代币数量 (${currentCount}/${COIN_LIMITS.MAX_COINS})`,
      level: 'error'
    };
  }

  if (currentCount >= COIN_LIMITS.WARNING_THRESHOLD) {
    return {
      hasWarning: true,
      message: `代币数量较多 (${currentCount}/${COIN_LIMITS.MAX_COINS})，可能影响加载速度`,
      level: 'warning'
    };
  }

  if (currentCount >= COIN_LIMITS.PERFORMANCE_THRESHOLD) {
    return {
      hasWarning: true,
      message: `当前监控 ${currentCount} 个代币，建议不超过 ${COIN_LIMITS.WARNING_THRESHOLD} 个以获得最佳性能`,
      level: 'info'
    };
  }

  return {
    hasWarning: false,
    level: 'info'
  };
}

// 添加币种（带限制检查）
export function addUserCoin(coinId: string): { success: boolean; coins: string[]; error?: string } {
  const currentCoins = getUserCoins();

  // 检查是否已存在
  if (currentCoins.includes(coinId)) {
    return { success: true, coins: currentCoins };
  }

  // 检查是否可以添加更多代币
  const canAddResult = canAddMoreCoins(currentCoins);
  if (!canAddResult.canAdd) {
    return {
      success: false,
      coins: currentCoins,
      error: canAddResult.reason
    };
  }

  const newCoins = [...currentCoins, coinId];
  saveUserCoins(newCoins);
  return { success: true, coins: newCoins };
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
