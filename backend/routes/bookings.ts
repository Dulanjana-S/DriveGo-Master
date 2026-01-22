import { Router } from "express"
import { connectDB } from "../db"
import Booking from "../models/Booking"
import { VehicleModel } from "../models/Vehicle"
import { sendBookingEmail } from "../utils/sendEmail"

const router = Router()

// ===============================
// CREATE BOOKING
// ===============================
router.post("/", async (req, res) => {
  try {
    await connectDB()

    const {
      vehicleId,
      pickupDate,
      returnDate,
      pickupLocation,
      totalDays,
      totalPrice,
      userId,
      userEmail,
      numberOfDrivers,
      paymentMethod,
      paymentStatus,
    } = req.body

    if (
      !vehicleId ||
      !pickupDate ||
      !returnDate ||
      !pickupLocation ||
      !totalDays ||
      !totalPrice ||
      !userId ||
      !userEmail
    ) {
      return res.status(400).json({ success: false, error: "Missing required fields" })
    }

    const vehicle = await VehicleModel.findById(vehicleId).lean()
    if (!vehicle) {
      return res.status(404).json({ success: false, error: "Vehicle not found" })
    }

    // Defaults:
    // - card => paid (unless explicitly set)
    // - cash => pending (unless explicitly set)
    const resolvedMethod = (paymentMethod === "cash" ? "cash" : "card") as "cash" | "card"
    const resolvedStatus = (paymentStatus === "paid" || paymentStatus === "pending"
      ? paymentStatus
      : (resolvedMethod === "cash" ? "pending" : "paid")) as "pending" | "paid"

    const booking = await Booking.create({
      userId,
      userEmail,
      vehicleId,
      vehicleName: `${(vehicle as any).year} ${(vehicle as any).make} ${(vehicle as any).model}`,
      pickupDate,
      returnDate,
      pickupLocation,
      totalDays,
      totalPrice,
      numberOfDrivers: Number(numberOfDrivers) || 1,
      paymentMethod: resolvedMethod,
      paymentStatus: resolvedStatus,
    })

    // Send email (do not block booking if email fails)
    sendBookingEmail(userEmail, booking).catch((err) =>
      console.error("📧 Email failed:", err.message)
    )

    return res.status(201).json({ success: true, booking })
  } catch (err) {
    console.error("❌ Booking error:", err)
    return res.status(500).json({ success: false, error: "Booking failed" })
  }
})

// ===================================
// GET BOOKINGS BY USER
// ===================================
router.get("/user/:userId", async (req, res) => {
  try {
    await connectDB()
    const { userId } = req.params
    const bookings = await Booking.find({ userId }).sort({ createdAt: -1 }).lean()
    return res.json(bookings)
  } catch (err) {
    console.error("❌ Fetch user bookings failed:", err)
    return res.status(500).json({ success: false, error: "Failed to fetch bookings" })
  }
})

// ===================================
// ADMIN: GET ALL BOOKINGS
// ===================================
router.get("/", async (_req, res) => {
  try {
    await connectDB()
    const bookings = await Booking.find().sort({ createdAt: -1 }).lean()
    return res.json(bookings)
  } catch (err) {
    console.error("❌ Fetch all bookings failed:", err)
    return res.status(500).json({ success: false, error: "Failed to fetch bookings" })
  }
})

export default router
