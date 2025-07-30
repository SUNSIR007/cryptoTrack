// API缓存管理器

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

class APICache {
  private cache = new Map<string, CacheItem<any>>();
  private readonly DEFAULT_TTL = 2 * 60 * 1000; // 2分钟默认缓存时间

  // 设置缓存
  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiry: now + ttl
    });
  }

  // 获取缓存
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) {
      return null;
    }

    const now = Date.now();
    if (now > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  // 检查是否有效
  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) {
      return false;
    }

    const now = Date.now();
    if (now > item.expiry) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  // 删除缓存
  delete(key: string): void {
    this.cache.delete(key);
  }

  // 清空缓存
  clear(): void {
    this.cache.clear();
  }

  // 清理过期缓存
  cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.cache.forEach((item, key) => {
      if (now > item.expiry) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => {
      this.cache.delete(key);
    });
  }

  // 获取缓存统计
  getStats() {
    const keys: string[] = [];
    this.cache.forEach((_, key) => {
      keys.push(key);
    });

    return {
      size: this.cache.size,
      keys
    };
  }
}

// 单例实例
export const apiCache = new APICache();

// 定期清理过期缓存
if (typeof window !== 'undefined') {
  setInterval(() => {
    apiCache.cleanup();
  }, 5 * 60 * 1000); // 每5分钟清理一次
}

// 请求去重管理器
class RequestDeduplicator {
  private pendingRequests = new Map<string, Promise<any>>();

  async deduplicate<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
    // 如果已有相同请求在进行中，返回该请求的Promise
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key);
    }

    // 创建新请求
    const promise = requestFn().finally(() => {
      // 请求完成后清理
      this.pendingRequests.delete(key);
    });

    this.pendingRequests.set(key, promise);
    return promise;
  }

  // 取消所有待处理请求
  cancelAll(): void {
    this.pendingRequests.clear();
  }
}

export const requestDeduplicator = new RequestDeduplicator();
