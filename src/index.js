// Load environment variables
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import { app } from "./app.js";
import connectDb from "./db/index.js";

// Connect to DB and start the server
connectDb()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`✅ Server is running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((error) => {
    console.error("❌ DB Connection Error:", error);
    process.exit(1); // exit process if DB connection fails
  });
