// src/utils/cloudinary.js
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configure Cloudinary with env vars
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Debug check
// console.log("CLOUDINARY CONFIG USED:", {
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY ? "✅ loaded" : "❌ missing",
//   api_secret: process.env.CLOUDINARY_API_SECRET ? "✅ loaded" : "❌ missing",
// });

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Upload file
    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // Remove temp file
    fs.unlinkSync(localFilePath);

    return result;
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    // Cleanup on failure
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return null;
  }
};

export { uploadOnCloudinary };
