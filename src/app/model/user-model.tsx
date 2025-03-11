import mongoose, { Document } from "mongoose";

// Interface for user preferences
interface UserPreferences {
  workoutType: string;
  dietPreference: string;
}

// Main user interface that extends MongoDB Document
interface User extends Document {
  // Firebase Auth fields
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;

  // Custom fitness fields
  goal: string;
  age: string;
  gender: string;
  weight: string;
  height: string;
  preferences: UserPreferences;
  onboarding: boolean;
  healthIssues: string;
  nationality: string;
  calorieGoal: number;
  exercise: number;
  notify: string;
  streaks: number;
  lastStreak: Date | null;
}

// Schema for MongoDB
const userSchema = new mongoose.Schema(
  {
    _id: { type: String },
    uid: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    displayName: { type: String },
    photoURL: { type: String },

    goal: {
      type: String,
      enum: ["weight-loss", "muscle-gain", "maintenance"],
    },
    age: { type: String },
    weight: { type: String },
    gender: { type: String },
    height: { type: String },
    preferences: {
      workoutType: {
        type: String,
      },
      dietPreference: {
        type: String,
      },
    },
    healthIssues: {
      type: String,
    },
    nationality: {
      type: String,
    },
    onboarding: {
      type: Boolean,
      default: false,
    },
    calorieGoal: {
      type: Number,
      default: function (this: any) {
        switch (this.goal) {
          case "weight-loss":
            return 1500;
          case "muscle-gain":
            return 2000;
          case "maintenance":
            return 1700;
          default:
            return 1700;
        }
      },
    },
    exercise: {
      type: Number,
      default: 0,
    },
    notify: {
      type: String,
    },
    streaks: { 
      type: Number, 
      default: 0 
    },
    lastStreak: { 
      type: Date, 
      default: null 
    }
  },
  {
    timestamps: true,
  }
);

// Add middleware to update calorieGoal when goal changes
userSchema.pre("save", function (next) {
  if (this.isModified("goal")) {
    switch (this.goal) {
      case "weight-loss":
        this.calorieGoal = 1500;
        break;
      case "muscle-gain":
        this.calorieGoal = 2000;
        break;
      case "maintenance":
        this.calorieGoal = 1700;
        break;
    }
  }
  if (this.uid && !this._id) {
    this._id = this.uid;
  }
  next();
});

userSchema.set("toJSON", {
  virtuals: true,
  transform: (_, converted) => {
    delete converted._id;
    return converted;
  },
});

const User = mongoose.models.User || mongoose.model<User>("User", userSchema);

export default User;
