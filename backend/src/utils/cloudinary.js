// src/utils/cloudinary.js
import "dotenv/config";  // <--- must be first

import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Uploads to Cloudinary from:
 *  - a local file path: uploadOnCloudinary('/tmp/myfile.mp4', { resource_type: 'video' })
 *  - a Buffer: uploadOnCloudinary(buffer, { resource_type: 'video', filename: 'name.mp4' })
 *  - a readable stream: uploadOnCloudinary(stream, { resource_type: 'image' })
 *
 * Returns { url, public_id, raw } or throws an Error with `.original` set to the underlying error.
 */
export async function uploadOnCloudinary(source, options = {}) {
  if (!source) throw new Error("No source provided to uploadOnCloudinary");

  const uploadOptions = {
    resource_type: options.resource_type || "auto", // use 'video' for videos to be explicit
    folder: options.folder || "video_app",
    use_filename: true,
    unique_filename: false,
    overwrite: false,
    ...options,
  };

  // helper to upload a readable stream (used for Buffers or streams)
  const uploadStreamPromise = (readable) =>
    new Promise((resolve, reject) => {
      const cb = (err, result) => {
        if (err) return reject(err);
        resolve(result);
      };
      const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, cb);
      readable.pipe(uploadStream);
    });

  // Handle Buffer (create a readable stream and pipe)
  if (Buffer.isBuffer(source)) {
    try {
      const { Readable } = await import("stream");
      const s = new Readable();
      s.push(source);
      s.push(null);
      const response = await uploadStreamPromise(s);
      return {
        url: response.secure_url || response.url,
        public_id: response.public_id,
        raw: response,
      };
    } catch (err) {
      const e = new Error("Cloudinary upload (buffer) failed: " + (err?.message || String(err)));
      e.original = err;
      throw e;
    }
  }

  // Handle local file path
  if (typeof source === "string") {
    try {
      // verify file exists and is readable
      await fs.access(source);
    } catch (accessErr) {
      throw new Error("Local file not found or not readable: " + source);
    }

    try {
      // For very large files you may prefer cloudinary.uploader.upload_large(source, uploadOptions)
      const response = await cloudinary.uploader.upload(source, uploadOptions);

      // ✅ remove temp file asynchronously — ignore unlink errors but log them
      try {
        await fs.unlink(source);
      } catch (unlinkErr) {
        console.warn("uploadOnCloudinary: failed to remove temp file:", source, unlinkErr?.message || unlinkErr);
      }

      return {
        url: response.secure_url || response.url,
        public_id: response.public_id,
        raw: response,
      };
    } catch (err) {
      // best-effort: try to remove temp file on failure
      try {
        await fs.unlink(source).catch(() => {});
      } catch (_) {}

      const e = new Error("Cloudinary upload failed: " + (err?.message || String(err)));
      e.original = err;
      throw e;
    }
  }

  // Handle readable stream (object with .pipe)
  if (source && typeof source.pipe === "function") {
    try {
      const response = await uploadStreamPromise(source);
      return {
        url: response.secure_url || response.url,
        public_id: response.public_id,
        raw: response,
      };
    } catch (err) {
      const e = new Error("Cloudinary upload (stream) failed: " + (err?.message || String(err)));
      e.original = err;
      throw e;
    }
  }

  throw new Error("Unsupported source type for uploadOnCloudinary. Provide a file path, Buffer, or readable stream.");
}
