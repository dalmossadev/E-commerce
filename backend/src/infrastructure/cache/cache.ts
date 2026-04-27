export interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class MemoryCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private defaultTTL: number;

  constructor(defaultTTL: number = 300000) {
    this.defaultTTL = defaultTTL;
    this.cleanup();
  }

  set<T>(key: string, value: T, ttl?: number): void {
    const expiresAt = Date.now() + (ttl || this.defaultTTL);
    this.cache.set(key, { value, expiresAt });
  }

  get<T>(key: string): T | undefined {
    const entry = this.cache.get(key);
    
    if (!entry) return undefined;
    
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.value as T;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.cache.entries()) {
        if (now > entry.expiresAt) {
          this.cache.delete(key);
        }
      }
    }, 60000);
  }

  size(): number {
    return this.cache.size;
  }
}

export const productCache = new MemoryCache(60000);

export const cache = {
  get: <T>(key: string): T | undefined => productCache.get<T>(key),
  set: <T>(key: string, value: T, ttl?: number): void => productCache.set(key, value, ttl),
  delete: (key: string): boolean => productCache.delete(key),
  clear: (): void => productCache.clear(),
  has: (key: string): boolean => productCache.has(key),
  size: (): number => productCache.size()
};