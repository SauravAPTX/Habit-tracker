import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useHabits } from "../context/HabitContext.jsx";
import HabitCard from "../components/common/HabitCard.jsx";
import HabitForm from "../components/common/HabitForm.jsx";

const DashboardPage = () => {
  const { user } = useAuth();
  const { habits, isLoading, fetchHabits, deleteHabit, getHabitStats } =
    useHabits();
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Fetch habits when component mounts
  useEffect(() => {
    fetchHabits();
  }, []);

  const stats = getHabitStats();

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

  const todaysHabits = habits.filter((habit) => habit.frequency === "daily");

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
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-gray-600">
            {stats.totalHabits > 0
              ? `You've completed ${stats.completedToday} of ${stats.totalHabits} habits today`
              : "Ready to start building some amazing habits?"}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <span className="text-primary-600 text-xl">✓</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Habits
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalHabits}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-success-100 rounded-lg">
                <span className="text-success-600 text-xl">🔥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Longest Streak
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.longestStreak} days
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-purple-600 text-xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Completion Rate
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.completionRate}%
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <span className="text-orange-600 text-xl">⏰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Completed Today
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.completedToday}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Today's Habits */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Today's Habits
                </h2>
                <button onClick={handleCreateHabit} className="btn-primary">
                  Add Habit
                </button>
              </div>

              {todaysHabits.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No habits yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Start building better habits by adding your first one!
                  </p>
                  <button onClick={handleCreateHabit} className="btn-outline">
                    Create your first habit
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {todaysHabits.map((habit) => (
                    <HabitCard
                      key={habit._id}
                      habit={habit}
                      onEdit={handleEditHabit}
                      onDelete={handleDeleteHabit}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button
                  onClick={handleCreateHabit}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                >
                  <span className="mr-3">➕</span>
                  Add New Habit
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                  <span className="mr-3">📊</span>
                  View Analytics
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                  <span className="mr-3">🏆</span>
                  Leaderboard
                </button>
              </div>
            </div>

            {/* Subscription Status */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Subscription
              </h3>
              <div className="flex items-center mb-3">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user?.subscriptionTier === "premium"
                      ? "bg-primary-100 text-primary-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {user?.subscriptionTier === "premium"
                    ? "👑 Premium"
                    : "🆓 Free"}
                </span>
              </div>
              {user?.subscriptionTier === "free" ? (
                <>
                  <p className="text-sm text-gray-600 mb-4">
                    You have {5 - stats.totalHabits} habit slots remaining.
                    Upgrade to premium for unlimited habits and advanced
                    features.
                  </p>
                  <button className="btn-outline w-full">
                    Upgrade to Premium
                  </button>
                </>
              ) : (
                <p className="text-sm text-gray-600">
                  You have unlimited habits and premium features. Thank you for
                  your support! 🎉
                </p>
              )}
            </div>

            {/* Recent Activity */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Today's Progress
              </h3>
              {stats.totalHabits > 0 ? (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Completed</span>
                    <span className="font-medium">
                      {stats.completedToday}/{stats.totalHabits}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-success-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${stats.completionRate}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600">
                    {stats.completionRate === 100
                      ? "Perfect day! All habits completed! 🎉"
                      : `${
                          100 - stats.completionRate
                        }% to go for a perfect day!`}
                  </p>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-600 text-sm">
                    Create your first habit to start tracking progress!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
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
              action cannot be undone.
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
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
