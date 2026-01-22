"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { updateVehicleApi } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import type { Vehicle } from "@/lib/types"

interface EditVehicleDialogProps {
  vehicle: Vehicle
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EditVehicleDialog({ vehicle, open, onOpenChange, onSuccess }: EditVehicleDialogProps) {
  const { toast } = useToast()
  const today = new Date().toISOString().split("T")[0]
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year,
    vin: vehicle.vin,
    licensePlate: vehicle.licensePlate,
    color: vehicle.color,
    mileage: vehicle.mileage,
    status: vehicle.status,
    purchaseDate: vehicle.purchaseDate,
    lastServiceDate: vehicle.lastServiceDate || "",
    notes: vehicle.notes || "",
    imageUrl: vehicle.imageUrl || "",
     dailyRate: vehicle.dailyRate,  })

  useEffect(() => {
    setFormData({
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      vin: vehicle.vin,
      licensePlate: vehicle.licensePlate,
      color: vehicle.color,
      mileage: vehicle.mileage,
      status: vehicle.status,
      purchaseDate: vehicle.purchaseDate,
      lastServiceDate: vehicle.lastServiceDate || "",
      notes: vehicle.notes || "",
      imageUrl: vehicle.imageUrl || "",
      dailyRate: vehicle.dailyRate,
    })
  }, [vehicle])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await updateVehicleApi(vehicle._id!, formData)
      toast({
        title: "Success",
        description: "Vehicle updated successfully",
      })
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update vehicle",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Vehicle</DialogTitle>
          <DialogDescription>Update the vehicle details</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-make">Make *</Label>
              <Input
                id="edit-make"
                required
                value={formData.make}
                onChange={(e) => setFormData({ ...formData, make: e.target.value })}
              />
              </div>
                {/* IMAGE URL */}
      <div className="space-y-2">
      <Label htmlFor="edit-imageUrl">Vehicle Image URL</Label>

      <Input
      id="edit-imageUrl"
     placeholder="https://example.com/car.jpg"
     value={formData.imageUrl}
      onChange={(e) =>
      setFormData({ ...formData, imageUrl: e.target.value })
    }
  />

  {formData.imageUrl && (
    <img
      src={formData.imageUrl}
      alt="Vehicle preview"
      className="mt-2 h-40 w-full object-cover rounded-md border"
    />
  )}
</div>


            <div className="space-y-2">
              <Label htmlFor="edit-model">Model *</Label>
              <Input
                id="edit-model"
                required
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-year">Year *</Label>
              <Input
                id="edit-year"
                type="number"
                required
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: Number.parseInt(e.target.value) })}
                min="1900"
                max={new Date().getFullYear() + 1}
              />
            </div>
<div className="space-y-2">
  <Label htmlFor="edit-dailyRate">Daily Rate (LKR) *</Label>
  <Input
    id="edit-dailyRate"
    type="number"
    min="0"
    required
    value={formData.dailyRate}
    onChange={(e) =>
      setFormData({
        ...formData,
        dailyRate: Number(e.target.value),
      })
    }
    placeholder="LKR"
  />
</div>

            <div className="space-y-2">
              <Label htmlFor="edit-vin">VIN *</Label>
              <Input
                id="edit-vin"
                required
                value={formData.vin}
                onChange={(e) => setFormData({ ...formData, vin: e.target.value.toUpperCase() })}
                maxLength={17}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-licensePlate">License Plate *</Label>
              <Input
                id="edit-licensePlate"
                required
                value={formData.licensePlate}
                onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value.toUpperCase() })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-color">Color *</Label>
              <Input
                id="edit-color"
                required
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-mileage">Mileage *</Label>
              <Input
                id="edit-mileage"
                type="number"
                required
                value={formData.mileage}
                onChange={(e) => setFormData({ ...formData, mileage: Number.parseInt(e.target.value) })}
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "active" | "maintenance" | "retired") =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger id="edit-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-purchaseDate">Purchase Date *</Label>
              <Input
         id="edit-purchaseDate"
         type="date"
        required
        max={today}  
      value={formData.purchaseDate}
       onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-lastServiceDate">Last Service Date</Label>
              <Input
           id="edit-lastServiceDate"
           type="date"
           max={today}   
          value={formData.lastServiceDate}
        onChange={(e) => setFormData({ ...formData, lastServiceDate: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-notes">Notes</Label>
            <Textarea
              id="edit-notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Vehicle"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
