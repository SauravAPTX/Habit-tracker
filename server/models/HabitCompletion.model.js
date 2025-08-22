import mongoose from "mongoose";

const habitCompletionSchema = new mongoose.Schema({
  habit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Habit",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  completed: {
    type: Boolean,
    default: true,
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [200, "Notes cannot exceed 200 characters"],
  },
  completedAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to ensure one completion per habit per day
habitCompletionSchema.index({ habit: 1, date: 1 }, { unique: true });
habitCompletionSchema.index({ user: 1, date: 1 });
habitCompletionSchema.index({ habit: 1, user: 1, date: -1 });

// Static method to get today's date string
habitCompletionSchema.statics.getTodayDateString = function () {
  const today = new Date();
  return today.toISOString().split("T")[0]; // Returns YYYY-MM-DD
};

// Static method to check if habit is completed for a specific date
habitCompletionSchema.statics.isCompletedOnDate = async function (
  habitId,
  date
) {
  const completion = await this.findOne({
    habit: habitId,
    date: new Date(date),
    completed: true,
  });
  return !!completion;
};

export default mongoose.model("HabitCompletion", habitCompletionSchema);
