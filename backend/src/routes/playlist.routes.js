// routes/playlist.routes.js
import { Router } from "express";
import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Protect all playlist routes
router.use(verifyJWT);

/*
  Routes:
  - POST   /playlists/                         -> create playlist
  - GET    /playlists/user/:userId             -> get all playlists of a user
  - GET    /playlists/:playlistId              -> get single playlist
  - PATCH  /playlists/:playlistId              -> update playlist
  - DELETE /playlists/:playlistId              -> delete playlist
  - POST   /playlists/:playlistId/videos/:videoId -> add video to playlist
  - DELETE /playlists/:playlistId/videos/:videoId -> remove video from playlist
*/

// Create a new playlist
router.post("/", createPlaylist);

// Get all playlists for a user
router.get("/user/:userId", getUserPlaylists);

// Playlist CRUD
router
  .route("/:playlistId")
  .get(getPlaylistById)
  .patch(updatePlaylist)
  .delete(deletePlaylist);

// Add/remove video to/from playlist
router.post("/:playlistId/videos/:videoId", addVideoToPlaylist);
router.delete("/:playlistId/videos/:videoId", removeVideoFromPlaylist);

export default router;
