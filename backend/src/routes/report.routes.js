import { Router } from "express";
import { reportVideo } from "../controllers/report.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.post("/:videoId", reportVideo);

export default router;