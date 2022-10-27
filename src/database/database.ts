import mongoose from 'mongoose';

export default function connectDB(): void {
  mongoose.connect('mongodb://root:example@mongodb:27017/mail-manager-dev?authSource=admin');
  mongoose.connection.on('error', () => console.error('connection error:'));
  mongoose.connection.once('open', () => console.log('database connected! 👈️'));
}
