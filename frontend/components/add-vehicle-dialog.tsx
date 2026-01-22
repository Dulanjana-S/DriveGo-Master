"use client"

import type React from "react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createVehicleApi } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

interface AddVehicleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AddVehicleDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddVehicleDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const today = new Date().toISOString().split("T")[0]

  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    vin: "",
    licensePlate: "",
    color: "",
    mileage: 0,
    status: "active" as "active" | "maintenance" | "retired",
    purchaseDate: new Date().toISOString().split("T")[0],
    lastServiceDate: "",
    notes: "",
    imageUrl: "", 
    dailyRate: 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await createVehicleApi(formData)

      toast({
        title: "Success",
        description: "Vehicle added successfully",
      })

      onSuccess()
      onOpenChange(false)

      
      setFormData({
        make: "",
        model: "",
        year: new Date().getFullYear(),
        vin: "",
        licensePlate: "",
        color: "",
        mileage: 0,
        status: "active",
        purchaseDate: new Date().toISOString().split("T")[0],
        lastServiceDate: "",
        notes: "",
        imageUrl: "",
        dailyRate: 0,
        
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add vehicle",
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
          <DialogTitle>Add New Vehicle</DialogTitle>
          <DialogDescription>
            Enter the details for the new vehicle
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* IMAGE URL */}
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Vehicle Image URL</Label>
            <Input
              id="imageUrl"
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
                className="mt-2 h-32 w-full object-cover rounded-md border"
              />
            )}
          </div>
    <div className="space-y-2">
  <Label htmlFor="dailyRate">Daily Rate ($) *</Label>
  <Input
    id="dailyRate"
    type="number"
    required
    min="0"
    value={formData.dailyRate}
    onChange={(e) =>
      setFormData({
        ...formData,
        dailyRate: Number(e.target.value),
      })
    }
    placeholder="89"
         />
    </div>

          {/* BASIC INFO */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="make">Make *</Label>
              <Input
                id="make"
                required
                value={formData.make}
                onChange={(e) =>
                  setFormData({ ...formData, make: e.target.value })
                }
                placeholder="Toyota"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                required
                value={formData.model}
                onChange={(e) =>
                  setFormData({ ...formData, model: e.target.value })
                }
                placeholder="Camry"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                type="number"
                required
                min="1900"
                max={new Date().getFullYear() + 1}
                value={formData.year}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    year: Number.parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vin">VIN *</Label>
              <Input
                id="vin"
                required
                maxLength={17}
                value={formData.vin}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    vin: e.target.value.toUpperCase(),
                  })
                }
                placeholder="1HGBH41JXMN109186"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="licensePlate">License Plate *</Label>
              <Input
                id="licensePlate"
                required
                value={formData.licensePlate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    licensePlate: e.target.value.toUpperCase(),
                  })
                }
                placeholder="ABC 1234"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color *</Label>
              <Input
                id="color"
                required
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
                placeholder="Silver"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mileage">Mileage *</Label>
              <Input
                id="mileage"
                type="number"
                required
                min="0"
                value={formData.mileage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    mileage: Number.parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    status: value as "active" | "maintenance" | "retired",
                  })
                }
              >
                <SelectTrigger>
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
              <Label>Purchase Date *</Label>
              <Input
    type="date"
   required
   max={today}
   value={formData.purchaseDate}
    onChange={(e) =>
    setFormData({
      ...formData,
      purchaseDate: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Last Service Date</Label>
              <Input
  type="date"
  max={today}
  value={formData.lastServiceDate}
  onChange={(e) =>
    setFormData({
      ...formData,
      lastServiceDate: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* NOTES */}
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              rows={3}
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Additional notes about this vehicle..."
            />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Vehicle"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
