import dotenv from "dotenv"
dotenv.config()

import bcrypt from "bcryptjs"
import { connectDB } from "../db"
import User from "../models/User"
import Admin from "../models/Admin"
import { VehicleModel } from "../models/Vehicle"

async function upsertUser() {
  const email = (process.env.DEMO_USER_EMAIL || "user@drivego.demo").toLowerCase()
  const password = process.env.DEMO_USER_PASSWORD || "User1234!"
  const fullName = process.env.DEMO_USER_NAME || "Demo User"

  const hashed = await bcrypt.hash(password, 10)

  await User.findOneAndUpdate(
    { email },
    { $set: { email, fullName, password: hashed } },
    { upsert: true, new: true }
  )

  return { email, password, fullName }
}

async function upsertAdmin() {
  const email = (process.env.DEMO_ADMIN_EMAIL || "admin@drivego.demo").toLowerCase()
  const password = process.env.DEMO_ADMIN_PASSWORD || "Admin1234!"
  const fullName = process.env.DEMO_ADMIN_NAME || "Demo Admin"

  const hashed = await bcrypt.hash(password, 10)

  await Admin.findOneAndUpdate(
    { email },
    { $set: { email, fullName, password: hashed } },
    { upsert: true, new: true }
  )

  return { email, password, fullName }
}

async function seedVehiclesIfEmpty() {
  const count = await VehicleModel.countDocuments()
  if (count > 0) return

  await VehicleModel.insertMany([
    {
      make: "Toyota",
      model: "Prius",
      year: 2018,
      vin: "JTDBR32E720123456",
      licensePlate: "WP-CAB-1234",
      color: "White",
      mileage: 54000,
      status: "active",
      purchaseDate: "2023-01-15",
      lastServiceDate: "2025-11-20",
      notes: "Fuel efficient hybrid",
      imageUrl: "",
      dailyRate: 12000
    },
    {
      make: "Honda",
      model: "Civic",
      year: 2020,
      vin: "2HGFC2F69LH123456",
      licensePlate: "WP-CAD-7788",
      color: "Silver",
      mileage: 42000,
      status: "active",
      purchaseDate: "2023-06-10",
      lastServiceDate: "2025-10-05",
      notes: "Comfortable city car",
      imageUrl: "",
      dailyRate: 15000
    }
  ])
}

async function main() {
  await connectDB()
  const admin = await upsertAdmin()
  const user = await upsertUser()
  await seedVehiclesIfEmpty()

  console.log("✅ Demo accounts ready:")
  console.log("ADMIN:", admin)
  console.log("USER:", user)

  process.exit(0)
}

main().catch((err) => {
  console.error("❌ Seed failed:", err)
  process.exit(1)
})
