import mongoose from "mongoose";
import { ICategory } from "../types/index.js";

const categorySchema = new mongoose.Schema<ICategory>({
  name: {
    type: String,
    trim: true,
    required: true,
    maxLength: 32,
    unique: true,
  },
});

export default mongoose.model<ICategory>("Category", categorySchema);
