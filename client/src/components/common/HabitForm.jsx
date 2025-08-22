import React, { useState, useEffect } from "react";
import { useHabits } from "../../context/HabitContext.jsx";

const HabitForm = ({ habit, onClose, onSuccess }) => {
  const { createHabit, updateHabit, error, clearError } = useHabits();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "other",
    color: "#3b82f6",
    frequency: "daily",
  });

  const categories = [
    { value: "health", label: "Health", icon: "💪" },
    { value: "productivity", label: "Productivity", icon: "🎯" },
    { value: "mindfulness", label: "Mindfulness", icon: "🧘" },
    { value: "learning", label: "Learning", icon: "📚" },
    { value: "social", label: "Social", icon: "👥" },
    { value: "other", label: "Other", icon: "⭐" },
  ];

  const colors = [
    "#3b82f6",
    "#ef4444",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#84cc16",
  ];

  // Pre-fill form if editing
  useEffect(() => {
    if (habit) {
      setFormData({
        title: habit.title || "",
        description: habit.description || "",
        category: habit.category || "other",
        color: habit.color || "#3b82f6",
        frequency: habit.frequency || "daily",
      });
    }
  }, [habit]);

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (habit) {
        await updateHabit(habit._id, formData);
      } else {
        await createHabit(formData);
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      // Error is handled by context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {habit ? "Edit Habit" : "Create New Habit"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {error && (
            <div className="alert-error mb-4">
              <div className="flex">
                <svg
                  className="w-5 h-5 mr-2 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Habit Title *
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Drink 8 glasses of water"
                className="input-field"
                maxLength={100}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Optional: Add more details about your habit"
                className="input-field resize-none"
                rows={3}
                maxLength={500}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <label
                    key={cat.value}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.category === cat.value
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={cat.value}
                      checked={formData.category === cat.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className="mr-2">{cat.icon}</span>
                    <span className="text-sm font-medium">{cat.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color Theme
              </label>
              <div className="flex space-x-2">
                {colors.map((color) => (
                  <label
                    key={color}
                    className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
                      formData.color === color
                        ? "border-gray-400"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                  >
                    <input
                      type="radio"
                      name="color"
                      value={color}
                      checked={formData.color === color}
                      onChange={handleChange}
                      className="sr-only"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Frequency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frequency
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.frequency === "daily"
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="frequency"
                    value="daily"
                    checked={formData.frequency === "daily"}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium">📅 Daily</span>
                </label>
                <label
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.frequency === "weekly"
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="frequency"
                    value="weekly"
                    checked={formData.frequency === "weekly"}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium">📆 Weekly</span>
                </label>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formData.title.trim()}
                className="flex-1 btn-primary"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {habit ? "Updating..." : "Creating..."}
                  </div>
                ) : habit ? (
                  "Update Habit"
                ) : (
                  "Create Habit"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HabitForm;
