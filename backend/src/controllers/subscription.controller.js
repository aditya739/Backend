import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channelId")
    }

    // prevent subscribing to self
    if (req.user._id.toString() === channelId.toString()) {
        throw new ApiError(400, "Cannot subscribe to your own channel")
    }

    const channel = await User.findById(channelId)
    if (!channel) {
        throw new ApiError(404, "Channel not found")
    }

    const existing = await Subscription.findOne({ subscriber: req.user._id, channel: channelId })

    if (existing) {
        // unsubscribe
        await Subscription.findByIdAndDelete(existing._id)
        return res.status(200).json(new ApiResponse(200, { subscribed: false }, "Unsubscribed"))
    } else {
        const sub = new Subscription({ subscriber: req.user._id, channel: channelId })
        await sub.save()
        return res.status(201).json(new ApiResponse(201, { subscribed: true, subscriptionId: sub._id }, "Subscribed"))
    }
})

// Get subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channelId")
    }

    // fetch subscribers and populate basic user info
    const subs = await Subscription.find({ channel: channelId }).populate("subscriber", "username avatar")

    const subscribers = subs.map(s => s.subscriber)

    return res.status(200).json(new ApiResponse(200, subscribers, "Subscribers fetched"))
})

// Get channels a user has subscribed to
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriberId")
    }

    const subs = await Subscription.find({ subscriber: subscriberId }).populate("channel", "username avatar")

    const channels = subs.map(s => s.channel)

    return res.status(200).json(new ApiResponse(200, channels, "Subscribed channels fetched"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}
