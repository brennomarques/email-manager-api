import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const STATUS = {
  ENABLED: 0,
  DISABLED: 1,
  CONFIRM_REGISTRATION: 2,
};

const User = new mongoose.Schema(
  {

    name: {
      type: String,
      require: true,
    },

    email: {
      type: String,
      trim: true,
      required: [true, 'Please enter your email'],
      unique: true,
      lowercase: true,
      validate: [validateEmail, 'Please enter a valid email'],
    },

    password: {
      type: String,
      require: true,
      select: false,
    },

    status: {
      type: Number,
      require: true,
      default: STATUS.CONFIRM_REGISTRATION,
    },

    email_verified_at: {
      type: Date,
      require: false,
    },

    role: {
      type: String,
      require: true,
      default: null,
    },

    avatar: {
      type: String,
      require: false,
      default: null,
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

function validateEmail(email: string) {
  // eslint-disable-next-line no-useless-escape
  const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return reg.test(email);
}

export default mongoose.model('User', User);
