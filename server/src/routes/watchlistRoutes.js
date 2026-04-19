import { Router } from "express";
import { addToWatchlist, getWatchlist, removeFromWatchlist } from "../controllers/watchlistController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);
router.get("/", getWatchlist);
router.post("/:animeId", addToWatchlist);
router.delete("/:animeId", removeFromWatchlist);

export default router;
