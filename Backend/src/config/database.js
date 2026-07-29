import mongoose from 'mongoose';
import {config} from './config.js';

const connectDB = async () => {
    try{
        await mongoose.connect(config.MONGO_URI);
        console.log("MongoDB se connection ho gaya bhai");
    } catch (error) {
        console.error("MongoDB se connect nahi hoo paa raha hai yaar!:", error);
        process.exit(1);
    }
};

export default connectDB;