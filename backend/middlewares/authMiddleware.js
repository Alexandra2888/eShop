import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "./asyncHandler.js";

const authenticate = asyncHandler(async (req, res, next) => {
  if (req.cookies.token) {
    //! Verify the token
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET); //the actual login user
    //add the user to the req obj
    req.user = await User.findById(decoded?.id).select("-password");
    return next();
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

 
});

// ...

const authorizeAdmin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next();
  } else {
    res.status(401).json({ message: "Not authorized as an admin." });
  }
});

export { authenticate, authorizeAdmin };


