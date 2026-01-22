"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Palette, Gauge, Calendar, Car } from "lucide-react"
import Link from "next/link"
import type { Vehicle } from "@/lib/db"

interface VehicleShowcaseProps {
  vehicles: Vehicle[]
  isLoading: boolean
  onUpdate: () => void
  isAdmin: boolean
}

export function VehicleShowcase({ vehicles, isLoading, onUpdate, isAdmin }: VehicleShowcaseProps) {
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

  const getVehicleImage = (vehicle: Vehicle) => {
    if (vehicle.imageUrl && vehicle.imageUrl.trim()) {
      return vehicle.imageUrl
    }
    // Fallback to generated placeholder if no imageUrl provided
    const query = `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.color} car`
    return `/placeholder.svg?height=300&width=500&query=${encodeURIComponent(query)}`
  }

  if (isLoading) {
    return (
      <Card className="p-12 bg-card/50">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Card>
    )
  }

  if (vehicles.length === 0) {
    return (
      <Card className="p-16 bg-gradient-to-br from-card to-accent/5">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="bg-primary/10 p-6 rounded-full mb-6">
            <Car className="h-16 w-16 text-primary" />
          </div>
          <h3 className="text-2xl font-bold mb-3">No Vehicles Available</h3>
          <p className="text-muted-foreground text-lg">Check back soon for new additions to our fleet</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {vehicles.map((vehicle) => (
        <Link key={vehicle._id} href={`/vehicles/${vehicle._id}`}>
          <Card className="overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300 group cursor-pointer h-full">
            {/* Vehicle Image */}
            <div className="relative h-56 overflow-hidden bg-gradient-to-br from-accent/10 to-primary/10">
              <img
                src={getVehicleImage(vehicle) || "/placeholder.svg"}
                alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 right-4">
                <Badge className={getStatusColor(vehicle.status)}>{vehicle.status}</Badge>
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="p-6 space-y-4">
              <div>
                <h4 className="text-xl font-bold text-balance mb-1">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h4>
                <p className="text-sm text-muted-foreground font-mono">{vehicle.licensePlate}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Color:</span>
                  <span className="font-medium">{vehicle.color}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Miles:</span>
                  <span className="font-medium">{vehicle.mileage.toLocaleString()}</span>
                </div>
                {vehicle.lastServiceDate && (
                  <div className="flex items-center gap-2 col-span-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Last Service:</span>
                    <span className="font-medium">{new Date(vehicle.lastServiceDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground">VIN: {vehicle.vin}</p>
              </div>

              <div className="pt-2">
                <p className="text-xs text-primary font-medium group-hover:underline">View Details & Book →</p>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}
