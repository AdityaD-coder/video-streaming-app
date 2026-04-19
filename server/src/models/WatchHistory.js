import mongoose from "mongoose";

const watchHistorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    animeId: { type: String, required: true },
    episodeId: { type: String, required: true },
    lastPositionSec: { type: Number, default: 0, min: 0 },
    durationSec: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

watchHistorySchema.index({ userId: 1, animeId: 1, episodeId: 1 }, { unique: true });

export const WatchHistory = mongoose.model("WatchHistory", watchHistorySchema);
