/* eslint-disable no-console */
import mongoose from 'mongoose';

export default function connectDB(): void {
  mongoose.connect('mongodb://admin:password@mongodb:27017/email-manager-dev?authSource=admin');
  mongoose.connection.on('error', () => console.error('connection error:'));
  mongoose.connection.once('open', () => console.log('database connected! 👈️'));
}
