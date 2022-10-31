import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const User = new mongoose.Schema(
  {

    name: {
      type: String,
      require: true,
    },

    email: {
      type: String,
      require: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      require: true,
      select: false,
    },

    status: {
      type: Number,
      require: true,
    },

    email_verified_at: {
      type: Date,
      require: false,
    },

    role: {
      type: String,
      require: true,
    },

    avatar: {
      type: String,
      require: false,
    },

    passwordResetToken: {
      type: String,
      select: false,
    },

    passwordResetExpires: {
      type: Date,
      select: false,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

  },

  {
    timestamps: true,
    versionKey: false,
  },

);

User.pre('save', async function hashPassword(next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

export default mongoose.model('User', User);
