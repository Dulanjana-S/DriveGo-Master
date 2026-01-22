import mongoose, { Document } from "mongoose"
import Counter from "./Counter"

interface IAdmin extends Document {
  adminId?: number
  fullName: string
  email: string
  password: string
}

const AdminSchema = new mongoose.Schema<IAdmin>(
  {
    adminId: { type: Number, unique: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
)

// ✅ Async pre-save hook (no next)
AdminSchema.pre<IAdmin>("save", async function () {
  if (this.adminId) return

  const counter = await Counter.findOneAndUpdate(
    { name: "adminId" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  )

  this.adminId = counter.seq
})

export default mongoose.models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema)
