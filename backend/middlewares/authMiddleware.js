import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "./asyncHandler.js";

const authenticate = asyncHandler(async (req, res, next) => {
    try {
      let token = req.header("Authorization");
  
      if (!token) {
        return res.status(403).send("Access Denied");
      }
  
      if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length).trimLeft();
      }
  
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      req.user = verified;
      next();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});



const authorizeAdmin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next();
  } else {
    res.status(401).json({ message: "Not authorized as an admin." });
  }
});

export { authenticate, authorizeAdmin };


