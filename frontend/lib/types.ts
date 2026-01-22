export interface Vehicle {
  _id?: string
  make: string
  model: string
  year: number
  vin: string
  licensePlate: string
  color: string
  mileage: number
  status: "active" | "maintenance" | "retired"
  purchaseDate: string
  lastServiceDate?: string
  notes?: string
  imageUrl?: string
  dailyRate: number
  createdAt?: string
  updatedAt?: string
}

export interface Booking {
  _id?: string
  vehicleId: string
  vehicleName: string
  userId: string
  userEmail: string
  pickupDate: string
  returnDate: string
  pickupLocation: string
  totalDays: number
  totalPrice: number
  numberOfDrivers?: number
  paymentMethod: "cash" | "card"
  paymentStatus: "pending" | "paid"
  createdAt?: string
  updatedAt?: string
}
