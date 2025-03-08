import dbConnect from "@/app/lib/db";
import DiaryEntry from "@/app/models/DiaryEntry";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  await dbConnect();

  try {
    const { userId } = params;
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get("date");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // If specific date is provided
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

    // If date range is provided
    if (startDate && endDate) {
      const foodDiaries = await DiaryEntry.getUserFoodRange(
        userId,
        new Date(startDate),
        new Date(endDate)
      );

      return NextResponse.json(foodDiaries);
    }

    // If no date parameters, return today's entries
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
