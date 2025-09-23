// src/controllers/user.controller.js

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiRespons.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

/* ------------------------------------------------------
   Helper: Generate Access + Refresh Tokens for a user
------------------------------------------------------ */
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Save refresh token in DB
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while generating tokens"
    );
  }
};

/* ------------------------------------------------------
   REGISTER USER
------------------------------------------------------ */
const registerUser = asyncHandler(async (req, res) => {
  console.log("req.body:", req.body);
  console.log("req.files:", req.files);

  const { fullname, email, username, password } = req.body || {};

  // Ensure all required fields are provided
  if ([fullname, email, username, password].some((f) => !f?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if username or email already exists
  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) throw new ApiError(409, "User already exists");

  // Get avatar and cover image paths from multer
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) throw new ApiError(400, "Avatar file is required");

  // Upload files to Cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = coverImageLocalPath
    ? await uploadOnCloudinary(coverImageLocalPath)
    : null;

  if (!avatar) throw new ApiError(500, "Avatar upload failed");

  // Create new user in DB
  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  // Select safe user fields
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser)
    throw new ApiError(500, "Something went wrong while registering the user");

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

/* ------------------------------------------------------
   LOGIN USER
------------------------------------------------------ */
const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "Username or email is required");
  }

  const user = await User.findOne({ $or: [{ username }, { email }] });
  if (!user) throw new ApiError(404, "User does not exist");

  // Validate password
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password");
  }

  // Generate tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // Cookie options (secure + httpOnly)
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

/* ------------------------------------------------------
   LOGOUT USER
------------------------------------------------------ */
const logoutUser = asyncHandler(async (req, res) => {
  // Remove refresh token from DB
  await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: "" } },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async(req,res)=>{


 const incomingRefreshToken = req.cookie.refreshToken ||req.body.refreshToken

if(!incomingRefreshToken){
  throw new ApiError(401,"unauthorized request")
}

try {
  const decodedToken =jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);
  const user = User.findById(decodedToken?._id)
  
  
  if(!user){
    throw new ApiError(401,"invalid refresh token")
  }
  
  if(incomingRefreshToken !==user?.refreshToken){
  
    throw new ApiError(401,"refresh token is expier or used")
  }
  
  
  const option = {
    http:true,
    secure:true
  }
  
  const {accessToken,newRefreshToken}=await generateAccessAndRefreshToken(user._id)
  
  return res.status(200)
  .cookie("accessToken",accessToken,option)
  .cookie("refreshToken",newRefreshToken,option)
  .json(
    new ApiResponse(
      200,
      {
        accessToken,refreshToken: newRefreshToken
      },"access token refresh"
    )
  )
} catch (error) {
throw new ApiError(401, error?.message || "invalid refresh Token")
  
}

})





export { registerUser, loginUser, logoutUser,refreshAccessToken };
