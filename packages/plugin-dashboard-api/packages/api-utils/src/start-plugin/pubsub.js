"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
const graphql_redis_subscriptions_1 = require("graphql-redis-subscriptions");
const graphql_subscriptions_1 = require("graphql-subscriptions");
const ioredis_1 = require("ioredis");
const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, SKIP_REDIS } = process.env;
const pubsub = SKIP_REDIS
    ? new graphql_subscriptions_1.PubSub()
    : new graphql_redis_subscriptions_1.RedisPubSub({
        connectionListener: error => {
            if (error) {
                console.log(error);
            }
        },
        publisher: new ioredis_1.default({
            host: REDIS_HOST,
            port: parseInt(REDIS_PORT || '6379', 10),
            password: REDIS_PASSWORD
        }),
        subscriber: new ioredis_1.default({
            host: REDIS_HOST,
            port: parseInt(REDIS_PORT || '6379', 10),
            password: REDIS_PASSWORD
        })
    });
exports.default = pubsub;
