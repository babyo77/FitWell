import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/app/lib/db"
import Trend from "@/app/model/trend-model"
import { v4 as uuidv4 } from "uuid"
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns"

// Define the FoodEntry interface
interface FoodEntry {
  name: string;
  protein: number;
  carbs: number;
  fat: number;
  // Add any other properties that might be in your food entries
}

// Get trends for a user
export async function GET(request: NextRequest) {
  await dbConnect()
  const userId = request.nextUrl.searchParams.get("userId")
  const period = request.nextUrl.searchParams.get("period") || "week" // week, month, year

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  try {
    let startDate, endDate
    const today = new Date()

    if (period === "week") {
      startDate = startOfWeek(today)
      endDate = endOfWeek(today)
    } else if (period === "month") {
      startDate = startOfMonth(today)
      endDate = endOfMonth(today)
    } else {
      // Default to last 30 days
      startDate = new Date()
      startDate.setDate(startDate.getDate() - 30)
      endDate = today
    }

    // Get trends for the specified period
    const trends = await Trend.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: 1 })

    // Calculate averages
    const totalDays = trends.length

    if (totalDays === 0) {
      return NextResponse.json(
        {
          trends: [],
          averages: {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            water: 0,
          },
          mostEatenFoods: [],
        },
        { status: 200 },
      )
    }

    // Calculate averages
    const averages = {
      calories: trends.reduce((sum: number, t) => sum + t.calorieIntake, 0) / totalDays,
      protein: trends.reduce((sum: number, t) => sum + (t.weeklyAverage?.protein || 0), 0) / totalDays,
      carbs: trends.reduce((sum: number, t) => sum + (t.weeklyAverage?.carbs || 0), 0) / totalDays,
      fat: trends.reduce((sum: number, t) => sum + (t.weeklyAverage?.fat || 0), 0) / totalDays,
      water: trends.reduce((sum: number, t) => sum + t.waterIntake, 0) / totalDays,
    }

    // Get most eaten foods
    const foodCounts: Record<string, number> = {}

    trends.forEach((trend) => {
      trend.foodEntries.forEach((entry: FoodEntry) => {
        if (foodCounts[entry.name]) {
          foodCounts[entry.name]++
        } else {
          foodCounts[entry.name] = 1
        }
      })
    })

    const mostEatenFoods = Object.entries(foodCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    return NextResponse.json(
      {
        trends,
        averages,
        mostEatenFoods,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error fetching trends:", error)
    return NextResponse.json({ error: "Failed to fetch trends" }, { status: 500 })
  }
}

// Create or update trend for today
export async function POST(request: NextRequest) {
  await dbConnect()
  const data = await request.json()

  if (!data.userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Check if trend exists for today
    let trend = await Trend.findOne({
      userId: data.userId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    })

    if (!trend) {
      // Create new trend
      trend = await Trend.create({
        _id: uuidv4(),
        userId: data.userId,
        date: today,
        calorieIntake: data.calorieIntake || 0,
        waterIntake: data.waterIntake || 0,
        exerciseCalories: data.exerciseCalories || 0,
        foodEntries: data.foodEntries || [],
        mostEatenFoods: [],
      })
    } else {
      // Update existing trend
      if (data.calorieIntake !== undefined) trend.calorieIntake = data.calorieIntake
      if (data.waterIntake !== undefined) trend.waterIntake = data.waterIntake
      if (data.exerciseCalories !== undefined) trend.exerciseCalories = data.exerciseCalories

      if (data.foodEntries && data.foodEntries.length > 0) {
        // Add new food entries
        trend.foodEntries.push(...data.foodEntries)
      }

      await trend.save()
    }

    // Update most eaten foods
    const foodCounts: Record<string, number> = {}
    trend.foodEntries.forEach((entry: FoodEntry) => {
      if (foodCounts[entry.name]) {
        foodCounts[entry.name]++
      } else {
        foodCounts[entry.name] = 1
      }
    })

    trend.mostEatenFoods = Object.entries(foodCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Calculate weekly and monthly averages
    const weekStart = startOfWeek(today)
    const weekEnd = endOfWeek(today)
    const monthStart = startOfMonth(today)
    const monthEnd = endOfMonth(today)

    // Weekly average
    const weeklyTrends = await Trend.find({
      userId: data.userId,
      date: { $gte: weekStart, $lte: weekEnd },
    })

    if (weeklyTrends.length > 0) {
      trend.weeklyAverage = {
        calories: weeklyTrends.reduce((sum: number, t) => sum + t.calorieIntake, 0) / weeklyTrends.length,
        protein:
          weeklyTrends.reduce((sum: number, t) => {
            const totalProtein = t.foodEntries.reduce((p: number, entry: FoodEntry) => p + entry.protein, 0)
            return sum + totalProtein
          }, 0) / weeklyTrends.length,
        carbs:
          weeklyTrends.reduce((sum: number, t) => {
            const totalCarbs = t.foodEntries.reduce((c: number, entry: FoodEntry) => c + entry.carbs, 0)
            return sum + totalCarbs
          }, 0) / weeklyTrends.length,
        fat:
          weeklyTrends.reduce((sum: number, t) => {
            const totalFat = t.foodEntries.reduce((f: number, entry: FoodEntry) => f + entry.fat, 0)
            return sum + totalFat
          }, 0) / weeklyTrends.length,
      }
    }

    // Monthly average
    const monthlyTrends = await Trend.find({
      userId: data.userId,
      date: { $gte: monthStart, $lte: monthEnd },
    })

    if (monthlyTrends.length > 0) {
      trend.monthlyAverage = {
        calories: monthlyTrends.reduce((sum: number, t) => sum + t.calorieIntake, 0) / monthlyTrends.length,
        protein:
          monthlyTrends.reduce((sum: number, t) => {
            const totalProtein = t.foodEntries.reduce((p: number, entry: FoodEntry) => p + entry.protein, 0)
            return sum + totalProtein
          }, 0) / monthlyTrends.length,
        carbs:
          monthlyTrends.reduce((sum: number, t) => {
            const totalCarbs = t.foodEntries.reduce((c: number, entry: FoodEntry) => c + entry.carbs, 0)
            return sum + totalCarbs
          }, 0) / monthlyTrends.length,
        fat:
          monthlyTrends.reduce((sum: number, t) => {
            const totalFat = t.foodEntries.reduce((f: number, entry: FoodEntry) => f + entry.fat, 0)
            return sum + totalFat
          }, 0) / monthlyTrends.length,
      }
    }

    await trend.save()

    return NextResponse.json({ trend }, { status: 200 })
  } catch (error) {
    console.error("Error updating trend:", error)
    return NextResponse.json({ error: "Failed to update trend" }, { status: 500 })
  }
}