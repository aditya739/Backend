import mongoose from "mongoose";
import { Collection } from "../models/collection.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createCollection = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name?.trim()) {
    throw new ApiError(400, "Collection name is required");
  }

  const collection = await Collection.create({
    name: name.trim(),
    description: description || "",
    owner: req.user._id,
  });

  return res.status(201).json(new ApiResponse(201, collection, "Collection created"));
});

const getUserCollections = asyncHandler(async (req, res) => {
  const collections = await Collection.find({ owner: req.user._id })
    .populate("videos", "title thumbnail duration")
    .sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, collections, "Collections fetched"));
});

const addVideoToCollection = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { videoId } = req.body;

  if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid collection or video ID");
  }

  const collection = await Collection.findById(id);
  if (!collection) {
    throw new ApiError(404, "Collection not found");
  }

  if (collection.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (!collection.videos.includes(videoId)) {
    collection.videos.push(videoId);
    await collection.save();
  }

  return res.status(200).json(new ApiResponse(200, collection, "Video added to collection"));
});

const removeVideoFromCollection = asyncHandler(async (req, res) => {
  const { id, videoId } = req.params;

  if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid collection or video ID");
  }

  const collection = await Collection.findById(id);
  if (!collection) {
    throw new ApiError(404, "Collection not found");
  }

  if (collection.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized");
  }

  collection.videos = collection.videos.filter(id => id.toString() !== videoId);
  await collection.save();

  return res.status(200).json(new ApiResponse(200, collection, "Video removed from collection"));
});

const deleteCollection = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid collection ID");
  }

  const collection = await Collection.findById(id);
  if (!collection) {
    throw new ApiError(404, "Collection not found");
  }

  if (collection.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized");
  }

  await Collection.findByIdAndDelete(id);

  return res.status(200).json(new ApiResponse(200, null, "Collection deleted"));
});

export {
  createCollection,
  getUserCollections,
  addVideoToCollection,
  removeVideoFromCollection,
  deleteCollection,
};