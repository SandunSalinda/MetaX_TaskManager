import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error(
        'please define the MONGODB_URI environment variable inside .env.local'
    );
}

console.log('MONGODB_URI configured:', !!MONGODB_URI);

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    console.log('dbConnect called');
    
    if (cached.conn) {
        console.log('Using cached connection');
        return cached.conn;
    }

    if (!cached.promise) {
        console.log('Creating new MongoDB connection...');
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            console.log('MongoDB connected successfully');
            return mongoose;
        }).catch((error) => {
            console.error('MongoDB connection error:', error);
            throw error;
        });
    }
    
    try {
        cached.conn = await cached.promise;
        console.log('Database connection established');
        return cached.conn;
    } catch (error) {
        console.error('Error establishing database connection:', error);
        throw error;
    }
}

export default dbConnect;