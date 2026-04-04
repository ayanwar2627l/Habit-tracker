import Habit from "../models/Habit.js";

export const getHabits = async (req, res) => {
  try {
    let habits = await Habit.find({ user: req.user.id }).sort({ createdAt: -1 });

    // Compute a live progress % before sending to the client
    habits = habits.map((habit) => {
      const total = habit.dates.length;
      const done = habit.dates.filter((d) => d.completed).length;
      const progress = total === 0 ? 0 : Math.round((done / total) * 100);
      return { ...habit._doc, progress };
    });

    res.json(habits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addHabit = async (req, res) => {
  try {
    const { title, category, timerMinutes } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const habit = await Habit.create({
      user: req.user.id,
      title: title.trim(),
      category: category || "General",
      timerMinutes: timerMinutes || 0,
      dates: [],
    });

    res.status(201).json(habit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const toggleHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ message: "Habit not found" });

    const todayStr = new Date().toDateString();
    const existing = habit.dates.find(
      (d) => new Date(d.date).toDateString() === todayStr
    );

    if (existing) {
      existing.completed = !existing.completed;
    } else {
      habit.dates.push({ date: new Date(), completed: true });
    }

    await habit.save();

    // Re-attach progress before responding
    const total = habit.dates.length;
    const done = habit.dates.filter((d) => d.completed).length;
    const progress = total === 0 ? 0 : Math.round((done / total) * 100);

    res.json({ ...habit._doc, progress });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ message: "Habit not found" });

    if (habit.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await Habit.findByIdAndDelete(req.params.id);
    res.json({ message: "Habit deleted successfully" });
  } catch (err) {
    console.error("deleteHabit error:", err);
    res.status(500).json({ message: err.message });
  }
};
