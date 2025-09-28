import mongoose from "mongoose";
import { WatchHistory } from "../models/watchHistory.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const updateWatchHistory = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { watchTime, completed } = req.body;

  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  await WatchHistory.findOneAndUpdate(
    { user: req.user._id, video: videoId },
    { 
      watchTime: watchTime || 0, 
      completed: completed || false,
      watchedAt: new Date()
    },
    { upsert: true, new: true }
  );

  return res.status(200).json(new ApiResponse(200, null, "Watch history updated"));
});

const getWatchHistory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const p = Math.max(1, Number(page));
  const l = Math.max(1, Number(limit));

  const history = await WatchHistory.find({ user: req.user._id })
    .populate("video", "title thumbnail duration views owner")
    .populate("video.owner", "username avatar")
    .sort({ watchedAt: -1 })
    .skip((p - 1) * l)
    .limit(l);

  return res.status(200).json(new ApiResponse(200, history, "Watch history fetched"));
});

const getVideoProgress = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const progress = await WatchHistory.findOne({ 
    user: req.user._id, 
    video: videoId 
  });

  return res.status(200).json(new ApiResponse(200, {
    watchTime: progress?.watchTime || 0,
    completed: progress?.completed || false
  }, "Video progress fetched"));
});

export { updateWatchHistory, getWatchHistory, getVideoProgress };