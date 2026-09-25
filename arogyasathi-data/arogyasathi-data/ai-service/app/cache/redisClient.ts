import Redis from 'ioredis';

export class RedisCacheProvider {
  private client: Redis | null = null;
  private isConnected = false;

  constructor() {
    if (process.env.REDIS_URL) {
      this.client = new Redis(process.env.REDIS_URL, {
        maxRetriesPerRequest: 3,
        retryStrategy(times) {
          if (times > 3) return null;
          return Math.min(times * 50, 2000);
        }
      });

      this.client.on('connect', () => { this.isConnected = true; });
      this.client.on('error', () => { this.isConnected = false; });
    }
  }

  public async get(key: string): Promise<string | null> {
    if (!this.isConnected || !this.client) return null;
    try {
      return await this.client.get(key);
    } catch {
      return null;
    }
  }

  public async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (!this.isConnected || !this.client) return;
    try {
      if (ttlSeconds) {
        await this.client.set(key, value, 'EX', ttlSeconds);
      } else {
        await this.client.set(key, value);
      }
    } catch (e) {
      // Fail silently if redis is down to allow fallback
    }
  }

  public async delete(key: string): Promise<void> {
    if (!this.isConnected || !this.client) return;
    try {
      await this.client.del(key);
    } catch (e) {}
  }

  public async health(): Promise<boolean> {
    if (!process.env.REDIS_URL) return false;
    return this.isConnected;
  }
}

export const redisCache = new RedisCacheProvider();
