import mongoose from "mongoose";
import dotenv from "dotenv";
import users from "./data/users.js";
import { products } from "./data/products.js";
import { categories } from "./data/categories.js";
import User from "./models/userModel.js";
import Product from "./models/productModel.js";
import Order from "./models/orderModel.js";
import Category from "./models/categoryModel.js";
import connectDB from "./config/db.js";

dotenv.config();

connectDB();

const importData = async (): Promise<void> => {
  try {
    // Delete existing data
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Category.deleteMany();

    // Drop stale indexes that may conflict with current schema
    await Product.collection.dropIndexes().catch(() => {});

    // Seed users
    const createdUsers = await User.insertMany(users);
    const admin = createdUsers[0]._id;

    // Seed categories and create a map from category name to category ID
    const createdCategories = await Category.insertMany(categories);
    const categoryMap = createdCategories.reduce(
      (acc: Record<string, mongoose.Types.ObjectId>, category) => {
        acc[category.name] = category._id as mongoose.Types.ObjectId;
        return acc;
      },
      {}
    );

    // Map products to include user and category ID
    const sampleProducts = products.map((product) => ({
      ...product,
      user: admin,
      category: categoryMap[product.category],
    }));

    // Seed products with category IDs and adminUser
    await Product.insertMany(sampleProducts);

    console.log("✅ Data Imported!");
    process.exit();
  } catch (error) {
    console.error("❌ Import error:", error);
    process.exit(1);
  }
};

const destroyData = async (): Promise<void> => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Category.deleteMany();

    console.log("🗑  Data Destroyed!");
    process.exit();
  } catch (error) {
    console.error("❌ Destroy error:", error);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
