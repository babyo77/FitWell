import { NextResponse } from "next/server";
import DiaryEntry from "@/models/DiaryEntry";

// Create a new diary entry
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newEntry = await DiaryEntry.create({
      userId: body.userId,
      calorieGoal: body.calorieGoal,
      // other fields...
    });
    return NextResponse.json(newEntry);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create diary entry" },
      { status: 500 }
    );
  }
}

// Add food to a meal
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { diaryId, mealType, food } = body;

    const entry = await DiaryEntry.findById(diaryId);
    if (!entry) {
      return NextResponse.json(
        { error: "Diary entry not found" },
        { status: 404 }
      );
    }

    entry[mealType].foods.push(food);
    await entry.save();

    return NextResponse.json(entry);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update diary entry" },
      { status: 500 }
    );
  }
}

// Get diary entry for a specific date
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const date = searchParams.get("date");

    const entry = await DiaryEntry.findOne({
      userId,
      date: {
        $gte: new Date(date!).setHours(0, 0, 0),
        $lt: new Date(date!).setHours(23, 59, 59),
      },
    });

    return NextResponse.json(entry || {});
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch diary entry" },
      { status: 500 }
    );
  }
}
