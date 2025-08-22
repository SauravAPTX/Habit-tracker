import mongoose from "mongoose";

const habitSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Habit title is required"],
    trim: true,
    maxlength: [100, "Habit title cannot exceed 100 characters"],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, "Description cannot exceed 500 characters"],
  },
  category: {
    type: String,
    enum: [
      "health",
      "productivity",
      "mindfulness",
      "learning",
      "social",
      "other",
    ],
    default: "other",
  },
  color: {
    type: String,
    default: "#3b82f6", // Default blue color
    match: [
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      "Please enter a valid hex color",
    ],
  },
  frequency: {
    type: String,
    enum: ["daily", "weekly"],
    default: "daily",
  },
  targetDays: {
    type: [String], // For weekly habits: ['monday', 'wednesday', 'friday']
    default: [],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for better query performance
habitSchema.index({ user: 1, isActive: 1 });
habitSchema.index({ user: 1, category: 1 });

// Virtual for current streak (will be calculated)
habitSchema.virtual("currentStreak").get(function () {
  return this._currentStreak || 0;
});

// Virtual for completion rate (will be calculated)
habitSchema.virtual("completionRate").get(function () {
  return this._completionRate || 0;
});

// Ensure virtual fields are serialized
habitSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Habit", habitSchema);
