import mongoose from 'mongoose';

const BlackList = new mongoose.Schema(
  {

    idUser: {
      type: String,
      require: true,
    },

    token: {
      type: String,
      require: true,
    },

  },

  {
    timestamps: true,
    versionKey: false,
  },

);

export default mongoose.model('BlackList', BlackList);
