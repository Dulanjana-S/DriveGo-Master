// backend/routes/vehicle.ts
import { Router } from "express"
import { connectDB } from "../db"
import { VehicleModel } from "../models/Vehicle"

const router = Router()

const toSafe = (doc: any) => {
  if (!doc) return doc
  return { ...doc, _id: doc._id?.toString() }
}

// GET /api/vehicles
router.get("/", async (_req, res) => {
  try {
    await connectDB()
    const vehicles = await VehicleModel.find().sort({ createdAt: -1 }).lean()
    res.json({ success: true, data: vehicles.map(toSafe) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, error: "Failed to fetch vehicles" })
  }
})

// GET /api/vehicles/:id
router.get("/:id", async (req, res) => {
  try {
    await connectDB()
    const vehicle = await VehicleModel.findById(req.params.id).lean()
    if (!vehicle) return res.status(404).json({ success: false, error: "Vehicle not found" })
    res.json({ success: true, data: toSafe(vehicle) })
  } catch (err) {
    console.error(err)
    res.status(400).json({ success: false, error: "Invalid vehicle ID" })
  }
})

// POST /api/vehicles
router.post("/", async (req, res) => {
  try {
    await connectDB()
    const vehicle = new VehicleModel(req.body)
    await vehicle.save()
    res.status(201).json({ success: true, data: toSafe(vehicle.toObject()) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, error: "Failed to create vehicle" })
  }
})

// PUT /api/vehicles/:id
router.put("/:id", async (req, res) => {
  try {
    await connectDB()
    const updated = await VehicleModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean()
    if (!updated) return res.status(404).json({ success: false, error: "Vehicle not found" })
    res.json({ success: true, data: toSafe(updated) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, error: "Failed to update vehicle" })
  }
})

// DELETE /api/vehicles/:id
router.delete("/:id", async (req, res) => {
  try {
    await connectDB()
    const deleted = await VehicleModel.findByIdAndDelete(req.params.id).lean()
    if (!deleted) return res.status(404).json({ success: false, error: "Vehicle not found" })
    res.json({ success: true, message: "Vehicle deleted successfully" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, error: "Failed to delete vehicle" })
  }
})

export default router
