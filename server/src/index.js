import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes.js";
import animeRoutes from "./routes/animeRoutes.js";
import watchHistoryRoutes from "./routes/watchHistoryRoutes.js";
import watchlistRoutes from "./routes/watchlistRoutes.js";
import streamRoutes from "./routes/streamRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/anime", animeRoutes);
app.use("/api/watch-history", watchHistoryRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/play", streamRoutes);

async function main() {
  if (!process.env.JWT_SECRET) {
    console.error("Missing JWT_SECRET in environment");
    process.exit(1);
  }
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/streanime";
  await mongoose.connect(uri);
  console.log("MongoDB connected");

  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
