import Habit from "../models/Habit.model.js";
import HabitCompletion from "../models/HabitCompletion.model.js";

// Helper function to calculate streak
const calculateStreak = async (habitId) => {
  const completions = await HabitCompletion.find({
    habit: habitId,
    completed: true,
  }).sort({ date: -1 });

  if (completions.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if completed today or yesterday (for streak continuation)
  let currentDate = new Date(today);

  for (const completion of completions) {
    const completionDate = new Date(completion.date);
    completionDate.setHours(0, 0, 0, 0);

    if (completionDate.getTime() === currentDate.getTime()) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (completionDate.getTime() < currentDate.getTime()) {
      break; // Gap in streak
    }
  }

  return streak;
};

// Helper function to calculate completion rate (last 30 days)
const calculateCompletionRate = async (habitId) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const totalDays = 30;
  const completedDays = await HabitCompletion.countDocuments({
    habit: habitId,
    completed: true,
    date: { $gte: thirtyDaysAgo },
  });

  return Math.round((completedDays / totalDays) * 100);
};

// Get all habits for user
export const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({
      user: req.user.id,
      isActive: true,
    }).sort({ createdAt: -1 });

    // Calculate stats for each habit
    const habitsWithStats = await Promise.all(
      habits.map(async (habit) => {
        const currentStreak = await calculateStreak(habit._id);
        const completionRate = await calculateCompletionRate(habit._id);

        // Check if completed today
        const today = new Date().toISOString().split("T")[0];
        const completedToday = await HabitCompletion.findOne({
          habit: habit._id,
          date: new Date(today),
          completed: true,
        });

        return {
          ...habit.toJSON(),
          currentStreak,
          completionRate,
          completedToday: !!completedToday,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: habitsWithStats,
    });
  } catch (error) {
    console.error("Get habits error:", error);
    res.status(400).json({
      success: false,
      message: "Could not fetch habits",
    });
  }
};

// Get single habit
export const getHabit = async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: "Habit not found",
      });
    }

    // Add stats
    const currentStreak = await calculateStreak(habit._id);
    const completionRate = await calculateCompletionRate(habit._id);

    res.status(200).json({
      success: true,
      data: {
        ...habit.toJSON(),
        currentStreak,
        completionRate,
      },
    });
  } catch (error) {
    console.error("Get habit error:", error);
    res.status(400).json({
      success: false,
      message: "Could not fetch habit",
    });
  }
};

// Create new habit
export const createHabit = async (req, res) => {
  try {
    const { title, description, category, color, frequency, targetDays } =
      req.body;

    // Check habit limit for free users
    if (req.user.subscriptionTier === "free") {
      const habitCount = await Habit.countDocuments({
        user: req.user.id,
        isActive: true,
      });

      if (habitCount >= 5) {
        return res.status(403).json({
          success: false,
          message:
            "Free plan limited to 5 habits. Upgrade to premium for unlimited habits.",
        });
      }
    }

    const habit = await Habit.create({
      title,
      description,
      category,
      color,
      frequency,
      targetDays,
      user: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: habit,
    });
  } catch (error) {
    console.error("Create habit error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Could not create habit",
    });
  }
};

// Update habit
export const updateHabit = async (req, res) => {
  try {
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: "Habit not found",
      });
    }

    res.status(200).json({
      success: true,
      data: habit,
    });
  } catch (error) {
    console.error("Update habit error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Could not update habit",
    });
  }
};

// Delete habit (soft delete)
export const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { isActive: false },
      { new: true }
    );

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: "Habit not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Habit deleted successfully",
    });
  } catch (error) {
    console.error("Delete habit error:", error);
    res.status(400).json({
      success: false,
      message: "Could not delete habit",
    });
  }
};

// Toggle habit completion for today
export const toggleHabitCompletion = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, notes } = req.body;

    // Use provided date or today
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    // Check if habit exists and belongs to user
    const habit = await Habit.findOne({
      _id: id,
      user: req.user.id,
      isActive: true,
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: "Habit not found",
      });
    }

    // Check if already completed for this date
    const existingCompletion = await HabitCompletion.findOne({
      habit: id,
      date: targetDate,
    });

    if (existingCompletion) {
      // Toggle completion status
      existingCompletion.completed = !existingCompletion.completed;
      existingCompletion.notes = notes || existingCompletion.notes;
      await existingCompletion.save();

      res.status(200).json({
        success: true,
        data: {
          completed: existingCompletion.completed,
          date: targetDate,
          notes: existingCompletion.notes,
        },
      });
    } else {
      // Create new completion
      const completion = await HabitCompletion.create({
        habit: id,
        user: req.user.id,
        date: targetDate,
        completed: true,
        notes,
      });

      res.status(201).json({
        success: true,
        data: {
          completed: true,
          date: targetDate,
          notes: completion.notes,
        },
      });
    }
  } catch (error) {
    console.error("Toggle completion error:", error);
    res.status(400).json({
      success: false,
      message: "Could not update habit completion",
    });
  }
};

// Get habit analytics
export const getHabitAnalytics = async (req, res) => {
  try {
    const { id } = req.params;
    const { days = 30 } = req.query;

    const habit = await Habit.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: "Habit not found",
      });
    }

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days));

    const completions = await HabitCompletion.find({
      habit: id,
      date: { $gte: daysAgo },
    }).sort({ date: 1 });

    const currentStreak = await calculateStreak(id);
    const completionRate = await calculateCompletionRate(id);

    res.status(200).json({
      success: true,
      data: {
        habit: habit.title,
        currentStreak,
        completionRate,
        completions: completions.map((c) => ({
          date: c.date,
          completed: c.completed,
          notes: c.notes,
        })),
      },
    });
  } catch (error) {
    console.error("Get analytics error:", error);
    res.status(400).json({
      success: false,
      message: "Could not fetch analytics",
    });
  }
};
