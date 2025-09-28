import mongoose from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

// GET /api/comments/:videoId?page=1&limit=10
const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const page = Math.max(parseInt(req.query.page || "1", 10), 1)
    const limit = Math.max(parseInt(req.query.limit || "10", 10), 1)

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId")
    }

    const skip = (page - 1) * limit

    const [comments, total] = await Promise.all([
        Comment.find({ video: videoId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("owner", "username avatar"), // ✅ updated to "owner"
        Comment.countDocuments({ video: videoId })
    ])

    return res.status(200).json(new ApiResponse(200, {
        comments,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    }, "Comments fetched successfully"))
})

const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { text } = req.body

    if (!text) {
        throw new ApiError(400, "text is required")
    }

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId")
    }

    const comment = new Comment({
        video: videoId,
        owner: req.user._id,
        content: text
    })

    await comment.save()
    await comment.populate("owner", "username avatar")

    return res.status(201).json(new ApiResponse(201, comment, "Comment added"))
})

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    const { text } = req.body

    if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid commentId")
    }

    if (!text) {
        throw new ApiError(400, "text is required to update the comment")
    }

    const comment = await Comment.findById(commentId)
    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }

    if (comment.owner.toString() !== req.user._id.toString()) { // ✅ updated check
        throw new ApiError(403, "Not authorized to update this comment")
    }

    comment.content = text
    comment.updatedAt = new Date()
    await comment.save()

    await comment.populate("owner", "username avatar")

    return res.status(200).json(new ApiResponse(200, comment, "Comment updated"))
})

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params

    if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid commentId")
    }

    const comment = await Comment.findById(commentId)
    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }

    if (comment.owner.toString() !== req.user._id.toString()) { // ✅ updated check
        throw new ApiError(403, "Not authorized to delete this comment")
    }

    await Comment.findByIdAndDelete(commentId)

    return res.status(200).json(new ApiResponse(200, null, "Comment deleted"))
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}
