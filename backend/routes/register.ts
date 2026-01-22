
{/*

import { NextResponse } from "next/server";
import User from "@/lib/User"; // Fixed path
import { connectDB } from "@/lib/db"; // Fixed path
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    console.log("REGISTER BODY =>", body);
    const { email, password, fullName } = body;

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    const { password: _, ...userWithoutPassword } = user.toObject();

    return NextResponse.json(
      { success: true, user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("REGISTER ERROR:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "Email already registered" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Registration failed" },
      { status: 500 }
    );
  }
}
*/}
// backend/routes/register.ts
import { Router } from "express"
import { connectDB } from "../db"
import User from "../models/User"
import bcrypt from "bcryptjs"

const router = Router()

// POST /api/auth/register
router.post("/", async (req, res) => {
  try {
    await connectDB()

    const { email, password, fullName } = req.body

    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
      })
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "User already exists",
      })
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      fullName,
    })

    // Remove password before sending response
    const { password: _, ...userWithoutPassword } = user.toObject()

    res.status(201).json({
      success: true,
      user: userWithoutPassword,
    })
  } catch (err) {
    console.error("REGISTER ERROR:", err)
    res.status(500).json({ success: false, error: "Registration failed" })
  }
})

export default router
