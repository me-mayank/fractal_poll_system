import express from "express";
import {
  vote,
  getResults,
  startPoll,
  endPoll,
  resetPoll,
} from "../controllers/poll.controllers.js";

import authMiddleware from "../middlewares/auth.middlewares.js";

const router = express.Router();

// Public
router.post("/vote", vote);
router.get("/results", getResults);

// Admin
router.post("/start", authMiddleware, startPoll);
router.post("/end", authMiddleware, endPoll);
router.post("/reset", authMiddleware, resetPoll);

export default router;
