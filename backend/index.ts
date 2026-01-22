import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors"
import { connectDB } from "./db"

import vehicleRoutes from "./routes/vehicle"
import loginRoute from "./routes/login"
import registerRoute from "./routes/register"
import bookingRoutes from "./routes/bookings"

const app = express()
const PORT = Number(process.env.PORT) || 5000

const corsOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean)

app.use(
  cors({
    origin: corsOrigins.length ? corsOrigins : true,
    credentials: true,
  })
)

app.use(express.json())

connectDB().catch((err: unknown) => {
  console.error("❌ MongoDB connection failed", err)
})

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "drivego-backend" })
})

app.use("/api/vehicles", vehicleRoutes)
app.use("/api/auth/login", loginRoute)
app.use("/api/auth/register", registerRoute)
app.use("/api/bookings", bookingRoutes)

app.listen(PORT, () => console.log(`✅ Backend running at http://localhost:${PORT}`))
