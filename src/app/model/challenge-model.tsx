import mongoose, { Schema, type Document } from "mongoose"

export interface Challenge extends Document {
  _id: string
  userId: string
  title: string
  description: string
  type: "streak" | "one-time"
  category: "nutrition" | "exercise" | "water" | "sleep"
  targetValue: number
  currentValue: number
  startDate: Date
  endDate?: Date
  completed: boolean
  completedDate?: Date
  reward?: string
  icon?: string
}

const ChallengeSchema = new Schema<Challenge>(
  {
    _id: { type: String, required: true },
    userId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ["streak", "one-time"], required: true },
    category: { type: String, enum: ["nutrition", "exercise", "water", "sleep"], required: true },
    targetValue: { type: Number, required: true },
    currentValue: { type: Number, default: 0 },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    completed: { type: Boolean, default: false },
    completedDate: { type: Date },
    reward: { type: String },
    icon: { type: String },
  },
  { timestamps: true },
)

export default mongoose.models.Challenge || mongoose.model<Challenge>("Challenge", ChallengeSchema)

