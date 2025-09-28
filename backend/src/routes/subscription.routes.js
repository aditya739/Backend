// routes/subscription.routes.js
import { Router } from "express";
import {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription,
} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// All subscription routes require authentication
router.use(verifyJWT);

/*
  Routes:
  - POST /subscriptions/channels/:channelId/toggle -> toggle subscription to a channel
  - GET  /subscriptions/channels/:channelId/subscribers -> get all subscribers of a channel
  - GET  /subscriptions/users/:userId/channels -> get all channels a user has subscribed to
*/

// Toggle subscription (subscribe/unsubscribe)
router.post("/channels/:channelId/toggle", toggleSubscription);

// Get subscribers of a channel
router.get("/channels/:channelId/subscribers", getUserChannelSubscribers);

// Get channels a user has subscribed to
router.get("/users/:userId/channels", getSubscribedChannels);

export default router;
