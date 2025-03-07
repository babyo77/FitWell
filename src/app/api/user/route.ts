import dbConnect from "@/app/lib/db";
import User from "@/app/model/user-model";
import { NextRequest, NextResponse } from "next/server";

// Create a new user
export async function PUT(request: NextRequest) {
  await dbConnect();
  const data = await request.json();

  const user = await User.create({ _id: data.uid, ...data });
  if (!user) {
    return NextResponse.json({ message: "User not saved" }, { status: 400 });
  }
  return NextResponse.json({ message: "User saved" }, { status: 200 });
}

// Update a user onboarding status
export async function PATCH(request: NextRequest) {
  await dbConnect();
  const data = await request.json();
  const user = await User.findById(data.uid);
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 400 });
  }
  const updatedUser = await User.findByIdAndUpdate(data.uid, { ...data });
  return NextResponse.json({ updatedUser }, { status: 200 });
}

// Get a user
export async function GET(request: NextRequest) {
  await dbConnect();
  const uid = await request.nextUrl.searchParams.get("uid");
  const user = await User.findById(uid);
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 400 });
  }
  return NextResponse.json({ user }, { status: 200 });
}
