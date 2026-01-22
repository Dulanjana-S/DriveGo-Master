"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Car } from "lucide-react"
import type { Vehicle } from "@/lib/types"
import { useState } from "react"
import { EditVehicleDialog } from "./edit-vehicle-dialog"
import { DeleteVehicleDialog } from "./delete-vehicle-dialog"

interface VehicleListProps {
  vehicles: Vehicle[]
  isLoading: boolean
  onUpdate: () => void
}

export function VehicleList({ vehicles, isLoading, onUpdate }: VehicleListProps) {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const handleEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setEditDialogOpen(true)
  }

  const handleDelete = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setDeleteDialogOpen(true)
  }

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

  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Card>
    )
  }

  if (vehicles.length === 0) {
    return (
      <Card className="p-12">
        <div className="flex flex-col items-center justify-center text-center">
          <Car className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No vehicles yet</h3>
          <p className="text-muted-foreground">Add your first vehicle to get started</p>
        </div>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">All Vehicles</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <Card key={vehicle._id} className="p-6 hover:border-primary/50 transition-colors">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-balance">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </h3>
                    <p className="text-sm text-muted-foreground">{vehicle.licensePlate}</p>
                  </div>
                  <Badge className={getStatusColor(vehicle.status)}>{vehicle.status}</Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">VIN:</span>
                    <span className="font-mono">{vehicle.vin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Color:</span>
                    <span>{vehicle.color}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mileage:</span>
                    <span>{vehicle.mileage.toLocaleString()} mi</span>
                  </div>
                  {vehicle.lastServiceDate && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Service:</span>
                      <span>{new Date(vehicle.lastServiceDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => handleEdit(vehicle)}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
                    onClick={() => handleDelete(vehicle)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {selectedVehicle && (
        <>
          <EditVehicleDialog
            vehicle={selectedVehicle}
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            onSuccess={onUpdate}
          />
          <DeleteVehicleDialog
            vehicle={selectedVehicle}
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onSuccess={onUpdate}
          />
        </>
      )}
    </>
  )
}
