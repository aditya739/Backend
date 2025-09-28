// routes/dashboard.routes.js
import { Router } from "express";
import { getChannelStats, getChannelVideos } from "../controllers/dashboard.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

// Protect all dashboard routes
router.use(verifyJWT);

// GET /dashboard/stats
router.get("/stats", asyncHandler(getChannelStats));

// GET /dashboard/videos?page=1&limit=20
router.get("/videos", asyncHandler(getChannelVideos));

export default router;
