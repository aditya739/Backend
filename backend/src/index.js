// require('dotenv').config({path: './env'})
// index.js
import dotenv from "dotenv";

// load env as early as possible
dotenv.config({ path: "./.env" });

import connectDB from "./db/index.js";
import { app } from "./app.js";

const PORT = process.env.PORT || 8000;


let server = null;

async function start() {
  try {
    // Connect to DB
    await connectDB();

    // Start express server
    server = app.listen(PORT, () => {
      console.log(`⚙️  Server is running at http://localhost:${PORT}`);
      console.log(`📦 NODE_ENV=${process.env.NODE_ENV || "development"}`);
    });

    // Graceful shutdown helper
    const gracefulShutdown = (signal) => {
      return async () => {
        try {
          console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
          if (server) {
            server.close(() => {
              console.log("HTTP server closed.");
            });
          }
          // wait a short time for ongoing requests to finish, then exit
          setTimeout(() => {
            console.log("Exiting process");
            process.exit(0);
          }, 500);
        } catch (err) {
          console.error("Error during graceful shutdown", err);
          process.exit(1);
        }
      };
    };

    process.on("SIGINT", gracefulShutdown("SIGINT"));
    process.on("SIGTERM", gracefulShutdown("SIGTERM"));

    // Crash on unhandled rejections & uncaught exceptions so process managers can restart
    process.on("unhandledRejection", (reason, promise) => {
      console.error("Unhandled Rejection at:", promise, "reason:", reason);
      process.exit(1);
    });

    process.on("uncaughtException", (err) => {
      console.error("Uncaught Exception thrown:", err);
      process.exit(1);
    });
  } catch (err) {
    console.error("Failed to start server:", err?.message || err);
    process.exit(1);
  }
}

start();








/*
import express from "express"
const app = express()
( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("errror", (error) => {
            console.log("ERRR: ", error);
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`);
        })

    } catch (error) {
        console.error("ERROR: ", error)
        throw err
    }
})()

*/