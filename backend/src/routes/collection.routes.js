import { Router } from "express";
import {
  createCollection,
  getUserCollections,
  addVideoToCollection,
  removeVideoFromCollection,
  deleteCollection,
} from "../controllers/collection.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.post("/", createCollection);
router.get("/", getUserCollections);
router.post("/:id/videos", addVideoToCollection);
router.delete("/:id/videos/:videoId", removeVideoFromCollection);
router.delete("/:id", deleteCollection);

export default router;