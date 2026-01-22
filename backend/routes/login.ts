// backend/routes/login.ts
import { Router } from "express"
import { connectDB } from "../db"
import User from "../models/User"
import Admin from "../models/Admin"
import bcrypt from "bcryptjs"

const router = Router()
router.post("/", async (req, res) => {
  try {
    await connectDB()

    let { email, password, role } = req.body

    // ✅ normalize ALL
    email = String(email || "").trim().toLowerCase()
    password = String(password || "").trim()
    role = String(role || "").trim().toLowerCase()

    console.log("LOGIN BODY:", { email, role, passwordLen: password.length })

    let user
    if (role === "admin") {
      user = await Admin.findOne({ email })
      console.log("ADMIN LOOKUP RESULT:", !!user)
    } else {
      user = await User.findOne({ email })
      console.log("USER LOOKUP RESULT:", !!user)
    }

    if (!user) {
      console.log("LOGIN FAIL: user not found", { email, role })
      return res.status(401).json({ success: false, error: "Invalid credentials" })
    }

    const storedPassword = String(user.password || "").trim()
    console.log("STORED PASS PREFIX:", storedPassword.slice(0, 4))

    let isMatch = false
    if (storedPassword.startsWith("$2b$") || storedPassword.startsWith("$2a$")) {
      isMatch = await bcrypt.compare(password, storedPassword)
      console.log("BCRYPT COMPARE RESULT:", isMatch)
    } else {
      isMatch = password === storedPassword
      console.log("PLAIN COMPARE RESULT:", isMatch)
    }

    if (!isMatch) {
      console.log("LOGIN FAIL: password mismatch", { email, role })
      return res.status(401).json({ success: false, error: "Invalid credentials" })
    }

    const { password: _, ...userWithoutPassword } = user.toObject()
    return res.json({ success: true, user: { ...userWithoutPassword, role } })
  } catch (err) {
    console.error("LOGIN ERROR:", err)
    return res.status(500).json({ success: false, error: "Login failed" })
  }
})


export default router