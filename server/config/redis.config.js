import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();
const redis = createClient({
  url: process.env.REDIS_URL,
});

redis.on("error", (err) => console.log("Redis Error:", err));

export async function connectRedis() {
  await redis.connect();
  console.log("Connected to Upstash Redis");
}

export default redis;
