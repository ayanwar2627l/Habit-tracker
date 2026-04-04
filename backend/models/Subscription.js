import mongoose from "mongoose";

// Stores Web Push subscriptions so we can send server-side push notifications
const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // The full push subscription object from the browser (endpoint + keys)
    subscription: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Subscription", subscriptionSchema);
