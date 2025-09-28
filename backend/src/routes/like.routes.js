// routes/like.routes.js
import { Router } from "express";
import {
  getLikedVideos,
  toggleCommentLike,
  toggleVideoLike,
  toggleTweetLike,
} from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Protect all like routes — user must be logged in
router.use(verifyJWT);

/*
  Routes:
  - POST /likes/videos/:videoId/toggle    -> toggle like on a video
  - POST /likes/comments/:commentId/toggle -> toggle like on a comment
  - POST /likes/tweets/:tweetId/toggle     -> toggle like on a tweet
  - GET  /likes/videos                     -> get all liked videos by current user
*/

// Toggle like on a video
router.post("/videos/:videoId/toggle", toggleVideoLike);

// Toggle like on a comment
router.post("/comments/:commentId/toggle", toggleCommentLike);

// Toggle like on a tweet
router.post("/tweets/:tweetId/toggle", toggleTweetLike);

// Get all liked videos for logged-in user
router.get("/videos", getLikedVideos);

export default router;
