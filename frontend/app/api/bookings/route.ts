import { NextResponse } from "next/server"
import { getBackendUrl } from "../_backend"

export async function GET() {
  try {
    const backend = getBackendUrl()
    const upstream = await fetch(`${backend}/api/bookings`, { cache: "no-store" })
    const bookings = await upstream.json().catch(() => [])

    // backend returns raw array
    return NextResponse.json({ success: true, data: bookings }, { status: upstream.status })
  } catch (error) {
    console.error("Bookings proxy GET error:", error)
    return NextResponse.json({ success: false, error: "Proxy bookings failed" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const backend = getBackendUrl()
    const upstream = await fetch(`${backend}/api/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    const data = await upstream.json().catch(() => ({}))
    return NextResponse.json(data, { status: upstream.status })
  } catch (error) {
    console.error("Bookings proxy POST error:", error)
    return NextResponse.json({ success: false, error: "Proxy booking create failed" }, { status: 500 })
  }
}
