"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import { fetchVehicles } from "@/lib/api-client"
import { VehicleShowcase } from "@/components/vehicle-showcase"
import { VehicleStats } from "@/components/vehicle-stats"
import { LoginDialog } from "@/components/login-dialog"
import { RegisterDialog } from "@/components/register-dialog"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LogOut, LogIn, UserPlus, Car, TrendingUp, Users, Shield, Bookmark, Info, MapPin, Phone, Mail } from "lucide-react"

export default function HomePage() {
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const { data: vehicles, error, mutate } = useSWR("vehicles", fetchVehicles)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
  }

  const handleAuthSuccess = (userData: any) => {
    setUser(userData)
  }

  const switchToRegister = () => {
    setIsLoginDialogOpen(false)
    setIsRegisterDialogOpen(true)
  }

  const switchToLogin = () => {
    setIsRegisterDialogOpen(false)
    setIsLoginDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">


          
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img
            src="/logo.png"
            alt="DriveGo Logo"
            className="h-10 w-auto"
                  />


              <div>
                <h1 className="text-xl font-bold">DriveGo  </h1>
                <p className="text-xs text-muted-foreground">Vehicle Rental Service</p>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <div className="flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-lg">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </div>
                  <Link href="/about">
                    <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                      <Info className="h-4 w-4" />
                      About Us
                    </Button>
                  </Link>
                  <Link href="/my-bookings">
                    <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                      <Bookmark className="h-4 w-4" />
                      My Bookings
                    </Button>
                  </Link>
                  
                  <Button onClick={handleLogout} size="sm" variant="outline">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/about">
                    <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                      <Info className="h-4 w-4" />
                      About Us
                    </Button>
                  </Link>
                  <Button onClick={() => setIsLoginDialogOpen(true)} size="sm" variant="outline">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                  <Button onClick={() => setIsRegisterDialogOpen(true)} size="sm">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create Account
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative border-b border-border/40 bg-gradient-to-br from-card via-background to-accent/5 overflow-hidden">
        <div className="absolute inset-0 bg-grid-small-white/5"></div>
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-5xl md:text-6xl font-bold text-balance">Sri Lanka's No.1 Vehicle Rental Hub</h2>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              Browse Our Wide Range of Well Maintained Cars
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{vehicles?.length || 0} Available</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="space-y-16">
          {/* Stats Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-3xl font-bold mb-2">Fleet Overview</h3>
              <p className="text-muted-foreground">Key metrics of our vehicle collection</p>
            </div>
            <VehicleStats vehicles={vehicles || []} />
          </div>

          {/* Vehicles Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-3xl font-bold mb-2">Available Vehicles</h3>
              <p className="text-muted-foreground">Browse our complete inventory</p>
            </div>
            <VehicleShowcase
              vehicles={vehicles || []}
              isLoading={!vehicles && !error}
              onUpdate={mutate}
              isAdmin={user?.role === "admin"}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-gradient-to-b from-card/50 to-card/30 mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand Info */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-foreground">DriveGo</h4>
              <p className="text-sm text-muted-foreground">Sri Lanka's No.1 Vehicle Rental Hub</p>
            </div>

            {/* Showroom Location */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Office Location
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Bank of Ceylon Mawatha, <br/>
                Colombo, Sri Lanka
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-foreground">Contact Us</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>+94 11 7575 600</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>drivegolk@gmail.com</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border/40 pt-8 flex items-center justify-between text-sm text-muted-foreground">
            <p>&copy; 2026 DriveGo. All rights reserved.</p>
            {user && <p>Logged in as {user.email}</p>}
          </div>
        </div>
      </footer>

      {/* Auth Dialogs */}
      <LoginDialog
        open={isLoginDialogOpen}
        onOpenChange={setIsLoginDialogOpen}
        onSuccess={handleAuthSuccess}
        onSwitchToRegister={switchToRegister}
      />
      <RegisterDialog
        open={isRegisterDialogOpen}
        onOpenChange={setIsRegisterDialogOpen}
        onSuccess={handleAuthSuccess}
        onSwitchToLogin={switchToLogin}
      />
    </div>
  )
}
