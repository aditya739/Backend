import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Create express app
const app = express();

// Enable CORS (so frontend can talk to backend)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000", // frontend URL
    credentials: true, // allow cookies if needed
  })
);

// Parse JSON data (limit request size to 50MB)
app.use(express.json({ limit: "50mb" }));

// Handle form-data (urlencoded)
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Serve static files from "public" folder
app.use(express.static("public"));

// Parse cookies
app.use(cookieParser());

// Import routes
import userRouter from "./routes/user.routes.js";

// Declare routes
// Final endpoint will look like: /api/v1/user/register
app.use("/api/v1/user", userRouter);

// Export app so server.js can use it
export { app };
