// routes/comment.routes.js
import { Router } from "express";
import {
  addComment,
  deleteComment,
  getVideoComments,
  updateComment,
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

/*
  Routes:
  - GET  /:videoId               -> get comments for a video
  - POST /:videoId               -> add new comment (protected)
  - PATCH /:commentId            -> update comment (protected)
  - DELETE /:commentId           -> delete comment (protected)
*/

// Get comments for a video (public)
router.get("/:videoId", getVideoComments);

// Protected routes
router.post("/:videoId", verifyJWT, addComment);
router.patch("/:commentId", verifyJWT, updateComment);
router.delete("/:commentId", verifyJWT, deleteComment);

export default router;
