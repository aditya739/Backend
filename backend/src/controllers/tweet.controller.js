// tweet.controller.js
import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

// ----------------------------
// POST /api/tweets
// Create a new tweet
// ----------------------------
const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body

    if (!content || typeof content !== "string" || content.trim().length === 0) {
        throw new ApiError(400, "Tweet content is required")
    }

    const tweet = new Tweet({
        content: content.trim(),
        owner: req.user._id // matches your model's `owner` field
    })

    await tweet.save()
    await tweet.populate("owner", "username avatar")

    return res.status(201).json(new ApiResponse(201, tweet, "Tweet created successfully"))
})

// ----------------------------
// GET /api/tweets/:userId
// Get all tweets by a specific user (paginated)
// ----------------------------
const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params
    const page = Math.max(parseInt(req.query.page || "1", 10), 1)
    const limit = Math.max(parseInt(req.query.limit || "20", 10), 1)
    const skip = (page - 1) * limit

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid userId")
    }

    const [tweets, total] = await Promise.all([
        Tweet.find({ owner: userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("owner", "username avatar"),
        Tweet.countDocuments({ owner: userId })
    ])

    return res.status(200).json(new ApiResponse(200, {
        tweets,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    }, "User tweets fetched"))
})

// ----------------------------
// PUT /api/tweets/:tweetId
// Update an existing tweet (only owner can update)
// ----------------------------
const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    const { content } = req.body

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweetId")
    }

    if (!content || typeof content !== "string" || content.trim().length === 0) {
        throw new ApiError(400, "Tweet content is required for update")
    }

    const tweet = await Tweet.findById(tweetId)
    if (!tweet) {
        throw new ApiError(404, "Tweet not found")
    }

    if (tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not authorized to update this tweet")
    }

    tweet.content = content.trim()
    tweet.updatedAt = new Date()
    await tweet.save()
    await tweet.populate("owner", "username avatar")

    return res.status(200).json(new ApiResponse(200, tweet, "Tweet updated successfully"))
})

// ----------------------------
// DELETE /api/tweets/:tweetId
// Delete a tweet (only owner can delete)
// ----------------------------
const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweetId")
    }

    const tweet = await Tweet.findById(tweetId)
    if (!tweet) {
        throw new ApiError(404, "Tweet not found")
    }

    if (tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not authorized to delete this tweet")
    }

    await Tweet.findByIdAndDelete(tweetId)

    return res.status(200).json(new ApiResponse(200, null, "Tweet deleted successfully"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
