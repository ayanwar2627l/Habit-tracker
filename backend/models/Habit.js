import mongoose from "mongoose";

const habitSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  dates: [
    {
      date: { type: Date, default: Date.now },
      completed: { type: Boolean, default: false },
    },
  ],
});

export default mongoose.model("Habit", habitSchema);
