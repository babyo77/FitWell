import dbConnect from "@/app/lib/db";
import DiaryEntry from "@/app/models/DiaryEntry";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const data = await request.json();
    const { foods, mealType, userId } = data;

    // Get or create today's diary entry
    const diaryEntry = await DiaryEntry.findOrCreateEntry(userId);

    // Convert the analyzed foods to the format expected by the schema
    const formattedFoods = foods.map((food: any) => ({
      name: food.name,
      calories: parseInt(food.calories),
      protein: parseInt(food.protein || food.protien || "0"),
      carbs: parseInt(food.carbs || "0"),
      fat: parseInt(food.fat || "0"),
      count: food.count || "1 serving",
      mealType,
    }));

    // Add foods to the appropriate meal array
    switch (mealType) {
      case "breakfast":
        diaryEntry.breakfast.push(...formattedFoods);
        break;
      case "lunch":
        diaryEntry.lunch.push(...formattedFoods);
        break;
      case "dinner":
        diaryEntry.dinner.push(...formattedFoods);
        break;
      default:
        throw new Error("Invalid meal type");
    }

    await diaryEntry.save();

    return NextResponse.json(
      {
        message: "Food entry saved successfully",
        entry: diaryEntry,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error saving food entry:", error);
    return NextResponse.json(
      { message: error.message || "Failed to save food entry" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  await dbConnect();

  try {
    const { userId, foodId, mealType } = await request.json();

    if (!userId || !foodId || !mealType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get only today's diary entry
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const diaryEntry = await DiaryEntry.findOne({
      userId,
      date: {
        $gte: today,
        $lte: endOfDay,
      },
    });

    if (!diaryEntry) {
      return NextResponse.json(
        { error: "Cannot delete from previous days" },
        { status: 403 }
      );
    }

    // Find the food item to get its calories before deletion
    const foodToDelete = (
      diaryEntry[mealType as keyof typeof diaryEntry] as any[]
    ).find((food) => food._id.toString() === foodId);

    if (!foodToDelete) {
      return NextResponse.json(
        { error: "Food item not found" },
        { status: 404 }
      );
    }

    // Remove the food item from the specified meal array using $pull
    const updateQuery = {
      $pull: {
        [`${mealType}`]: { _id: foodId },
      },
      // Subtract the calories from totalCalories
      $inc: {
        totalCalories: -foodToDelete.calories,
      },
    };

    await DiaryEntry.updateOne({ _id: diaryEntry._id }, updateQuery);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting food:", error);
    return NextResponse.json(
      { error: "Failed to delete food" },
      { status: 500 }
    );
  }
}
