import { NextResponse } from "next/server";
import User from "@/app/model/user-model";
import mongoose from "mongoose";
import dbConnect from "@/app/lib/db";

// Configure route settings
export const dynamic = "force-dynamic";
export const maxDuration = 60; // 5 minute timeout

export async function GET(request: Request) {
  try {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    await User.updateMany({}, { exercise: 0 });

    return NextResponse.json({
      success: true,
      message: "Exercise values reset successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in exercise reset cron:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
