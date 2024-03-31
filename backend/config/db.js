import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({path: "env"});

const MONGO_URL =
  "mongodb+srv://alexandra:alexandra@cluster0.mnwgyco.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(`Successfully connected to MongoDB 👉`);
  } catch (error) {
    console.log(`ERROR: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
