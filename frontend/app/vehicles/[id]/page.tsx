import { notFound } from "next/navigation"
import { VehicleDetailView } from "@/components/vehicle-detail-view"
import type { Vehicle } from "@/lib/types"

async function getVehicle(id: string): Promise<Vehicle | null> {
  const backend = process.env.BACKEND_URL || "http://localhost:5000"

  try {
    const res = await fetch(`${backend}/api/vehicles/${id}`, { cache: "no-store" })
    if (!res.ok) return null
    const json = await res.json().catch(() => null)
    return (json?.data || null) as Vehicle | null
  } catch {
    return null
  }
}

export default async function VehiclePage({ params }: { params: { id: string } }) {
  const vehicle = await getVehicle(params.id)
  if (!vehicle) notFound()

  return (
    <div className="min-h-screen bg-background">
      <VehicleDetailView vehicle={vehicle} />
    </div>
  )
}
