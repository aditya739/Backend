// src/middlewares/auth.middleware.js

import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

//---------------------------------------------
// VERIFY JWT MIDDLEWARE
// This middleware checks if the request contains
// a valid access token (from cookie or Authorization header).
// If valid → attaches user object to req.user and continues.
// If invalid/missing → throws ApiError (401 Unauthorized).
//---------------------------------------------
export const verifyJWT = asyncHandler(async (req, res, next) => {
  let token = req.cookies?.accessToken;

  // If no cookie, check Authorization header
  if (!token) {
    const authHeader = req.header("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.replace("Bearer ", "");
    }
  }

  // If no token at all → block request
  if (!token) {
    throw new ApiError(401, "Unauthorized request - No token provided");
  }

  try {
    // Verify JWT using secret from .env
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Find user in DB using decoded ID
    const user = await User.findById(decoded?._id).select(
      "-password -refreshToken"
    );

    // If no user found → block request
    if (!user) {
      throw new ApiError(401, "User not found or token invalid");
    }

    // Attach user to request so controllers can use it
    req.user = user;

    // Continue to next middleware/controller
    next();
  } catch (err) {
    // Handle token expiry separately for clearer error
    if (err.name === "TokenExpiredError") {
      throw new ApiError(401, "Access token expired");
    }
    // Handle all other JWT errors
    throw new ApiError(401, err.message || "Invalid access token");
  }
});
