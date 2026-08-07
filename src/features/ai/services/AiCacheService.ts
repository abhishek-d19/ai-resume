export class AiCacheService {
  private static cache: Map<string, { data: any; timestamp: number }> = new Map();
  private static TTL_MS = 1000 * 60 * 30; // 30-minute cache TTL

  /**
   * Generates a deterministic cache key from input prompt & options
   */
  public static generateKey(prompt: string, extraContext?: any): string {
    const combined = prompt + JSON.stringify(extraContext || {});
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return `ai-cache-${hash}`;
  }

  public static get<T = any>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > this.TTL_MS) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  public static set(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  public static clear(): void {
    this.cache.clear();
  }
}
