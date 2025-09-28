import { Router } from "express";
import { updateWatchHistory, getWatchHistory, getVideoProgress } from "../controllers/watchHistory.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.post("/:videoId", updateWatchHistory);
router.get("/", getWatchHistory);
router.get("/:videoId/progress", getVideoProgress);

export default router;