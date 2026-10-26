import mongoose from 'mongoose';
import { MONGODB_URI } from './environment.js';

let isConnected = false;

export const connectDB = async () => {
  if (!MONGODB_URI) {
    console.warn('\n⚠️ [Database Warning] MONGODB_URI is not set in server/.env.');
    console.warn('👉 Please create server/.env and provide your MongoDB Atlas connection string.\n');
    return false;
  }

  try {
    const conn = await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log(`\n✅ [MongoDB Connected] Host: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`\n❌ [MongoDB Connection Error]: ${error.message}\n`);
    return false;
  }
};

export const getDbStatus = () => {
  return isConnected ? 'connected' : 'disconnected';
};
