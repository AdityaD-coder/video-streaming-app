import { Router } from "express";
import { getAllAnime, getOneAnime } from "../controllers/animeController.js";

const router = Router();

router.get("/", getAllAnime);
router.get("/:id", getOneAnime);

export default router;
