import mongoose, { Schema, Document } from "mongoose";

// Interface for individual food items
interface IFoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  quantity: number;
}

// Interface for each meal type
interface IMeal {
  foods: IFoodItem[];
  totalCalories: number;
}

// Main interface for the diary entry
interface IDiaryEntry extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  calorieGoal: number;
  breakfast: IMeal;
  lunch: IMeal;
  dinner: IMeal;
  snacks: IMeal;
  totalCalories: number;
  createdAt: Date;
  updatedAt: Date;
}

// Schema for food items
const FoodItemSchema = new Schema({
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fat: { type: Number, default: 0 },
  servingSize: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
});

// Schema for meals
const MealSchema = new Schema({
  foods: [FoodItemSchema],
  totalCalories: {
    type: Number,
    default: 0,
  },
});

// Main diary entry schema
const DiaryEntrySchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    calorieGoal: {
      type: Number,
      required: true,
      default: 2000,
    },
    breakfast: {
      type: MealSchema,
      default: { foods: [], totalCalories: 0 },
    },
    lunch: {
      type: MealSchema,
      default: { foods: [], totalCalories: 0 },
    },
    dinner: {
      type: MealSchema,
      default: { foods: [], totalCalories: 0 },
    },
    snacks: {
      type: MealSchema,
      default: { foods: [], totalCalories: 0 },
    },
    totalCalories: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to calculate total calories before saving
DiaryEntrySchema.pre("save", function (next) {
  const entry = this as IDiaryEntry;

  // Calculate total calories for each meal
  entry.breakfast.totalCalories = entry.breakfast.foods.reduce(
    (sum, food) => sum + food.calories * food.quantity,
    0
  );

  entry.lunch.totalCalories = entry.lunch.foods.reduce(
    (sum, food) => sum + food.calories * food.quantity,
    0
  );

  entry.dinner.totalCalories = entry.dinner.foods.reduce(
    (sum, food) => sum + food.calories * food.quantity,
    0
  );

  entry.snacks.totalCalories = entry.snacks.foods.reduce(
    (sum, food) => sum + food.calories * food.quantity,
    0
  );

  // Calculate total calories for the day
  entry.totalCalories =
    entry.breakfast.totalCalories +
    entry.lunch.totalCalories +
    entry.dinner.totalCalories +
    entry.snacks.totalCalories;

  next();
});

// Create and export the model
const DiaryEntry =
  mongoose.models.DiaryEntry ||
  mongoose.model<IDiaryEntry>("DiaryEntry", DiaryEntrySchema);

export default DiaryEntry;
