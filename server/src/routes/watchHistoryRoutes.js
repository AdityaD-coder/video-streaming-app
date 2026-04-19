import { Router } from "express";
import { listHistory, upsertHistory } from "../controllers/watchHistoryController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);
router.get("/", listHistory);
router.post("/", upsertHistory);

export default router;
