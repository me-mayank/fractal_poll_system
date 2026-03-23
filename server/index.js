import express from "express";
import cors from "cors";
import { connectRedis } from "./config/redis.config.js";
import dotenv from "dotenv";

import pollRoutes from "./routes/poll.routes.js";
import adminRoutes from "./routes/admin.routes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/poll", pollRoutes);
app.use("/admin", adminRoutes);

// 🔥 START SERVER ONLY AFTER REDIS CONNECTS
const startServer = async () => {
  try {
    await connectRedis();

    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
};

startServer();
