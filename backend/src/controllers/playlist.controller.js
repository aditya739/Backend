import mongoose, { isValidObjectId } from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

// Create a new playlist
const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body

    if (!name || !description) {
        throw new ApiError(400, "Both name and description are required")
    }

    const playlist = new Playlist({
        name: name.trim(),
        description: description.trim(),
        owner: req.user._id,
        videos: []
    })

    await playlist.save()

    return res.status(201).json(new ApiResponse(201, playlist, "Playlist created"))
})

// Get all playlists for a user
const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid userId")
    }

    const playlists = await Playlist.find({ owner: userId }).sort({ createdAt: -1 })

    return res.status(200).json(new ApiResponse(200, playlists, "User playlists fetched"))
})

// Get playlist by ID
const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlistId")
    }

    const playlist = await Playlist.findById(playlistId)
        .populate("videos", "title thumbnail owner views createdAt")
        .populate("owner", "username avatar")

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    return res.status(200).json(new ApiResponse(200, playlist, "Playlist fetched"))
})

// Add video to playlist
const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlistId or videoId")
    }

    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not authorized to modify this playlist")
    }

    if (playlist.videos.some(v => v.toString() === videoId)) {
        return res.status(200).json(new ApiResponse(200, playlist, "Video already in playlist"))
    }

    playlist.videos.push(videoId)
    await playlist.save()

    const updated = await Playlist.findById(playlistId).populate("videos", "title thumbnail owner views createdAt")

    return res.status(200).json(new ApiResponse(200, updated, "Video added to playlist"))
})

// Remove video from playlist
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlistId or videoId")
    }

    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not authorized to modify this playlist")
    }

    playlist.videos = playlist.videos.filter(v => v.toString() !== videoId)
    await playlist.save()

    const updated = await Playlist.findById(playlistId).populate("videos", "title thumbnail owner views createdAt")

    return res.status(200).json(new ApiResponse(200, updated, "Video removed from playlist"))
})

// Delete playlist
const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlistId")
    }

    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not authorized to delete this playlist")
    }

    await Playlist.findByIdAndDelete(playlistId)

    return res.status(200).json(new ApiResponse(200, null, "Playlist deleted"))
})

// Update playlist (name or description)
const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlistId")
    }

    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not authorized to update this playlist")
    }

    if (name) playlist.name = name.trim()
    if (description) playlist.description = description.trim()

    await playlist.save()

    const updated = await Playlist.findById(playlistId).populate("videos", "title thumbnail owner views createdAt")

    return res.status(200).json(new ApiResponse(200, updated, "Playlist updated"))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
