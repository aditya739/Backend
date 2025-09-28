// like.controller.js
import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

// Toggle like on a video
const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId")
    }

    const existing = await Like.findOne({ likedBy: req.user._id, video: videoId })

    if (existing) {
        // unlike
        await Like.findByIdAndDelete(existing._id)
        return res.status(200).json(new ApiResponse(200, { liked: false }, "Video unliked"))
    } else {
        // like
        const like = new Like({ likedBy: req.user._id, video: videoId })
        await like.save()
        return res.status(201).json(new ApiResponse(201, { liked: true, likeId: like._id }, "Video liked"))
    }
})

// Toggle like on a comment
const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid commentId")
    }

    const existing = await Like.findOne({ likedBy: req.user._id, comment: commentId })

    if (existing) {
        await Like.findByIdAndDelete(existing._id)
        return res.status(200).json(new ApiResponse(200, { liked: false }, "Comment unliked"))
    } else {
        const like = new Like({ likedBy: req.user._id, comment: commentId })
        await like.save()
        return res.status(201).json(new ApiResponse(201, { liked: true, likeId: like._id }, "Comment liked"))
    }
})

// Toggle like on a tweet
const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweetId")
    }

    const existing = await Like.findOne({ likedBy: req.user._id, tweet: tweetId })

    if (existing) {
        await Like.findByIdAndDelete(existing._id)
        return res.status(200).json(new ApiResponse(200, { liked: false }, "Tweet unliked"))
    } else {
        const like = new Like({ likedBy: req.user._id, tweet: tweetId })
        await like.save()
        return res.status(201).json(new ApiResponse(201, { liked: true, likeId: like._id }, "Tweet liked"))
    }
})

// Get all videos liked by the current user
const getLikedVideos = asyncHandler(async (req, res) => {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1)
    const limit = Math.max(parseInt(req.query.limit || "20", 10), 1)
    const skip = (page - 1) * limit

    const [likes, total] = await Promise.all([
        Like.find({ likedBy: req.user._id, video: { $exists: true } })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate({ path: "video", select: "title thumbnail owner views createdAt" }),
        Like.countDocuments({ likedBy: req.user._id, video: { $exists: true } })
    ])

    // map to videos with likeId info
    const likedVideos = likes.map(l => ({
        likeId: l._id,
        video: l.video
    }))

    return res.status(200).json(new ApiResponse(200, {
        likedVideos,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    }, "Liked videos fetched"))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}
