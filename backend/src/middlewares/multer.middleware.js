// src/middlewares/multer.middleware.js
import multer from "multer";

// Use memory storage for Vercel serverless environment
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 1024 }, // 1GB dev limit
  fileFilter(req, file, cb) {
    // allow images and video mime types
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
});
