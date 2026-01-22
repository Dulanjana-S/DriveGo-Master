"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Gauge,
  Palette,
  Calendar,
  FileText,
  CheckCircle2,
  AlertCircle,
  Wrench,
  Clock,
  DollarSign,
} from "lucide-react"
import { BookingDialog } from "./booking-dialog"
type Vehicle = {
  _id: string
  make: string
  model: string
  year: number
  color: string
  mileage: number
  vin: string
  licensePlate: string
  dailyRate: number
  status: "active" | "maintenance" | "retired"
  imageUrl?: string
  notes?: string
  lastServiceDate?: string
  purchaseDate: string
}



interface VehicleDetailViewProps {
  vehicle: Vehicle
}

export function VehicleDetailView({ vehicle }: VehicleDetailViewProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-chart-1 text-primary-foreground"
      case "maintenance":
        return "bg-chart-3 text-primary-foreground"
      case "retired":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle2 className="h-5 w-5" />
      case "maintenance":
        return <Wrench className="h-5 w-5" />
      case "retired":
        return <AlertCircle className="h-5 w-5" />
      default:
        return null
    }
  }

  const getVehicleImage = (vehicle: Vehicle) => {
    if (vehicle.imageUrl && vehicle.imageUrl.trim()) {
      return vehicle.imageUrl
    }
    // Fallback to generated placeholder if no imageUrl provided
    const query = `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.color} car professional photo`
    return `/placeholder.svg?height=600&width=1200&query=${encodeURIComponent(query)}` 
  }

  const specs = [
    { icon: Gauge, label: "Mileage", value: `${vehicle.mileage.toLocaleString()} mi` },
    { icon: Palette, label: "Color", value: vehicle.color },
    { icon: Calendar, label: "Year", value: vehicle.year.toString() },
    { icon: FileText, label: "License Plate", value: vehicle.licensePlate },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      {/* Header with Back Button */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Vehicles</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Image and Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-accent/10 to-primary/10 h-[400px]">
              <img
                src={getVehicleImage(vehicle) || "/placeholder.svg"}
                alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-6 right-6">
                <Badge className={`${getStatusColor(vehicle.status)} text-base px-4 py-2 flex items-center gap-2`}>
                  {getStatusIcon(vehicle.status)}
                  {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                </Badge>
              </div>
            </div>

            {/* Vehicle Title */}
            <div className="space-y-3">
              <h1 className="text-4xl lg:text-5xl font-bold text-balance">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h1>
              <p className="text-lg text-muted-foreground flex items-center gap-2">
                <FileText className="h-5 w-5" />
                VIN: <code className="bg-secondary/50 px-3 py-1 rounded font-mono">{vehicle.vin}</code>
              </p>
            </div>

            {/* Specifications Grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              {specs.map((spec) => {
                const Icon = spec.icon
                return (
                  <Card key={spec.label} className="p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground mb-1">{spec.label}</p>
                        <p className="text-lg font-bold text-foreground">{spec.value}</p>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>

            {/* Service Information */}
            <Card className="p-8 bg-gradient-to-br from-card to-secondary/30">
              <h2 className="text-2xl font-bold mb-6">Maintenance History</h2>
              <div className="space-y-4">
                {vehicle.lastServiceDate && (
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-background/50">
                    <Clock className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Last Service</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(vehicle.lastServiceDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                )}
                {vehicle.notes && (
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-background/50">
                    <FileText className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Notes</p>
                      <p className="text-sm text-muted-foreground mt-1">{vehicle.notes}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-4 p-4 rounded-lg bg-background/50">
                  <Calendar className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Purchase Date</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(vehicle.purchaseDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Booking Card */}
          <div>
            <Card className="sticky top-24 p-8 bg-gradient-to-br from-primary/5 to-accent/10 shadow-lg">
              <div className="space-y-6">
                {/* Price Section */}
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Daily Rate</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-primary">
                       LKR {vehicle.dailyRate}
                       </span>

                    <span className="text-muted-foreground">/day</span>
                  </div>
                </div>

                {/* Availability Status */}
                <div
                  className={`p-4 rounded-lg flex items-center gap-3 ${
                    vehicle.status === "active"
                      ? "bg-chart-1/20 text-chart-1 border border-chart-1/30"
                      : "bg-destructive/20 text-destructive border border-destructive/30"
                  }`}
                >
                  {vehicle.status === "active" ? (
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  )}
                  <div>
                    <p className="font-medium text-sm">
                      {vehicle.status === "active" ? "Available for Booking" : "Not Available"}
                    </p>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm">To Rent a Car You Need</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span> Valid Driving License </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span> Valid Id Proof ( NIC/ Passport)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span> Billing Proof (ex: Utility Bill)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span> One Person as A Guarantor</span>
                    </li>
                  </ul>
                </div>

                {/* Booking Button */}
                <Button
                  onClick={() => setIsBookingOpen(true)}
                  size="lg"
                  className="w-full h-12 text-base font-semibold gap-2 rounded-lg"
                  disabled={vehicle.status !== "active"}
                >
                  
                  {vehicle.status === "active" ? "Book Now" : "Unavailable"}
                </Button>

                {/* Additional Info */}
                <p className="text-xs text-muted-foreground text-center">
                  Must be 21+ Years Old with Valid Driver's License.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Booking Dialog */}
      <BookingDialog vehicle={vehicle} open={isBookingOpen} onOpenChange={setIsBookingOpen} />
    </div>
  )
}
