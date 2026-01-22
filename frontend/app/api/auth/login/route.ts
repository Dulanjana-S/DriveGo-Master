import { NextResponse } from "next/server"
import { getBackendUrl } from "../../_backend"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const backend = getBackendUrl()

    const upstream = await fetch(`${backend}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    const data = await upstream.json().catch(() => ({}))
    return NextResponse.json(data, { status: upstream.status })
  } catch (error) {
    console.error("Login proxy error:", error)
    return NextResponse.json({ success: false, error: "Proxy login failed" }, { status: 500 })
  }
}
