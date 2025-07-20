import mongoose from "mongoose";

// const MONGO_URI = "mongodb+srv://eliahusatat:xf77IKTAycT71Z9Z@cluster0.szhdnff.mongodb.net/";
const MONGO_URI = process.env.MONGO_URI as string;
if (!MONGO_URI) {
  throw new Error("MONGO_URI environment variable is not defined");
}



export async function connectToMongo() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
}