import { Router } from "express";
import { getPlayback } from "../controllers/streamController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/:animeId/episodes/:episodeId", requireAuth, getPlayback);

export default router;
