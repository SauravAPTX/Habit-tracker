import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useHabits } from "../context/HabitContext.jsx";
import { Line, Bar } from "react-chartjs-2";
import {
  format,
  subDays,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
} from "date-fns";

const HabitDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { habits, fetchHabits, toggleCompletion } = useHabits();
  const [habit, setHabit] = useState(null);
  const [timeRange, setTimeRange] = useState("30");
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchHabits();
  }, []);

  useEffect(() => {
    if (habits.length > 0) {
      const foundHabit = habits.find((h) => h._id === id);
      if (foundHabit) {
        setHabit(foundHabit);
      } else {
        navigate("/habits");
      }
    }
  }, [habits, id, navigate]);

  if (!habit) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 text-primary-600 mx-auto mb-4 border-4 border-primary-600 border-t-transparent rounded-full"></div>
          <p className="text-gray-600">Loading habit details...</p>
        </div>
      </div>
    );
  }

  // Generate mock completion data for visualization
  const generateCompletionData = () => {
    const days = parseInt(timeRange);
    const dates = eachDayOfInterval({
      start: subDays(new Date(), days - 1),
      end: new Date(),
    });

    const labels = dates.map((date) => format(date, "MMM dd"));
    const completionData = dates.map((date, index) => {
      // Mock data - simulate habit completion pattern
      const baseRate = 70 + Math.sin(index * 0.3) * 20;
      const randomFactor = Math.random() > 0.3 ? 1 : 0; // 70% completion rate
      return randomFactor;
    });

    return {
      labels,
      datasets: [
        {
          label: "Completed",
          data: completionData,
          borderColor: habit.color || "rgb(59, 130, 246)",
          backgroundColor: `${habit.color || "rgb(59, 130, 246)"}20`,
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
      ],
    };
  };

  // Generate streak data
  const generateStreakData = () => {
    const weeks = 12; // Last 12 weeks
    const labels = [];
    const streakData = [];

    for (let i = weeks - 1; i >= 0; i--) {
      const weekStart = startOfWeek(subDays(new Date(), i * 7));
      labels.push(format(weekStart, "MMM dd"));
      // Mock streak data
      streakData.push(Math.floor(Math.random() * 7) + 1);
    }

    return {
      labels,
      datasets: [
        {
          label: "Days Completed per Week",
          data: streakData,
          backgroundColor: habit.color || "rgb(59, 130, 246)",
          borderColor: habit.color || "rgb(59, 130, 246)",
          borderWidth: 1,
        },
      ],
    };
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

  const handleComplete = async () => {
    try {
      await toggleCompletion(habit._id, notes);
      setNotes("");
      setShowNotes(false);
      // Refresh habit data
      fetchHabits();
    } catch (error) {
      console.error("Error completing habit:", error);
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        ticks: {
          callback: function (value) {
            return value === 1 ? "Done" : "Not Done";
          },
        },
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 7,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate("/habits")}
            className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {getCategoryIcon(habit.category)} {habit.title}
            </h1>
            <p className="text-gray-600">{habit.description}</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {habit.currentStreak || 0}
            </div>
            <div className="text-sm text-gray-600">Current Streak</div>
          </div>

          <div className="card text-center">
            <div className="text-3xl font-bold text-success-600 mb-2">
              {habit.completionRate || 0}%
            </div>
            <div className="text-sm text-gray-600">Completion Rate</div>
          </div>

          <div className="card text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {Math.floor(Math.random() * 50) + 10}
            </div>
            <div className="text-sm text-gray-600">Total Completions</div>
          </div>

          <div className="card text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {Math.floor(Math.random() * 20) + 5}
            </div>
            <div className="text-sm text-gray-600">Best Streak</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Completion Trend */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Completion History
                </h3>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="input-field w-auto text-sm"
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                </select>
              </div>
              <div className="h-64">
                <Line data={generateCompletionData()} options={chartOptions} />
              </div>
            </div>

            {/* Weekly Progress */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Weekly Progress (Last 12 Weeks)
              </h3>
              <div className="h-64">
                <Bar data={generateStreakData()} options={barChartOptions} />
              </div>
            </div>

            {/* Calendar View */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Calendar View
              </h3>
              <div className="grid grid-cols-7 gap-2 text-center text-sm">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div key={day} className="font-medium text-gray-600 py-2">
                      {day}
                    </div>
                  )
                )}
                {Array.from({ length: 35 }, (_, i) => (
                  <div
                    key={i}
                    className={`aspect-square flex items-center justify-center text-xs rounded-lg ${
                      Math.random() > 0.3
                        ? "bg-success-100 text-success-700"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {(i % 31) + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>

              {!habit.completedToday ? (
                <div className="space-y-3">
                  <button
                    onClick={handleComplete}
                    className="w-full btn-primary py-3"
                  >
                    ✓ Mark as Complete
                  </button>

                  <button
                    onClick={() => setShowNotes(!showNotes)}
                    className="w-full btn-outline"
                  >
                    📝 Add Notes
                  </button>

                  {showNotes && (
                    <div className="space-y-2">
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add a note about today's completion..."
                        className="input-field resize-none"
                        rows="3"
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={handleComplete}
                          className="flex-1 btn-primary text-sm"
                        >
                          Complete with Notes
                        </button>
                        <button
                          onClick={() => setShowNotes(false)}
                          className="flex-1 btn-secondary text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="text-4xl mb-2">🎉</div>
                  <div className="font-medium text-success-600 mb-2">
                    Completed Today!
                  </div>
                  <button
                    onClick={handleComplete}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Undo completion
                  </button>
                </div>
              )}
            </div>

            {/* Habit Details */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">
                    {getCategoryIcon(habit.category)} {habit.category}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frequency:</span>
                  <span className="font-medium">{habit.frequency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium">
                    {format(new Date(habit.createdAt), "MMM dd, yyyy")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Color:</span>
                  <div
                    className="w-6 h-6 rounded-full border-2 border-gray-300"
                    style={{ backgroundColor: habit.color }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Achievements
              </h3>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                  <span className="text-2xl mr-3">🥉</span>
                  <div>
                    <div className="font-medium text-yellow-800">
                      First Steps
                    </div>
                    <div className="text-xs text-yellow-600">
                      Complete habit 3 times
                    </div>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-gray-100 rounded-lg opacity-60">
                  <span className="text-2xl mr-3">🥈</span>
                  <div>
                    <div className="font-medium text-gray-600">
                      Getting Stronger
                    </div>
                    <div className="text-xs text-gray-500">7-day streak</div>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-gray-100 rounded-lg opacity-60">
                  <span className="text-2xl mr-3">🥇</span>
                  <div>
                    <div className="font-medium text-gray-600">
                      Habit Master
                    </div>
                    <div className="text-xs text-gray-500">30-day streak</div>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-gray-100 rounded-lg opacity-60">
                  <span className="text-2xl mr-3">💎</span>
                  <div>
                    <div className="font-medium text-gray-600">Diamond</div>
                    <div className="text-xs text-gray-500">100 completions</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Motivational Stats */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Motivation
              </h3>
              <div className="space-y-3">
                <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary-600">
                    {Math.floor(Math.random() * 200) + 50}
                  </div>
                  <div className="text-sm text-gray-600">Minutes Invested</div>
                </div>

                <div className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-success-600">
                    {Math.floor(Math.random() * 50) + 10}
                  </div>
                  <div className="text-sm text-gray-600">Days Active</div>
                </div>

                <div className="p-3 bg-yellow-50 rounded-lg text-center">
                  <div className="text-sm font-medium text-yellow-800 mb-1">
                    🔥 Keep it up!
                  </div>
                  <div className="text-xs text-yellow-600">
                    You're {habit.currentStreak || 0} days into building this
                    habit
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitDetailPage;
