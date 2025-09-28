import { Router } from "express";
import { getTrendingVideos } from "../controllers/trending.controller.js";

const router = Router();

router.get("/", getTrendingVideos);

export default router;