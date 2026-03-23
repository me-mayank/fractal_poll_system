import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import pollRoutes from "./routes/poll.routes.js";
import adminRoutes from "./routes/admin.routes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/poll", pollRoutes);
app.use("/admin", adminRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
