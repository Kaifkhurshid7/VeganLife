import mongoose from 'mongoose';

// A user's Web Push subscription (per device/browser). endpoint is globally unique
// so re-subscribing on a new key set for the same endpoint just updates in place.
const pushSubscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  endpoint: { type: String, required: true, unique: true },
  keys: {
    p256dh: { type: String, required: true },
    auth: { type: String, required: true },
  },
}, { timestamps: true });

// Fetch all of a user's devices when sending a push
pushSubscriptionSchema.index({ user: 1 });

export default mongoose.model('PushSubscription', pushSubscriptionSchema);
