import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`,
      {
        autoIndex: true, // build indexes (disable in prod for performance if needed)
        maxPoolSize: 10, // connection pool size
        serverSelectionTimeoutMS: 5000, // fail quickly if DB is unreachable
      }
    );

    console.log(
      `✅ MongoDB connected: ${connectionInstance.connection.host}/${connectionInstance.connection.name}`
    );

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("MongoDB connection closed on app termination (SIGINT).");
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      await mongoose.connection.close();
      console.log("MongoDB connection closed on app termination (SIGTERM).");
      process.exit(0);
    });

    return connectionInstance;
  } catch (error) {
    console.error("❌ MongoDB connection FAILED:", error.message);
    process.exit(1);
  }
};

export default connectDB;
