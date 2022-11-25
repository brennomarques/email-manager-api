import mongoose from 'mongoose';

const SendMail = new mongoose.Schema(
  {

    name: {
      type: String,
      require: true,
    },

    email: {
      type: String,
      require: true,
      lowercase: true,
    },

    priority: {
      type: Number,
      require: true,
      select: true,
      default: 0,
    },

    subject: {
      type: String,
      require: true,
      select: true,
    },

    context: {
      type: String,
      require: true,
      select: true,
    },

    status: {
      type: Number,
      require: true,
      select: true,
      default: 0,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      require: true,
      select: true,
    },

    dueDate: {
      type: Date,
      require: true,
      select: true,
      default: dueDateDefault(),
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

function dueDateDefault() {
  const now = new Date();
  now.setFullYear(now.getFullYear() + 1);
  return now;
}

export default mongoose.model('SendMail', SendMail);
