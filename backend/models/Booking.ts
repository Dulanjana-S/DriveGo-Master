// backend/models/Booking.ts
import mongoose, { Schema, model } from "mongoose"

export interface BookingType {
  vehicleId: string
  vehicleName: string

  userId: string
  userEmail: string

  pickupDate: string
  returnDate: string
  pickupLocation: string

  totalDays: number
  totalPrice: number

  numberOfDrivers?: number

  paymentMethod: "cash" | "card"
  paymentStatus: "pending" | "paid"

  createdAt?: Date
  updatedAt?: Date
}

const bookingSchema = new Schema<BookingType>(
  {
    vehicleId: { type: String, required: true },
    vehicleName: { type: String, required: true },

    userId: { type: String, required: true },
    userEmail: { type: String, required: true },

    pickupDate: { type: String, required: true },
    returnDate: { type: String, required: true },
    pickupLocation: { type: String, required: true },

    totalDays: { type: Number, required: true },
    totalPrice: { type: Number, required: true },

    numberOfDrivers: { type: Number, default: 1 },

    paymentMethod: {
      type: String,
      enum: ["cash", "card"],
      required: true,
      default: "card",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      required: true,
      default: "pending",
    },
  },
  {
    timestamps: true,
    strict: true,
  }
)

const Booking = mongoose.models.Booking || model<BookingType>("Booking", bookingSchema)

export default Booking
