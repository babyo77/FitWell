import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/app/lib/db"
import Challenge from "@/app/model/challenge-model"
import { v4 as uuidv4 } from "uuid"

// Get all challenges for a user
export async function GET(request: NextRequest) {
  await dbConnect()
  const userId = request.nextUrl.searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  try {
    const challenges = await Challenge.find({ userId })
    return NextResponse.json({ challenges }, { status: 200 })
  } catch (error) {
    console.error("Error fetching challenges:", error)
    return NextResponse.json({ error: "Failed to fetch challenges" }, { status: 500 })
  }
}

// Create a new challenge
export async function POST(request: NextRequest) {
  await dbConnect()
  const data = await request.json()

  if (!data.userId || !data.title || !data.type || !data.category || !data.targetValue) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  try {
    const challenge = await Challenge.create({
      _id: uuidv4(),
      ...data,
      startDate: new Date(),
      completed: false,
    })

    return NextResponse.json({ challenge }, { status: 201 })
  } catch (error) {
    console.error("Error creating challenge:", error)
    return NextResponse.json({ error: "Failed to create challenge" }, { status: 500 })
  }
}

// Update a challenge
export async function PATCH(request: NextRequest) {
  await dbConnect()
  const data = await request.json()

  if (!data._id) {
    return NextResponse.json({ error: "Challenge ID is required" }, { status: 400 })
  }

  try {
    const challenge = await Challenge.findById(data._id)

    if (!challenge) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 })
    }

    // Check if challenge is being completed
    if (data.completed && !challenge.completed) {
      data.completedDate = new Date()
    }

    const updatedChallenge = await Challenge.findByIdAndUpdate(data._id, { $set: data }, { new: true })

    return NextResponse.json({ challenge: updatedChallenge }, { status: 200 })
  } catch (error) {
    console.error("Error updating challenge:", error)
    return NextResponse.json({ error: "Failed to update challenge" }, { status: 500 })
  }
}

// Delete a challenge
export async function DELETE(request: NextRequest) {
  await dbConnect()
  const id = request.nextUrl.searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Challenge ID is required" }, { status: 400 })
  }

  try {
    const challenge = await Challenge.findByIdAndDelete(id)

    if (!challenge) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Challenge deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting challenge:", error)
    return NextResponse.json({ error: "Failed to delete challenge" }, { status: 500 })
  }
}

