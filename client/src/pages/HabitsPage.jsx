import React, { useState, useEffect } from "react";
import { useHabits } from "../context/HabitContext.jsx";
import HabitCard from "../components/common/HabitCard.jsx";
import HabitForm from "../components/common/HabitForm.jsx";

const HabitsPage = () => {
  const { habits, isLoading, fetchHabits, deleteHabit } = useHabits();
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch habits when component mounts
  useEffect(() => {
    fetchHabits();
  }, []);

  const categories = [
    { value: "all", label: "All Habits", icon: "📋" },
    { value: "health", label: "Health", icon: "💪" },
    { value: "productivity", label: "Productivity", icon: "🎯" },
    { value: "mindfulness", label: "Mindfulness", icon: "🧘" },
    { value: "learning", label: "Learning", icon: "📚" },
    { value: "social", label: "Social", icon: "👥" },
    { value: "other", label: "Other", icon: "⭐" },
  ];

  // Filter and search habits
  const filteredHabits = habits.filter((habit) => {
    const matchesCategory =
      filterCategory === "all" || habit.category === filterCategory;
    const matchesSearch =
      habit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      habit.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreateHabit = () => {
    setEditingHabit(null);
    setShowHabitForm(true);
  };

  const handleEditHabit = (habit) => {
    setEditingHabit(habit);
    setShowHabitForm(true);
  };

  const handleDeleteHabit = (habit) => {
    setShowDeleteConfirm(habit);
  };

  const confirmDelete = async () => {
    if (showDeleteConfirm) {
      await deleteHabit(showDeleteConfirm._id);
      setShowDeleteConfirm(null);
    }
  };

  const handleFormSuccess = () => {
    fetchHabits(); // Refresh habits list
  };

  if (isLoading && habits.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg
            className="animate-spin h-12 w-12 text-primary-600 mx-auto mb-4"
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
          <p className="text-gray-600">Loading your habits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Habits</h1>
            <p className="text-gray-600">Manage all your habits in one place</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button onClick={handleCreateHabit} className="btn-primary">
              ➕ Add New Habit
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="flex-1 lg:max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Habits
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Category Filter */}
            <div className="lg:ml-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="input-field lg:w-48"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.icon} {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Habits Grid */}
        {filteredHabits.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">
                {habits.length === 0 ? "🎯" : "🔍"}
              </span>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {habits.length === 0 ? "No habits yet" : "No habits found"}
            </h3>
            <p className="text-gray-600 mb-4">
              {habits.length === 0
                ? "Start building better habits by creating your first one!"
                : searchTerm || filterCategory !== "all"
                ? "Try adjusting your search or filter criteria."
                : "You don't have any habits in this category yet."}
            </p>
            {habits.length === 0 && (
              <button onClick={handleCreateHabit} className="btn-primary">
                Create Your First Habit
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-600">
                Showing {filteredHabits.length} of {habits.length} habits
                {filterCategory !== "all" && (
                  <span className="ml-1">
                    in{" "}
                    {categories.find((c) => c.value === filterCategory)?.label}
                  </span>
                )}
              </p>

              {(searchTerm || filterCategory !== "all") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterCategory("all");
                  }}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* Habits List */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredHabits.map((habit) => (
                <HabitCard
                  key={habit._id}
                  habit={habit}
                  onEdit={handleEditHabit}
                  onDelete={handleDeleteHabit}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Habit Form Modal */}
      {showHabitForm && (
        <HabitForm
          habit={editingHabit}
          onClose={() => setShowHabitForm(false)}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Delete Habit
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{showDeleteConfirm.title}"? This
              action cannot be undone and will remove all completion history.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-danger-500 hover:bg-danger-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
              >
                Delete Habit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitsPage;
