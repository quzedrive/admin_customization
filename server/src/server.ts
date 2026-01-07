import app from './app';
import connectDb from './config/db';
import { configureCloudinary } from './config/cloudinary.config';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 5000;

// Connect to Database
// Connect to Database
connectDb().then(async () => {
    // Configure Cloudinary from DB
    await configureCloudinary();

    app.listen(port, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
    });
});
