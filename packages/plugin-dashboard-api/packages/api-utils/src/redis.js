"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = require("ioredis");
const dotenv = require("dotenv");
const fakeRedis = require("./redisSubstitute");
dotenv.config();
const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, SKIP_REDIS } = process.env;
const redis = SKIP_REDIS
    ? fakeRedis
    : new ioredis_1.default({
        host: REDIS_HOST,
        port: parseInt(REDIS_PORT || '6379', 10),
        password: REDIS_PASSWORD
    });
exports.default = redis;
