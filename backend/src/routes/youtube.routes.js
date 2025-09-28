import { Router } from "express";
import { ytSearch, ytTrending, ytChannelVideos } from "../controllers/youtube.controller.js";
// (No auth required; it’s read-only)
const router = Router();

router.get("/search", ytSearch);
router.get("/trending", ytTrending);
router.get("/channel/:channelId", ytChannelVideos);

export default router;
