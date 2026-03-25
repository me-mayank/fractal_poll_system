import redis from "../config/redis.config.js";
import { POLL_KEY, USER_KEY, STATE_KEY } from "../utils/constants.js";

// 🟢 Start Poll
export const startPoll = async (req, res) => {
  await redis.set(STATE_KEY, "ACTIVE");

  await redis.hSet(POLL_KEY, {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
  });

  await redis.del(USER_KEY);

  res.send("Poll started");
};

// 🔴 End Poll
export const endPoll = async (req, res) => {
  await redis.set(STATE_KEY, "ENDED");
  res.send("Poll ended");
};

// 🗳️ Vote
export const vote = async (req, res) => {
  const { option, userId } = req.body;

  const state = await redis.get(STATE_KEY);

  if (state !== "ACTIVE") {
    return res.json({ success: false, message: "Voting not active" });
  }

  const already = await redis.sIsMember(USER_KEY, userId);

  if (already) {
    return res.json({ success: false, message: "Already voted" });
  }

  await redis.hIncrBy(POLL_KEY, option, 1);
  await redis.sAdd(USER_KEY, userId);

  res.json({ success: true });
};

// 📊 Results
export const getResults = async (req, res) => {
  const state = await redis.get(STATE_KEY);

  if (state === "ACTIVE") {
    return res.json({ status: "Voting in progress" });
  }

  if (state === "IDLE") {
    return res.json({ status: "IDLE" });
  }

  if (state === "ENDED") {
    const data = await redis.hGetAll(POLL_KEY);

    const totalVotes = await redis.sCard(USER_KEY); // 🔥 NEW

    let total = 0;
    for (let key in data) {
      total += parseInt(data[key]);
    }

    let result = {};
    for (let key in data) {
      const count = parseInt(data[key]);
      result[key] = total === 0 ? 0 : ((count / total) * 100).toFixed(2);
    }

    return res.json({
      status: "ENDED",
      result,
      totalVotes, // 🔥 SEND THIS
    });
  }
};

// 🔁 Reset
export const resetPoll = async (req, res) => {
  await redis.del(POLL_KEY);
  await redis.del(USER_KEY);
  await redis.set(STATE_KEY, "IDLE");

  res.send("Poll reset");
};
