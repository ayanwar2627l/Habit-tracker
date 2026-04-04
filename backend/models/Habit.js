import mongoose from "mongoose";

// Each day entry tracks whether a habit was completed on that date
const dateEntrySchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  completed: { type: Boolean, default: false },
});

const habitSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: "General",
      trim: true,
    },
    // timerMinutes: how long the user wants to focus on this habit (0 = no timer)
    timerMinutes: {
      type: Number,
      default: 0,
    },
    dates: [dateEntrySchema],
  },
  { timestamps: true }
);

export default mongoose.model("Habit", habitSchema);
