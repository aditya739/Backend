import mongoose from "mongoose";
import { Report } from "../models/report.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const reportVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { reason, description } = req.body;

  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  if (!reason) {
    throw new ApiError(400, "Reason is required");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const existingReport = await Report.findOne({
    reporter: req.user._id,
    video: videoId
  });

  if (existingReport) {
    throw new ApiError(400, "You have already reported this video");
  }

  const report = await Report.create({
    reporter: req.user._id,
    video: videoId,
    reason,
    description: description || ""
  });

  return res.status(201).json(new ApiResponse(201, report, "Video reported successfully"));
});

export { reportVideo };