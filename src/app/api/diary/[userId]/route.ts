import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/db";
import DiaryEntry from "@/app/models/DiaryEntry";

export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    // Extract userId from the URL
    const pathnameParts = request.nextUrl.pathname.split("/");
    const userId = pathnameParts[pathnameParts.length - 1]; // Get the last part of the path

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get("date");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (date) {
      const foodDiary = await DiaryEntry.getUserDayFood(userId, new Date(date));
      if (!foodDiary) {
        return NextResponse.json(
          { message: "No entries found for this date" },
          { status: 404 }
        );
      }
      return NextResponse.json(foodDiary);
    }

    if (startDate && endDate) {
      const foodDiaries = await DiaryEntry.getUserFoodRange(
        userId,
        new Date(startDate),
        new Date(endDate)
      );
      return NextResponse.json(foodDiaries);
    }

    // Default to today's entries
    const todayEntries = await DiaryEntry.getUserDayFood(userId);
    return NextResponse.json(
      todayEntries || { message: "No entries found for today" }
    );
  } catch (error: any) {
    console.error("Error fetching food diary:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch food diary" },
      { status: 500 }
    );
  }
}
