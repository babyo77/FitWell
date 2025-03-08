import mongoose, { Schema, Document } from "mongoose";

// Interface for individual food items
interface IFoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  count: string;
  mealType: "breakfast" | "lunch" | "dinner";
}

// Main interface for the diary entry
interface IDiaryEntry extends Document {
  userId: string;
  date: Date;
  breakfast: IFoodItem[];
  lunch: IFoodItem[];
  dinner: IFoodItem[];
  totalCalories: number;
  createdAt: Date;
  updatedAt: Date;
}

// Add this interface for the summarized meal data
interface IMealSummary {
  totalCalories: number;
  foods: IFoodItem[];
}

interface IDaySummary {
  date: Date;
  breakfast: IMealSummary;
  lunch: IMealSummary;
  dinner: IMealSummary;
  totalCalories: number;
}

// Add this interface right before the DiaryEntry model definition
interface DiaryEntryModel extends mongoose.Model<IDiaryEntry> {
  findOrCreateEntry(userId: string, date?: Date): Promise<IDiaryEntry>;
  getUserDayFood(userId: string, date?: Date): Promise<IDaySummary | null>;
  getUserFoodRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<IDiaryEntry[]>;
}

// Schema for food items
const FoodItemSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  calories: {
    type: Number,
    required: true,
    min: 0,
  },
  protein: {
    type: Number,
    default: 0,
    min: 0,
  },
  carbs: {
    type: Number,
    default: 0,
    min: 0,
  },
  fat: {
    type: Number,
    default: 0,
    min: 0,
  },
  count: {
    type: String,
    default: "1 serving",
  },
  mealType: {
    type: String,
    enum: ["breakfast", "lunch", "dinner"],
    required: true,
  },
});

// Main diary entry schema
const DiaryEntrySchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    breakfast: [FoodItemSchema],
    lunch: [FoodItemSchema],
    dinner: [FoodItemSchema],
    totalCalories: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate total calories before saving
DiaryEntrySchema.pre("save", function (next) {
  const entry = this as IDiaryEntry;

  // Helper function to calculate calories for an array of foods
  const calculateMealCalories = (foods: IFoodItem[]) =>
    foods.reduce((sum, food) => sum + food.calories, 0);

  // Calculate total calories from all meals
  const breakfastCalories = calculateMealCalories(entry.breakfast);
  const lunchCalories = calculateMealCalories(entry.lunch);
  const dinnerCalories = calculateMealCalories(entry.dinner);

  entry.totalCalories = breakfastCalories + lunchCalories + dinnerCalories;

  next();
});

// Add indexes for common queries
DiaryEntrySchema.index({ userId: 1, date: -1 });

// Static method to find or create a diary entry for a specific date
DiaryEntrySchema.statics.findOrCreateEntry = async function (
  userId: string,
  date: Date = new Date()
) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  let entry = await this.findOne({
    userId,
    date: {
      $gte: startOfDay,
      $lt: endOfDay,
    },
  });

  if (!entry) {
    entry = new this({
      userId,
      date: startOfDay,
    });
  }

  return entry;
};

// Add these static methods to DiaryEntrySchema
DiaryEntrySchema.statics.getUserDayFood = async function (
  userId: string,
  date: Date = new Date()
): Promise<IDaySummary | null> {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  const entry = await this.findOne({
    userId,
    date: {
      $gte: startOfDay,
      $lt: endOfDay,
    },
  });

  if (!entry) {
    return null;
  }

  // Calculate totals for each meal
  const calculateMealSummary = (foods: IFoodItem[]): IMealSummary => ({
    totalCalories: foods.reduce((sum, food) => sum + food.calories, 0),
    foods,
  });

  return {
    date: entry.date,
    breakfast: calculateMealSummary(entry.breakfast),
    lunch: calculateMealSummary(entry.lunch),
    dinner: calculateMealSummary(entry.dinner),
    totalCalories: entry.totalCalories,
  };
};

// Method to get food diary for a date range
DiaryEntrySchema.statics.getUserFoodRange = async function (
  userId: string,
  startDate: Date,
  endDate: Date
) {
  const entries = await this.find({
    userId,
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  }).sort({ date: 1 });

  return entries;
};

// Modify the model creation line to use the interface
const DiaryEntry =
  (mongoose.models.DiaryEntry as DiaryEntryModel) ||
  mongoose.model<IDiaryEntry, DiaryEntryModel>("DiaryEntry", DiaryEntrySchema);

export default DiaryEntry;
