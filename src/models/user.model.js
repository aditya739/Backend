import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"; // for hashing passwords
import jwt from "jsonwebtoken"; // for JWT tokens

// Define the user schema
const userSchema = new Schema(
  {
   
    username: { type: String, required: true, unique: true, index: true },

   
    email: { type: String, required: true, unique: true },

  
    password: { type: String, required: [true, "password is required"] },

    fullname: { type: String, required: true },

    avatar: { type: String, required: true },


    coverImage: { type: String, default: "" },

    
    watchHistory: [{ type: Schema.Types.ObjectId, ref: "Video" }],

    // Refresh token for JWT refresh mechanism
    refreshToken: { type: String, default: "" },
  },
  {
    // Automatically adds createdAt and updatedAt timestamps
    timestamps: true,
  }
);

/* -------------------
   Pre-save middleware
------------------- */
// Hash the password before saving if it is modified
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // skip if password not changed
  this.password = await bcrypt.hash(this.password, 10); // hash password with saltRounds = 10
  next();
});

/* -------------------
   Instance Methods
------------------- */

// Compare a plain text password with hashed password
userSchema.methods.isPasswordCorrect = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET, // secret key from environment
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY } // token expiry, e.g., "1h"
  );
};

// Generate JWT refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET, // secret key from environment
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY } // e.g., "7d"
  );
};

// Create and export the User model
export const User = mongoose.model("User", userSchema);
