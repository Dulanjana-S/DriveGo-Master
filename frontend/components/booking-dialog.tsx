"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Vehicle } from "@/lib/db"
import { useRouter } from "next/navigation"

interface BookingDialogProps {
  vehicle: Vehicle
  open: boolean
  onOpenChange: (open: boolean) => void
}

const PICKUP_LOCATIONS = [
  {
    label: "Colombo Bandaranaike International Airport",
    address: "5VJM+3M Katunayake",
    mapUrl: "https://maps.app.goo.gl/68gB57iYJ3TGQG2N8",
  },
  {
    label: "Mattala Rajapaksa International Airport",
    address: "74RC+HG5, Mattala",
    mapUrl: "https://maps.app.goo.gl/rH3C8xViNzHMet9Q9",
  },
  {
    label: "Port of Colombo",
    address: "WRQX+FGR, 19 Chaithya Rd, Colombo 00100",
    mapUrl: "https://maps.app.goo.gl/s84gu6vkuQFVxhZt9",
  },
]

export function BookingDialog({ vehicle, open, onOpenChange }: BookingDialogProps) {
  const router = useRouter()

  const [pickupDate, setPickupDate] = useState("")
  const [returnDate, setReturnDate] = useState("")
  const [pickupLocation, setPickupLocation] =
    useState<(typeof PICKUP_LOCATIONS)[0] | null>(null)

  const today = new Date().toISOString().split("T")[0]

  const calculateDays = () => {
    if (!pickupDate || !returnDate) return 0
    const start = new Date(pickupDate)
    const end = new Date(returnDate)
    const diff = end.getTime() - start.getTime()
    return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 1)
  }

  const totalDays = calculateDays()
  const totalPrice = totalDays * vehicle.dailyRate

  // 🔵 UPDATED CONFIRM HANDLER (STEP 2)
  const handleConfirm = () => {
    if (!pickupDate || !returnDate || !pickupLocation) return

    const user = JSON.parse(localStorage.getItem("user") || "null")

    if (!user) {
      alert("Please login to continue")
      return
    }

    const bookingData = {
      userId: user._id,
      userEmail: user.email,

      vehicleId: vehicle._id || vehicle.id,
      vehicleName: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,

      pickupDate,
      returnDate,
      pickupLocation: pickupLocation.label,
      totalDays,
      totalPrice,
    }

    // ✅ Store temporarily for checkout
    sessionStorage.setItem(
      "checkoutBooking",
      JSON.stringify(bookingData)
    )

    // ✅ Go to checkout page
    onOpenChange(false)
    router.push("/checkout")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Book {vehicle.year} {vehicle.make} {vehicle.model}
          </DialogTitle>
          <DialogDescription>
            Fill in your rental details below
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Pickup Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Pickup Date</label>
            <input
              type="date"
              min={today}
              onChange={(e) => {
                setPickupDate(e.target.value)
                setReturnDate("")
              }}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Return Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Return Date</label>
            <input
              type="date"
              min={pickupDate || today}
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Pickup Location */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Pickup Location</label>
            <select
              className="w-full px-4 py-2 border rounded-lg"
              value={pickupLocation?.label ?? ""}
              onChange={(e) =>
                setPickupLocation(
                  PICKUP_LOCATIONS.find((l) => l.label === e.target.value) || null
                )
              }
            >
              <option value="">Select a location</option>
              {PICKUP_LOCATIONS.map((loc) => (
                <option key={loc.label} value={loc.label}>
                  {loc.label}
                </option>
              ))}
            </select>

            {pickupLocation && (
              <div className="rounded-lg border p-3 bg-muted/30 text-sm">
                <p className="font-medium">{pickupLocation.address}</p>
                <a
                  href={pickupLocation.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline text-xs"
                >
                  View on Map
                </a>
              </div>
            )}
          </div>

          {/* Price Summary */}
          {totalDays > 0 && (
            <div className="rounded-lg border p-4 bg-primary/5 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Daily Rate</span>
                <span>LKR {vehicle.dailyRate}/day</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Number of Days ({totalDays})</span>
                <span>{totalDays}</span>
              </div>

              <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                <span>Total Price</span>
                <span className="text-primary">
                  LKR {totalPrice.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!pickupDate || !returnDate || !pickupLocation}
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
