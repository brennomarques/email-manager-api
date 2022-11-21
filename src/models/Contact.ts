import mongoose from 'mongoose';

const Contact = new mongoose.Schema(
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

    phone: {
      type: String,
      require: false,
      select: true,
      default: null,
    },

    status: {
      type: Boolean,
      require: true,
      select: true,
      default: true,
    },

    IdUser: {
      type: String,
      require: true,
      select: true,
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

export default mongoose.model('Contact', Contact);
