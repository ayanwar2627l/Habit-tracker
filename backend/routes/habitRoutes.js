// backend/routes/habitRoutes.js
import express from "express";
import { getHabits, addHabit, toggleHabit, deleteHabit } from "../controllers/habitController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getHabits);
router.post("/", protect, addHabit);
router.put("/:id/toggle", protect, toggleHabit);
router.delete("/:id", protect, deleteHabit);

export default router;
