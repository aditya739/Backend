import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getTrendingVideos = asyncHandler(async (req, res) => {
  const { timeframe = "week", limit = 20 } = req.query;
  
  let dateFilter = {};
  const now = new Date();
  
  switch (timeframe) {
    case "day":
      dateFilter = { createdAt: { $gte: new Date(now - 24 * 60 * 60 * 1000) } };
      break;
    case "week":
      dateFilter = { createdAt: { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) } };
      break;
    case "month":
      dateFilter = { createdAt: { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) } };
      break;
    default:
      dateFilter = {};
  }

  const videos = await Video.find(dateFilter)
    .populate("owner", "username avatar")
    .sort({ views: -1, likes: -1 })
    .limit(Number(limit));

  return res.status(200).json(new ApiResponse(200, videos, "Trending videos fetched"));
});

export { getTrendingVideos };