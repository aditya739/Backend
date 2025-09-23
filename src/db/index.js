import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDb = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ DB connection failed:", error);
    process.exit(1);
  }
};

export default connectDb;
