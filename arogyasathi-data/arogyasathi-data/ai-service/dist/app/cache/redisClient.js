"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisCache = exports.RedisCacheProvider = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
class RedisCacheProvider {
    client = null;
    isConnected = false;
    constructor() {
        if (process.env.REDIS_URL) {
            this.client = new ioredis_1.default(process.env.REDIS_URL, {
                maxRetriesPerRequest: 3,
                retryStrategy(times) {
                    if (times > 3)
                        return null;
                    return Math.min(times * 50, 2000);
                }
            });
            this.client.on('connect', () => { this.isConnected = true; });
            this.client.on('error', () => { this.isConnected = false; });
        }
    }
    async get(key) {
        if (!this.isConnected || !this.client)
            return null;
        try {
            return await this.client.get(key);
        }
        catch {
            return null;
        }
    }
    async set(key, value, ttlSeconds) {
        if (!this.isConnected || !this.client)
            return;
        try {
            if (ttlSeconds) {
                await this.client.set(key, value, 'EX', ttlSeconds);
            }
            else {
                await this.client.set(key, value);
            }
        }
        catch (e) {
            // Fail silently if redis is down to allow fallback
        }
    }
    async delete(key) {
        if (!this.isConnected || !this.client)
            return;
        try {
            await this.client.del(key);
        }
        catch (e) { }
    }
    async health() {
        if (!process.env.REDIS_URL)
            return false;
        return this.isConnected;
    }
}
exports.RedisCacheProvider = RedisCacheProvider;
exports.redisCache = new RedisCacheProvider();
