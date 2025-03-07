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
    onboarding: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Add this pre-save middleware
userSchema.pre("save", function (next) {
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
