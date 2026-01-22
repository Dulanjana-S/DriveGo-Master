"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { LogOut, ArrowLeft, Calendar } from "lucide-react"
import type { Booking } from "@/lib/types"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to fetch bookings")
  return res.json()
}

export default function BookingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  const { data, error, isLoading } = useSWR<{ success: boolean; data: Booking[] }>("/api/bookings", fetcher)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }

    const parsed = JSON.parse(userData)
    if (parsed?.role !== "admin") {
      router.push("/")
      return
    }

    setUser(parsed)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const bookings = data?.data ?? []

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-b-2 border-primary rounded-full" />
      </div>
    )
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Failed to load bookings</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <ArrowLeft />
            </Link>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Calendar className="text-primary" />
                Bookings Management
              </h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6">
            <p className="text-sm text-muted-foreground">Total Bookings</p>
            <p className="text-3xl font-bold">{bookings.length}</p>
          </Card>

          <Card className="p-6">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-3xl font-bold">{bookings.filter((b) => b.paymentStatus === "pending").length}</p>
          </Card>

          <Card className="p-6">
            <p className="text-sm text-muted-foreground">Revenue (Paid)</p>
            <p className="text-3xl font-bold">
              LKR {" "}
              {bookings
                .filter((b) => b.paymentStatus === "paid")
                .reduce((sum, b) => sum + b.totalPrice, 0)
                .toLocaleString()}
            </p>
          </Card>
        </div>

        <Card>
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">All Bookings</h2>
          </div>

          {isLoading ? (
            <div className="p-10 text-center">Loading…</div>
          ) : bookings.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground">No bookings yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-fixed">
                <thead className="bg-secondary">
                  <tr>
                    <th className="px-4 py-3 text-left w-[20%]">Vehicle</th>
                    <th className="px-4 py-3 text-left w-[18%]">Booked By</th>
                    <th className="px-4 py-3 text-left w-[22%]">Pickup Location</th>
                    <th className="px-4 py-3 text-center w-[12%]">Pickup</th>
                    <th className="px-4 py-3 text-center w-[12%]">Return</th>
                    <th className="px-4 py-3 text-right w-[10%]">Price</th>
                    <th className="px-4 py-3 text-center w-[6%]">Payment</th>
                  </tr>
                </thead>

                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id} className="border-b">
                      <td className="px-4 py-3 text-left w-[20%] truncate">{b.vehicleName}</td>
                      <td className="px-4 py-3 text-left w-[18%] truncate text-muted-foreground">{b.userEmail}</td>
                      <td className="px-4 py-3 text-left w-[22%] truncate">{b.pickupLocation}</td>
                      <td className="px-4 py-3 text-center w-[12%]">{new Date(b.pickupDate).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-center w-[12%]">{new Date(b.returnDate).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-right w-[10%] font-medium">LKR {b.totalPrice.toLocaleString()}</td>
                      <td className="px-4 py-3 text-center w-[6%]">
                        <Badge className="capitalize">{b.paymentStatus}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </main>
    </div>
  )
}
