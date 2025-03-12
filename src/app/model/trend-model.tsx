import mongoose, { Schema, type Document } from "mongoose"

export interface FoodEntry {
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  date: Date
  mealType: "breakfast" | "lunch" | "dinner" | "snack"
}

export interface Trend extends Document {
  _id: string
  userId: string
  date: Date
  calorieIntake: number
  waterIntake: number
  exerciseCalories: number
  foodEntries: FoodEntry[]
  mostEatenFoods: {
    name: string
    count: number
  }[]
  weeklyAverage?: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
  monthlyAverage?: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
}

const TrendSchema = new Schema<Trend>(
  {
    _id: { type: String, required: true },
    userId: { type: String, required: true },
    date: { type: Date, default: Date.now },
    calorieIntake: { type: Number, default: 0 },
    waterIntake: { type: Number, default: 0 },
    exerciseCalories: { type: Number, default: 0 },
    foodEntries: [
      {
        name: { type: String, required: true },
        calories: { type: Number, required: true },
        protein: { type: Number, required: true },
        carbs: { type: Number, required: true },
        fat: { type: Number, required: true },
        date: { type: Date, default: Date.now },
        mealType: { type: String, enum: ["breakfast", "lunch", "dinner", "snack"], required: true },
      },
    ],
    mostEatenFoods: [
      {
        name: { type: String, required: true },
        count: { type: Number, required: true },
      },
    ],
    weeklyAverage: {
      calories: { type: Number },
      protein: { type: Number },
      carbs: { type: Number },
      fat: { type: Number },
    },
    monthlyAverage: {
      calories: { type: Number },
      protein: { type: Number },
      carbs: { type: Number },
      fat: { type: Number },
    },
  },
  { timestamps: true },
)

export default mongoose.models.Trend || mongoose.model<Trend>("Trend", TrendSchema)

