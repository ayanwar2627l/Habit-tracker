// backend/controllers/habitController.js
import Habit from "../models/Habit.js";

export const getHabits = async (req, res) => {
  try {
    let habits = await Habit.find({ user: req.user.id });

    habits = habits.map(habit => {
      const totalDays = habit.dates.length;
      const completedDays = habit.dates.filter(d => d.completed).length;
      const progress = totalDays === 0 ? 0 : Math.round((completedDays / totalDays) * 100);

      return { ...habit._doc, progress }; // add progress field
    });

    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const addHabit = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const habit = await Habit.create({ user: req.user.id, title, dates: [] });
    res.status(201).json(habit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ message: "Habit not found" });

    const today = new Date().toDateString();
    const existing = habit.dates.find((d) => new Date(d.date).toDateString() === today);

    if (existing) existing.completed = !existing.completed;
    else habit.dates.push({ date: new Date(), completed: true });

    await habit.save();
    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ message: "Habit not found" });

    // ownership check
    if (habit.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // use findByIdAndDelete (works reliably)
    await Habit.findByIdAndDelete(req.params.id);

    return res.json({ message: "Habit deleted successfully" });
  } catch (error) {
    console.error("deleteHabit error:", error);
    return res.status(500).json({ message: error.message });
  }
};


