import dotenv from 'dotenv';
dotenv.config();

if(!process.env.MONGO_URI){
    console.error("MONGO_URI environment variable is not defined. Please set it in the .env file.");
    process.exit(1);
}

if(!process.env.JWT_SECRET){
    console.error("JWT_SECRET environment variable is not defined. Please set it in the .env file.");
    process.exit(1);
}

if(!process.env.GOOGLE_CLIENT_ID){
    console.error("GOOGLE_CLIENT_ID environment variable is not defined. Please set it in the .env file.");
    process.exit(1);
}

if(!process.env.GOOGLE_CLIENT_SECRET){
    console.error("GOOGLE_CLIENT_SECRET environment variable is not defined. Please set it in the .env file.");
    process.exit(1);
}

if(!process.env.IMAGEKIT_PRIVATE_KEY){
    console.error("IMAGEKIT_PRIVATE_KEY environment variable is not defined. Please set it in the .env file.");
    process.exit(1);
}

export const config = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
}