"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Calendar, MapPin, CreditCard, Car, Loader2 } from "lucide-react"
import type { Booking } from "@/lib/types"

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?._id) return
      try {
        const response = await fetch(`/api/bookings/user/${user._id}`, { cache: "no-store" })
        const data = await response.json()
        setBookings(Array.isArray(data?.data) ? data.data : [])
      } catch (error) {
        console.error("Error fetching bookings:", error)
        setBookings([])
      } finally {
        setLoading(false)
      }
    }

    if (user) fetchBookings()
  }, [user])

  const renderStatus = (status: Booking["paymentStatus"]) => {
    const label = status === "paid" ? "PAID" : "PENDING"
    const cls = status === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${cls}`}>
        <CreditCard className="h-3 w-3" />
        {label}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>

            <div className="flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-lg">
              <Car className="h-5 w-5 text-primary" />
              <span className="font-semibold text-sm">My Bookings</span>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                localStorage.removeItem("user")
                router.push("/")
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <section className="border-b border-border/40 bg-gradient-to-br from-card via-background to-accent/5 overflow-hidden">
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">Your Booking History</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">📧 Check your email for the receipt (if email is configured).</p>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading your bookings...</span>
          </div>
        ) : bookings.length === 0 ? (
          <Card className="bg-card/50 border-dashed p-12 text-center">
            <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No Bookings Yet</h3>
            <p className="text-muted-foreground mb-6">Start exploring our vehicles and make your first booking!</p>
            <Link href="/">
              <Button className="gap-2">
                <Car className="h-4 w-4" />
                Browse Vehicles
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card
                key={booking._id}
                className="overflow-hidden hover:shadow-lg transition-shadow border-border/60 bg-card/50"
              >
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2.5 rounded-lg">
                          <Car className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-foreground">{booking.vehicleName}</h3>
                          <p className="text-sm text-muted-foreground">Vehicle Details</p>
                        </div>
                      </div>

                      <div className="space-y-3 pl-11">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="text-sm text-foreground">{booking.pickupLocation}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="text-sm text-foreground">
                            {new Date(booking.pickupDate).toLocaleDateString()} → {new Date(booking.returnDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between bg-secondary/20 rounded-lg p-4">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Price</p>
                        <p className="text-2xl font-bold text-primary">LKR {booking.totalPrice.toLocaleString()}</p>
                      </div>

                      <div className="space-y-2 mt-4">
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">Drivers:</span> {booking.numberOfDrivers || 1}
                        </div>
                        <div>{renderStatus(booking.paymentStatus)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-border/40 bg-card/30 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>&copy; 2026 DriveGo. All rights reserved.</p>
            {user && <p>Logged in as {user.email}</p>}
          </div>
        </div>
      </footer>
    </div>
  )
}
