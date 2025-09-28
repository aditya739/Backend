// src/controllers/youtube.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Node 18+ has global fetch
const API = "https://www.googleapis.com/youtube/v3";

function ytUrl(path, params) {
  const u = new URL(API + path);
  Object.entries(params).forEach(([k,v]) => v != null && u.searchParams.set(k, v));
  return u.toString();
}

// GET /api/v1/youtube/search?q=react&pageToken=&maxResults=
export const ytSearch = asyncHandler(async (req, res) => {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) throw new ApiError(500, "Missing YOUTUBE_API_KEY");
  const { q = "", maxResults = 16, pageToken = "" } = req.query;

  const url = ytUrl("/search", {
    key,
    q,
    part: "snippet",
    type: "video",
    maxResults,
    pageToken
  });

  const r = await fetch(url);
  if (!r.ok) throw new ApiError(r.status, "YouTube search failed");
  const data = await r.json();
  return res.status(200).json(new ApiResponse(200, data, "YouTube search"));
});

// GET /api/v1/youtube/trending?maxResults=...
export const ytTrending = asyncHandler(async (req, res) => {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) throw new ApiError(500, "Missing YOUTUBE_API_KEY");
  const { maxResults = 16 } = req.query;
  const regionCode = process.env.YOUTUBE_REGION || "US";

  const url = ytUrl("/videos", {
    key,
    chart: "mostPopular",
    part: "snippet,contentDetails,statistics",
    maxResults,
    regionCode
  });

  const r = await fetch(url);
  if (!r.ok) throw new ApiError(r.status, "YouTube trending failed");
  const data = await r.json();
  return res.status(200).json(new ApiResponse(200, data, "YouTube trending"));
});

// GET /api/v1/youtube/channel/:channelId?maxResults=&pageToken=
export const ytChannelVideos = asyncHandler(async (req, res) => {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) throw new ApiError(500, "Missing YOUTUBE_API_KEY");
  const { channelId } = req.params;
  const { maxResults = 16, pageToken = "" } = req.query;

  const url = ytUrl("/search", {
    key,
    channelId,
    part: "snippet",
    type: "video",
    order: "date",
    maxResults,
    pageToken
  });

  const r = await fetch(url);
  if (!r.ok) throw new ApiError(r.status, "YouTube channel videos failed");
  const data = await r.json();
  return res.status(200).json(new ApiResponse(200, data, "Channel videos"));
});
