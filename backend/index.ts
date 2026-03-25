import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js";
import app from "./app.js";

const port = process.env.PORT || 5001;

const startServer = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`🚀 Server running on port: ${port}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  });
};

startServer();
