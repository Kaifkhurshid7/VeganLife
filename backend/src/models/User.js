import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 50 },
  username: { type: String, required: true, unique: true, lowercase: true, trim: true, minlength: 3, maxlength: 20 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  avatar: { type: String, default: '' },
  bio: { type: String, default: '', maxlength: 300 },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  refreshToken: { type: String, default: null },

  // Gamification
  sustainabilityScore: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  completedChallenges: [{ type: String }],
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],

  // Settings
  isVerified: { type: Boolean, default: false },
  lastLogin: { type: Date },
}, { timestamps: true });

// Indexes for query performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ role: 1 });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    name: this.name,
    username: this.username,
    email: this.email,
    avatar: this.avatar,
    bio: this.bio,
    role: this.role,
    sustainabilityScore: this.sustainabilityScore,
    streak: this.streak,
    completedChallenges: this.completedChallenges,
    bookmarks: this.bookmarks,
    isVerified: this.isVerified,
    createdAt: this.createdAt,
  };
};

export default mongoose.model('User', userSchema);
