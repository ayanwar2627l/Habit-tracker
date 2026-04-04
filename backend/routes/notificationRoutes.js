import express from "express";
import { saveSubscription, sendNotification } from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Both routes are protected so only logged-in users can access them
router.post("/subscribe", protect, saveSubscription);
router.post("/send", protect, sendNotification);

export default router;
