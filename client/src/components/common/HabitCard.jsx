import React, { useState } from "react";
import { useHabits } from "../../context/HabitContext.jsx";

const HabitCard = ({ habit, onEdit, onDelete }) => {
  const { toggleCompletion } = useHabits();
  const [isToggling, setIsToggling] = useState(false);

  const handleToggleCompletion = async () => {
    if (isToggling) return;

    setIsToggling(true);
    try {
      await toggleCompletion(habit._id);
    } catch (error) {
      console.error("Error toggling completion:", error);
    } finally {
      setIsToggling(false);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      health: "💪",
      productivity: "🎯",
      mindfulness: "🧘",
      learning: "📚",
      social: "👥",
      other: "⭐",
    };
    return icons[category] || "⭐";
  };

  const getCategoryColor = (category) => {
    const colors = {
      health: "bg-green-100 text-green-700",
      productivity: "bg-blue-100 text-blue-700",
      mindfulness: "bg-purple-100 text-purple-700",
      learning: "bg-yellow-100 text-yellow-700",
      social: "bg-pink-100 text-pink-700",
      other: "bg-gray-100 text-gray-700",
    };
    return colors[category] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="card p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3 flex-1">
          {/* Completion Button */}
          <button
            onClick={handleToggleCompletion}
            disabled={isToggling}
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
              habit.completedToday
                ? "bg-success-500 border-success-500 text-white"
                : "border-gray-300 hover:border-success-400 hover:bg-success-50"
            } ${
              isToggling ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            {habit.completedToday && (
              <span className="text-sm font-bold">✓</span>
            )}
          </button>

          {/* Habit Info */}
          <div className="flex-1">
            <h3
              className={`font-semibold text-gray-900 mb-1 ${
                habit.completedToday ? "line-through text-gray-500" : ""
              }`}
            >
              {habit.title}
            </h3>

            {habit.description && (
              <p className="text-sm text-gray-600 mb-2">{habit.description}</p>
            )}

            {/* Category Badge */}
            <div className="flex items-center space-x-2">
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                  habit.category
                )}`}
              >
                {getCategoryIcon(habit.category)} {habit.category}
              </span>
            </div>
          </div>
        </div>

        {/* Actions Menu */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onEdit(habit)}
            className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
            title="Edit habit"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={() => onDelete(habit)}
            className="p-1 text-gray-400 hover:text-danger-600 transition-colors"
            title="Delete habit"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-3">
        <div className="flex items-center space-x-3">
          <span className="flex items-center">
            🔥 {habit.currentStreak || 0} day streak
          </span>
          <span className="flex items-center">
            📊 {habit.completionRate || 0}% this month
          </span>
        </div>

        {habit.completedToday && (
          <span className="text-success-600 font-medium">✓ Done today</span>
        )}
      </div>
    </div>
  );
};

export default HabitCard;
