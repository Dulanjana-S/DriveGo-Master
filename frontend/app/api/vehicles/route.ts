import { NextResponse } from "next/server"
import { getBackendUrl } from "../_backend"

export async function GET() {
  try {
    const backend = getBackendUrl()
    const upstream = await fetch(`${backend}/api/vehicles`, { cache: "no-store" })
    const data = await upstream.json().catch(() => ({}))
    return NextResponse.json(data, { status: upstream.status })
  } catch (error) {
    console.error("Vehicles proxy GET error:", error)
    return NextResponse.json({ success: false, error: "Proxy vehicles failed" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const backend = getBackendUrl()
    const upstream = await fetch(`${backend}/api/vehicles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    const data = await upstream.json().catch(() => ({}))
    return NextResponse.json(data, { status: upstream.status })
  } catch (error) {
    console.error("Vehicles proxy POST error:", error)
    return NextResponse.json({ success: false, error: "Proxy vehicle create failed" }, { status: 500 })
  }
}
