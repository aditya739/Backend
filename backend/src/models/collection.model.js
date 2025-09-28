import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
    isPrivate: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Collection = mongoose.model("Collection", collectionSchema);