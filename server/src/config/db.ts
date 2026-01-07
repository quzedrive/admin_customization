import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars from root .env if available, or local
dotenv.config();
// Also try loading from client folder for easy migration if root .env is missing? 
// For now, assume a .env in server or root. 

const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quzeedrive');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDb;
