import { NextResponse } from "next/server"
import { getBackendUrl } from "../../_backend"

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const backend = getBackendUrl()
    const upstream = await fetch(`${backend}/api/vehicles/${params.id}`, { cache: "no-store" })
    const data = await upstream.json().catch(() => ({}))
    return NextResponse.json(data, { status: upstream.status })
  } catch (error) {
    console.error("Vehicle proxy GET error:", error)
    return NextResponse.json({ success: false, error: "Proxy vehicle failed" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const backend = getBackendUrl()
    const upstream = await fetch(`${backend}/api/vehicles/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    const data = await upstream.json().catch(() => ({}))
    return NextResponse.json(data, { status: upstream.status })
  } catch (error) {
    console.error("Vehicle proxy PUT error:", error)
    return NextResponse.json({ success: false, error: "Proxy vehicle update failed" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const backend = getBackendUrl()
    const upstream = await fetch(`${backend}/api/vehicles/${params.id}`, { method: "DELETE" })
    const data = await upstream.json().catch(() => ({}))
    return NextResponse.json(data, { status: upstream.status })
  } catch (error) {
    console.error("Vehicle proxy DELETE error:", error)
    return NextResponse.json({ success: false, error: "Proxy vehicle delete failed" }, { status: 500 })
  }
}
