"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import { fetchVehicles } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { LogOut, PlusCircle, Pencil, Trash2, Car, Shield, ArrowLeft, Gauge, BookOpen } from "lucide-react"
import { AddVehicleDialog } from "@/components/add-vehicle-dialog"
import { EditVehicleDialog } from "@/components/edit-vehicle-dialog"
import { DeleteVehicleDialog } from "@/components/delete-vehicle-dialog"
import type { Vehicle } from "@/lib/types"

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const { data: vehicles, error, mutate } = useSWR("vehicles", fetchVehicles)

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

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

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

  const getVehicleImage = (vehicle: Vehicle) => {
    const query = `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.color} car`
    return `/placeholder.svg?height=300&width=500&query=${encodeURIComponent(query)}`
  }

  const stats = [
    { label: "Total Vehicles", value: vehicles?.length || 0, icon: Car },
    { label: "Active", value: vehicles?.filter((v) => v.status === "active").length || 0, icon: Car },
    { label: "Maintenance", value: vehicles?.filter((v) => v.status === "maintenance").length || 0, icon: Gauge },
    { label: "Retired", value: vehicles?.filter((v) => v.status === "retired").length || 0, icon: Car },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="hover:opacity-70 transition-opacity">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Shield className="h-6 w-6 text-primary" />
                  Admin Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/admin/bookings">
                <Button size="lg" variant="outline" className="gap-2 bg-transparent">
                  <BookOpen className="h-5 w-5" />
                  View Bookings
                </Button>
              </Link>
              <Button onClick={() => setIsAddDialogOpen(true)} size="lg" className="gap-2">
                <PlusCircle className="h-5 w-5" />
                Add Vehicle
              </Button>
              <Button onClick={handleLogout} size="lg" variant="outline">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <Card key={stat.label} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold mt-2">{stat.value}</p>
                    </div>
                    <Icon className="h-10 w-10 text-primary/40" />
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Vehicles Table */}
          <Card className="overflow-hidden">
            <div className="p-6 border-b border-border">
              <h3 className="text-2xl font-bold">Vehicle Management</h3>
              <p className="text-sm text-muted-foreground mt-1">Add, edit, or remove vehicles from your fleet</p>
            </div>

            {!vehicles || vehicles.length === 0 ? (
              <div className="p-12 flex flex-col items-center justify-center text-center">
                <div className="bg-primary/10 p-6 rounded-full mb-6">
                  <Car className="h-12 w-12 text-primary" />
                </div>
                <h4 className="text-xl font-bold mb-2">No Vehicles Found</h4>
                <p className="text-muted-foreground mb-6">Start by adding your first vehicle to the fleet.</p>
                <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
                  <PlusCircle className="h-5 w-5" />
                  Add Your First Vehicle
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-secondary/50">
                      <th className="px-6 py-4 text-left text-sm font-semibold">Vehicle</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">License Plate</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Mileage</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Last Service</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles.map((vehicle) => (
                      <tr
                        key={vehicle._id}
                        className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium">
                              {vehicle.year} {vehicle.make} {vehicle.model}
                            </p>
                            <p className="text-sm text-muted-foreground">{vehicle.vin}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <code className="text-sm bg-secondary/50 px-2 py-1 rounded">{vehicle.licensePlate}</code>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={getStatusColor(vehicle.status)}>{vehicle.status}</Badge>
                        </td>
                        <td className="px-6 py-4 text-sm">{vehicle.mileage.toLocaleString()} mi</td>
                        <td className="px-6 py-4 text-sm">
                          {vehicle.lastServiceDate ? new Date(vehicle.lastServiceDate).toLocaleDateString() : "N/A"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex gap-2 justify-end">
                            <Button size="sm" variant="outline" onClick={() => handleEdit(vehicle)} className="gap-1">
                              <Pencil className="h-4 w-4" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(vehicle)}
                              className="gap-1 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </main>

      {/* Dialogs */}
      <AddVehicleDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onSuccess={mutate} />
      {selectedVehicle && (
        <>
          <EditVehicleDialog
            vehicle={selectedVehicle}
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            onSuccess={mutate}
          />
          <DeleteVehicleDialog
            vehicle={selectedVehicle}
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onSuccess={mutate}
          />
        </>
      )}
    </div>
  )
}
