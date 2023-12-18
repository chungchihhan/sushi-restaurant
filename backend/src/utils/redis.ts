import dotenv from 'dotenv';
import Redis from 'ioredis';

dotenv.config();

let redisClient: Redis | null = null;

if (process.env.NODE_ENV !== 'test' && process.env.REDIS_URL) {
    redisClient = new Redis(process.env.REDIS_URL);
    console.log('Connected to Redis');
}

export default redisClient;
