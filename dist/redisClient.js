"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const redisClient = (0, redis_1.createClient)({
    password: 'OjJxXpCfqKlRqhMxjct6ntaqNkwosxxk',
    socket: {
        host: 'redis-10202.c266.us-east-1-3.ec2.redns.redis-cloud.com',
        port: 10202,
        tls: true, // Enable TLS
    },
});
redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient
    .connect()
    .then(() => {
    console.log('Connected to Redis');
})
    .catch((err) => {
    console.error('Failed to connect to Redis', err);
});
exports.default = redisClient;
