"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function CheckoutPage() {
  const router = useRouter()
  const [booking, setBooking] = useState<any>(null)

  useEffect(() => {
    const data = sessionStorage.getItem("checkoutBooking")
    if (!data) {
      router.push("/")
      return
    }
    setBooking(JSON.parse(data))
  }, [router])

  if (!booking) return null

  // 💳 CARD PAYMENT ONLY
  const handleCardPayment = () => {
    // keep booking data for payment page
    sessionStorage.setItem("checkoutBooking", JSON.stringify(booking))
    router.push("/payment")
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="border rounded-lg p-4 mb-6">
        <p>
          <strong>Vehicle:</strong> {booking.vehicleName}
        </p>
        <p>
          <strong>Pickup:</strong> {booking.pickupLocation}
        </p>
        <p>
          <strong>Dates:</strong> {booking.pickupDate} → {booking.returnDate}
        </p>
        <p className="text-lg font-semibold mt-2">
          Total: LKR {booking.totalPrice.toLocaleString()}
        </p>
      </div>

      {/* 💳 CARD ONLY BUTTON */}
      <button
        onClick={handleCardPayment}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
      >
        Pay & Confirm Booking
      </button>
    </div>
  )
}
