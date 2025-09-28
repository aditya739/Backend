// routes/tweet.routes.js
import { Router } from "express";
import {
  createTweet,
  deleteTweet,
  getUserTweets,
  updateTweet,
} from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Protect all tweet routes
router.use(verifyJWT);

/*
  Routes:
  - POST   /tweets/                  -> create a new tweet
  - GET    /tweets/users/:userId     -> get all tweets from a user
  - PATCH  /tweets/:tweetId          -> update a tweet
  - DELETE /tweets/:tweetId          -> delete a tweet
*/

// Create a new tweet
router.post("/", createTweet);

// Get all tweets by a specific user
router.get("/users/:userId", getUserTweets);

// Update or delete a specific tweet
router
  .route("/:tweetId")
  .patch(updateTweet)
  .delete(deleteTweet);

export default router;
