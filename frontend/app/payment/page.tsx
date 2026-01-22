"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function PaymentPage() {
  const router = useRouter()

  const handlePayment = async () => {
    const booking = JSON.parse(
      sessionStorage.getItem("checkoutBooking") || "{}"
    )

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...booking,
        paymentMethod: "card",
        paymentStatus: "paid",
      }),
    })

    if (res.ok) {
      sessionStorage.removeItem("checkoutBooking")
      alert("Payment successful! Booking confirmed.")
      router.push("/my-bookings")
    } else {
      alert("Payment failed")
    }
  }

  return (
    <div className="max-w-md mx-auto py-20 text-center">
      <h1 className="text-2xl font-bold mb-6">Card Payment</h1>
      <p className="mb-6"> Check Your Email to See Reciept 📩</p>

      <button
        onClick={handlePayment}
        className="w-full bg-green-600 text-white py-3 rounded-lg rounded-lg hover:bg-green-700"
      >
        Pay Now
      </button>
    </div>
  )
}
