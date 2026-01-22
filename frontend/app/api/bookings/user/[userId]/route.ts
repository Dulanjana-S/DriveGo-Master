import { NextResponse } from "next/server"
import { getBackendUrl } from "../../../_backend"

export async function GET(_req: Request, { params }: { params: { userId: string } }) {
  try {
    const backend = getBackendUrl()
    const upstream = await fetch(`${backend}/api/bookings/user/${params.userId}`, { cache: "no-store" })
    const bookings = await upstream.json().catch(() => [])
    return NextResponse.json({ success: true, data: bookings }, { status: upstream.status })
  } catch (error) {
    console.error("User bookings proxy GET error:", error)
    return NextResponse.json({ success: false, error: "Proxy user bookings failed" }, { status: 500 })
  }
}
