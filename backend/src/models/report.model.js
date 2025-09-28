import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    video: { type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true },
    reason: { 
      type: String, 
      enum: ["spam", "inappropriate", "copyright", "harassment", "other"], 
      required: true 
    },
    description: { type: String, maxlength: 500 },
    status: { 
      type: String, 
      enum: ["pending", "reviewed", "resolved"], 
      default: "pending" 
    },
  },
  { timestamps: true }
);

export const Report = mongoose.model("Report", reportSchema);