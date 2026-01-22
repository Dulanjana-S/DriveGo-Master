"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogIn } from "lucide-react"

interface LoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (user: any) => void
  onSwitchToRegister: () => void
}

export function LoginDialog({ open, onOpenChange, onSuccess, onSwitchToRegister }: LoginDialogProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"admin" | "user">("user")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  // ✅ CHANGE: use Express backend base URL (set in .env.local)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // ✅ CHANGE: normalize before sending
    const payload = {
      email: email.trim().toLowerCase(),
      password: password.trim(),
      role: role.trim().toLowerCase(),
    }

    try {
      // ✅ CHANGE: call Express directly (important for admin bcrypt login)
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        setError(data?.error || "Login failed")
        setLoading(false)
        return
      }

      // ✅ CHANGE: ensure role exists on returned user (fallback to selected role)
      const loggedUser = { ...(data.user || {}), role: data?.user?.role || role }

      localStorage.setItem("user", JSON.stringify(loggedUser))
      onSuccess(loggedUser)
      onOpenChange(false)

      // reset form
      setEmail("")
      setPassword("")
      setRole("user")

      // ✅ CHANGE: stop loading on success too
      setLoading(false)

      // redirect
      if (loggedUser.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl">Welcome Back</DialogTitle>
              <DialogDescription className="mt-1">
                Sign in to access your vehicle management dashboard
              </DialogDescription>
            </div>

            <div className="w-32 space-y-1">
              <select
                id="login-role"
                value={role}
                onChange={(e) => setRole(e.target.value as "admin" | "user")}
                disabled={loading}
                className="w-full px-3 py-1.5 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary space-y-0 mt-4"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              type="email"
              placeholder="admin@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="login-password">Password</Label>
            <Input
              id="login-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md border border-destructive/20">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            <LogIn className="mr-2 h-5 w-5" />
            {loading ? "Signing in..." : "Sign In"}
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">{"Don't have an account? "}</span>
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-primary hover:underline font-medium"
              disabled={loading}
            >
              Create Account
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
