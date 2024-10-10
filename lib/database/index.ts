import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_URI;

let cached = (global as any).mongoose || { conn: null, promise: null };

export const connectToDb = async () => {
  if (cached) return cached.conn;

  if (!MONGODB_URI) throw new Error("MONGODB_URI is required.");

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });

  cached.conn = await cached.promise;

  return cached.conn;
};
