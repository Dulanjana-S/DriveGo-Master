// backend/models/Vehicle.ts
import mongoose, { Schema, model } from "mongoose"
import { connectDB } from "../db"

// 1️⃣ Vehicle interface
export interface VehicleType {
  _id?: string
  make: string
  model: string
  year: number
  vin: string
  licensePlate: string
  color: string
  mileage: number
  status: "active" | "maintenance" | "retired"
  purchaseDate: string
  lastServiceDate?: string
  notes?: string
  imageUrl?: string
  dailyRate: number 
}

// 2️⃣ Schema
const vehicleSchema = new Schema<VehicleType>(
  {
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    vin: { type: String, required: true },
    licensePlate: { type: String, required: true },
    color: { type: String, required: true },
    mileage: { type: Number, required: true },
    status: {
      type: String,
      enum: ["active", "maintenance", "retired"],
      required: true,
    },
    purchaseDate: { type: String, required: true },
    lastServiceDate: { type: String },
    notes: { type: String },
    imageUrl: { type: String },
    dailyRate: {type: Number, required: true},

  },{
 timestamps: true,
    strict: true, // keep strict ON (correct) 
    }
)

// 3️⃣ Model (prevents model recompile errors in Next.js)
export const VehicleModel =
  mongoose.models.Vehicle || model<VehicleType>("Vehicle", vehicleSchema)

// 4️⃣ CRUD functions (backend only)

// GET ALL
export async function getAllVehicles() {
  await connectDB()
  return VehicleModel.find().sort({ createdAt: -1 }).lean().exec()
}

// GET ONE
export async function getVehicle(id: string) {
  await connectDB()
  return VehicleModel.findById(id).lean().exec()
}

// CREATE
export async function createVehicle(data: VehicleType) {
  await connectDB()
  const vehicle = new VehicleModel(data)
  const saved = await vehicle.save()
  return saved.toObject()
}

// UPDATE
export async function updateVehicle(
  id: string,
  data: Partial<VehicleType>
) {
  await connectDB()
  return VehicleModel.findByIdAndUpdate(id, data, {
    new: true,
  })
    .lean()
    .exec()
}

// DELETE
export async function deleteVehicle(id: string) {
  await connectDB()
  return VehicleModel.findByIdAndDelete(id).lean().exec()
}
