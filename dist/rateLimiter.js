"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRateLimiter = exports.apiRateLimiter = void 0;
// rateLimiters.ts
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const rate_limit_redis_1 = __importDefault(require("rate-limit-redis"));
const redis_1 = require("redis");
// Create and configure Redis client
const redisClient = (0, redis_1.createClient)({
    url: process.env.REDIS_URL, // Ensure this environment variable is set
});
redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.connect().catch((err) => console.error('Failed to connect to Redis', err));
// Create rate limiter for API requests
const apiRateLimiter = (0, express_rate_limit_1.default)({
    store: new rate_limit_redis_1.default({
        sendCommand: (...args) => redisClient.sendCommand(args),
    }),
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (15 minutes)
    message: 'Too many requests from this IP, please try again later.',
});
exports.apiRateLimiter = apiRateLimiter;
// Create rate limiter for authentication requests
const authRateLimiter = (0, express_rate_limit_1.default)({
    store: new rate_limit_redis_1.default({
        sendCommand: (...args) => redisClient.sendCommand(args),
    }),
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 10, // Limit each IP to 10 requests per `window` (5 minutes)
    message: 'Too many login attempts from this IP, please try again later.',
});
exports.authRateLimiter = authRateLimiter;
