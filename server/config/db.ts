import mongoose from 'mongoose';

export const connectDB = async (): Promise<boolean> => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/agritech';
  
  try {
    // Set connection timeout to 3 seconds so we don't block server if local Mongo is not running
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[MongoDB] Connected successfully to ${mongoUri}`);
    return true;
  } catch (error: any) {
    console.warn(`[MongoDB] Connection notice: ${error.message}. Running in high-performance in-memory repository mode.`);
    return false;
  }
};
