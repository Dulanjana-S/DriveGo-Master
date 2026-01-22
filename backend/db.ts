import mongoose from "mongoose"

/**
 * Central MongoDB connection helper.
 *
 * Required env:
 *   - MONGODB_URI (or MONGO_URI)
 */
export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI
  if (!uri) {
    throw new Error("Missing MONGODB_URI (or MONGO_URI) in environment")
  }

  // Reuse existing connection (helps with hot-reload / dev)
  if (mongoose.connection.readyState >= 1) return

  await mongoose.connect(uri)
  console.log("✅ MongoDB connected")
}
