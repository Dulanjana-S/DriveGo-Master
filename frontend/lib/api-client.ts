import type { Vehicle } from "@/lib/types"

const API_BASE = "/api/vehicles"

export async function fetchVehicles(): Promise<Vehicle[]> {
  const response = await fetch(API_BASE, { cache: "no-store" })
  const data = await response.json()
  if (!data.success) throw new Error(data.error)
  return data.data
}

export async function fetchVehicle(id: string): Promise<Vehicle> {
  const response = await fetch(`${API_BASE}/${id}`, { cache: "no-store" })
  const data = await response.json()
  if (!data.success) throw new Error(data.error)
  return data.data
}

export async function createVehicleApi(vehicle: Omit<Vehicle, "_id" | "createdAt" | "updatedAt">): Promise<Vehicle> {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(vehicle),
  })
  const data = await response.json()
  if (!data.success) throw new Error(data.error)
  return data.data
}

export async function updateVehicleApi(id: string, updates: Partial<Vehicle>): Promise<Vehicle> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  })
  const data = await response.json()
  if (!data.success) throw new Error(data.error)
  return data.data
}

export async function deleteVehicleApi(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, { method: "DELETE" })
  const data = await response.json()
  if (!data.success) throw new Error(data.error)
}
