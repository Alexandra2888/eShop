import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
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

const importData = async () => {
  try {
    // Delete existing data
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Category.deleteMany();

    // Seed users
    const createdUsers = await User.insertMany(users);
    const admin = createdUsers[0]._id;

    // Seed categories and create a map from category name to category ID
    const createdCategories = await Category.insertMany(categories);
    const categoryMap = createdCategories.reduce((acc, category) => {
      acc[category.name] = category._id;
      return acc;
    }, {});

    // Map products to include user and category ID
    const sampleProducts = products.map((product) => ({
      ...product,
      user: admin,
      category: categoryMap[product.category],
    }));

    // Seed products with category IDs and adminUser
    await Product.insertMany(sampleProducts);

    console.log("Data Imported!".green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Category.deleteMany();

    console.log("Data Destroyed!".red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
