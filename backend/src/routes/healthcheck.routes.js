// routes/healthcheck.routes.js
import { Router } from "express";
import { healthcheck } from "../controllers/healthcheck.controller.js";

const router = Router();

/*
  Route:
  - GET /health  -> basic service health check
*/
router.get("/health", healthcheck);

export default router;
