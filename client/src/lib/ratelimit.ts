import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL || "https://placeholder.upstash.io";
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || "placeholder_token";

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    console.warn("⚠️ Upstash Redis credentials missing. Using placeholders for build stability.");
}

const redis = new Redis({
    url: redisUrl,
    token: redisToken,
});

// Create a new ratelimiter, that allows 10 requests per 10 seconds
export const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "10 s"),
    analytics: true,
    prefix: "@upstash/ratelimit",
});
