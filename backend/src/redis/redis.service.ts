import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private client: Redis;

  constructor() {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    // Parse URL to avoid IPv6 issues
    const url = new URL(redisUrl);
    const hostname = url.hostname;
    
    // Force IPv4 for Docker network
    let host = hostname;
    if (hostname === 'redis' || hostname === 'localhost' || hostname === '::1' || hostname === '[::1]') {
      host = hostname === 'redis' ? 'redis' : '127.0.0.1';
    }
    
    this.client = new Redis({
      host,
      port: parseInt(url.port) || 6379,
      family: 4, // Force IPv4
      enableReadyCheck: false,
      maxRetriesPerRequest: null,
      lazyConnect: true, // Don't connect immediately
    });
    
    // Connect with error handling
    this.client.connect().catch((err) => {
      console.warn('Redis connection warning:', err.message);
    });
  }

  getClient(): Redis {
    return this.client;
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.setex(key, ttl, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }
}


