import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/app/lib/db"
import User from "@/app/model/user-model"

export async function GET(request: NextRequest) {
  await dbConnect()
  const uid = request.nextUrl.searchParams.get("uid")

  if (!uid) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  try {
    const user = await User.findById(uid)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ streaks: user.streaks || 0 }, { status: 200 })
  } catch (error) {
    console.error("Error fetching streaks:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  await dbConnect()
  const { uid } = await request.json()

  if (!uid) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  try {
    const user = await User.findById(uid)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const lastStreak = user.lastStreak ? new Date(user.lastStreak) : null
    lastStreak?.setHours(0, 0, 0, 0)

    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    // If last streak was yesterday, increment streak
    if (lastStreak?.getTime() === yesterday.getTime()) {
      user.streaks += 1
    } 
    // If last streak was not yesterday and not today, reset streak
    else if (!lastStreak || lastStreak.getTime() !== today.getTime()) {
      user.streaks = 1
    }
    // If already logged today, don't change streak but update timestamp
    
    user.lastStreak = today

    await user.save()

    return NextResponse.json({ streaks: user.streaks }, { status: 200 })
  } catch (error) {
    console.error("Error updating streaks:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

