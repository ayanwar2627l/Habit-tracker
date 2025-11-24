import express from "express";
import { registerUser, loginUser, getUser } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

// import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected route
router.get("/profile", protect, getUser);

export default router;
