import { Card } from "@/components/ui/card"
import { Car, Wrench, Archive, TrendingUp } from "lucide-react"
import type { Vehicle } from "@/lib/types"

interface VehicleStatsProps {
  vehicles: Vehicle[]
}

export function VehicleStats({ vehicles }: VehicleStatsProps) {
  const activeCount = vehicles.filter((v) => v.status === "active").length
  const maintenanceCount = vehicles.filter((v) => v.status === "maintenance").length
  const retiredCount = vehicles.filter((v) => v.status === "retired").length
  const totalMileage = vehicles.reduce((sum, v) => sum + v.mileage, 0)

  const stats = [
    {
      title: "Active Vehicles",
      value: activeCount,
      icon: Car,
      color: "text-chart-1",
    },
    {
      title: "In Maintenance",
      value: maintenanceCount,
      icon: Wrench,
      color: "text-chart-3",
    },
    {
      title: "Retired",
      value: retiredCount,
      icon: Archive,
      color: "text-muted-foreground",
    },
    {
      title: "Total Mileage",
      value: `${totalMileage.toLocaleString()} mi`,
      icon: TrendingUp,
      color: "text-chart-2",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
              </div>
              <Icon className={`h-10 w-10 ${stat.color}`} />
            </div>
          </Card>
        )
      })}
    </div>
  )
}
