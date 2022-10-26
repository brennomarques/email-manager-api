import mongoose from 'mongoose';

// const {
//   DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME,
// } = process.env;

// DB_URI: mongodb://172.17.0.1:27017/projetonomeDev

export default function connectDB(): void {
  mongoose.connect('mongodb://root:example@mongodb:27017/mail-manager-dev?authSource=admin');
  mongoose.connection.on('error', () => console.error('connection error:'));
  mongoose.connection.once('open', () => console.log('database connected! 👈️'));
}
