import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;

export const connectDB = async (): Promise<boolean> => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/joyice_portfolio';

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`✅ [MongoDB] Connected successfully to host: ${conn.connection.host} (Database: ${conn.connection.name})`);
    return true;
  } catch (error: any) {
    isConnected = false;
    console.warn(`⚠️ [MongoDB] Connection Warning: Could not connect to MongoDB at ${mongoURI}`);
    console.warn(`⚠️ [MongoDB] Reason: ${error.message}`);
    console.warn(`ℹ️ [MongoDB] If local MongoDB is not running, the server will continue running and provide fallback mock data so the app stays functional. To connect MongoDB, make sure MongoDB Service is running or update MONGODB_URI in server/.env`);
    return false;
  }
};

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.warn('⚠️ [MongoDB] Connection lost. Attempting reconnection...');
});

mongoose.connection.on('reconnected', () => {
  isConnected = true;
  console.log('✅ [MongoDB] Reconnected successfully.');
});

export const getDBStatus = () => ({
  connected: mongoose.connection.readyState === 1,
  readyState: mongoose.connection.readyState,
  host: mongoose.connection.host || null,
  name: mongoose.connection.name || null,
});
