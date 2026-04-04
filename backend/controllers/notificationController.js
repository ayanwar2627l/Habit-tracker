import webpush from "web-push";
import Subscription from "../models/Subscription.js";

// Save or update a push subscription for the logged-in user
export const saveSubscription = async (req, res) => {
  try {
    const { subscription } = req.body;
    if (!subscription) {
      return res.status(400).json({ message: "Subscription object is required" });
    }

    // Replace any existing subscription for this user (one per user is enough)
    await Subscription.findOneAndUpdate(
      { user: req.user.id },
      { subscription },
      { upsert: true, new: true }
    );

    res.status(201).json({ message: "Subscription saved" });
  } catch (err) {
    console.error("saveSubscription error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Send a push notification to the current user (called when a habit timer fires)
export const sendNotification = async (req, res) => {
  try {
    const { title, body } = req.body;
    const sub = await Subscription.findOne({ user: req.user.id });

    if (!sub) {
      return res.status(404).json({ message: "No subscription found — please enable notifications first" });
    }

    const payload = JSON.stringify({ title: title || "Habit Timer Done!", body: body || "Great job! Time to check in." });

    await webpush.sendNotification(sub.subscription, payload);

    res.json({ message: "Notification sent" });
  } catch (err) {
    console.error("sendNotification error:", err);
    // 410 Gone means the subscription expired — clean it up
    if (err.statusCode === 410) {
      await Subscription.findOneAndDelete({ user: req.user.id });
      return res.status(410).json({ message: "Subscription expired, please re-enable notifications" });
    }
    res.status(500).json({ message: err.message });
  }
};
