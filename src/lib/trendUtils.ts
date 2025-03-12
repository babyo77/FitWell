import { format } from "date-fns"

// Update daily trend data
export async function updateDailyTrend(
  userId: string,
  data: {
    calorieIntake?: number
    waterIntake?: number
    exerciseCalories?: number
    foodEntries?: Array<{
      name: string
      calories: number
      protein: number
      carbs: number
      fat: number
      mealType: "breakfast" | "lunch" | "dinner" | "snack"
    }>
  },
) {
  try {
    const response = await fetch("/api/trends", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        ...data,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to update trend data")
    }

    return await response.json()
  } catch (error) {
    console.error("Error updating trend data:", error)
    throw error
  }
}

// Get trend data for a specific period
export async function getTrendData(userId: string, period: "week" | "month" | "year" = "week") {
  try {
    const response = await fetch(`/api/trends?userId=${userId}&period=${period}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch trend data")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching trend data:", error)
    throw error
  }
}

// Generate improvement suggestions based on trend data
export function generateSuggestions(trendData: any): string[] {
  const suggestions: string[] = []

  // Check calorie intake
  if (trendData.averages.calories > 2500) {
    suggestions.push("Consider reducing your daily calorie intake to maintain a healthy balance.")
  } else if (trendData.averages.calories < 1200) {
    suggestions.push("Your calorie intake seems low. Make sure you're getting enough nutrition.")
  }

  // Check protein intake
  if (trendData.averages.protein < 50) {
    suggestions.push("Try to increase your protein intake for better muscle recovery and satiety.")
  }

  // Check water intake
  if (trendData.averages.water < 2000) {
    suggestions.push("You're not drinking enough water. Aim for at least 2 liters daily.")
  }

  // Check most eaten foods
  if (trendData.mostEatenFoods.length > 0) {
    const topFood = trendData.mostEatenFoods[0]
    suggestions.push(`You've eaten ${topFood.name} ${topFood.count} times. Try adding more variety to your diet.`)
  }

  // If no specific suggestions, add a general one
  if (suggestions.length === 0) {
    suggestions.push("Keep up the good work! Your eating habits look balanced.")
  }

  return suggestions
}

// Format trend data for charts
export function formatTrendDataForCharts(trendData: any) {
  // Format calorie data for line chart
  const calorieData = trendData.trends.map((trend: any) => ({
    date: format(new Date(trend.date), "MMM dd"),
    calories: trend.calorieIntake,
  }))

  // Format macros data for pie chart
  const macrosData = [
    { name: "Protein", value: trendData.averages.protein },
    { name: "Carbs", value: trendData.averages.carbs },
    { name: "Fat", value: trendData.averages.fat },
  ]

  // Format most eaten foods for bar chart
  const foodData = trendData.mostEatenFoods.map((food: any) => ({
    name: food.name,
    count: food.count,
  }))

  return {
    calorieData,
    macrosData,
    foodData,
  }
}

