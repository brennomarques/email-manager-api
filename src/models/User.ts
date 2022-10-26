import mongoose from 'mongoose';
import crypto from 'crypto';

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
      set: (value) => crypto.createHash('md5').update(value).digest('hex'),
    },

    status: {
      type: String,
      require: true,
    },

    email_verified_at: {
      type: Date,
      require: false,
    },

    avatar: {
      type: String,
      require: false,
    },

  },

  {
    timestamps: true,
    versionKey: false,
  },

);

export default mongoose.model('User', User);
