import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema({
  subscriber: {
    type: Schema.Types.ObjectId, // one who is subscribing
    ref: "User",
    required: true,
    index: true
  },
  channel: {
    type: Schema.Types.ObjectId, // the channel being subscribed to
    ref: "User",
    required: true,
    index: true
  }
}, { timestamps: true });

// Prevent duplicate subscriptions: one subscriber cannot subscribe to same channel twice
subscriptionSchema.index({ subscriber: 1, channel: 1 }, { unique: true });

// Optional: friendly instance method (example) to check ownership — not required
subscriptionSchema.methods.isSubscriber = function(userId) {
  return this.subscriber.toString() === userId.toString();
};

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
