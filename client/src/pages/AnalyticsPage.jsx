import React, { useState, useEffect } from "react";
import { useHabits } from "../context/HabitContext.jsx";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { format, subDays, eachDayOfInterval } from "date-fns";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AnalyticsPage = () => {
  const { habits, fetchHabits } = useHabits();
  const [timeRange, setTimeRange] = useState("30"); // 7, 30, 90 days
  const [selectedHabit, setSelectedHabit] = useState("all");

  useEffect(() => {
    fetchHabits();
  }, []);

  // Generate date range for charts
  const generateDateRange = (days) => {
    const end = new Date();
    const start = subDays(end, days - 1);
    return eachDayOfInterval({ start, end });
  };

  // Calculate completion data for line chart
  const getCompletionTrendData = () => {
    const dates = generateDateRange(parseInt(timeRange));
    const labels = dates.map((date) => format(date, "MMM dd"));

    // Mock data - in real app, this would come from your completion history
    const completionData = dates.map((date, index) => {
      // Simulate some completion pattern
      const baseRate = 60 + Math.sin(index * 0.2) * 20;
      const randomVariation = (Math.random() - 0.5) * 30;
      return Math.max(0, Math.min(100, baseRate + randomVariation));
    });

    return {
      labels,
      datasets: [
        {
          label: "Completion Rate (%)",
          data: completionData,
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
      ],
    };
  };

  // Calculate habit category distribution
  const getCategoryData = () => {
    const categories = {};
    habits.forEach((habit) => {
      categories[habit.category] = (categories[habit.category] || 0) + 1;
    });

    const colors = {
      health: "#10b981",
      productivity: "#3b82f6",
      mindfulness: "#8b5cf6",
      learning: "#f59e0b",
      social: "#ec4899",
      other: "#6b7280",
    };

    return {
      labels: Object.keys(categories),
      datasets: [
        {
          data: Object.values(categories),
          backgroundColor: Object.keys(categories).map(
            (cat) => colors[cat] || "#6b7280"
          ),
          borderWidth: 0,
        },
      ],
    };
  };

  // Calculate weekly completion pattern
  const getWeeklyPatternData = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    // Mock data - simulate weekly patterns
    const weeklyData = [85, 78, 82, 75, 70, 45, 60];

    return {
      labels: days,
      datasets: [
        {
          label: "Average Completion Rate (%)",
          data: weeklyData,
          backgroundColor: "rgba(34, 197, 94, 0.8)",
          borderColor: "rgb(34, 197, 94)",
          borderWidth: 1,
        },
      ],
    };
  };

  // Calculate streak distribution
  const getStreakData = () => {
    const streaks = habits.map((h) => h.currentStreak || 0);
    const maxStreak = Math.max(...streaks, 10);
    const ranges = ["1-7", "8-14", "15-30", "30+"];
    const distribution = [0, 0, 0, 0];

    streaks.forEach((streak) => {
      if (streak <= 7) distribution[0]++;
      else if (streak <= 14) distribution[1]++;
      else if (streak <= 30) distribution[2]++;
      else distribution[3]++;
    });

    return {
      labels: ranges,
      datasets: [
        {
          label: "Number of Habits",
          data: distribution,
          backgroundColor: [
            "rgba(239, 68, 68, 0.8)",
            "rgba(245, 158, 11, 0.8)",
            "rgba(59, 130, 246, 0.8)",
            "rgba(34, 197, 94, 0.8)",
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
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
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600">
              Insights into your habit building journey
            </p>
          </div>

          {/* Controls */}
          <div className="mt-4 sm:mt-0 flex space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="input-field w-auto"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>

            <select
              value={selectedHabit}
              onChange={(e) => setSelectedHabit(e.target.value)}
              className="input-field w-auto"
            >
              <option value="all">All Habits</option>
              {habits.map((habit) => (
                <option key={habit._id} value={habit._id}>
                  {habit.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {habits.length}
            </div>
            <div className="text-sm text-gray-600">Total Habits</div>
          </div>

          <div className="card text-center">
            <div className="text-3xl font-bold text-success-600 mb-2">
              {Math.max(...habits.map((h) => h.currentStreak || 0), 0)}
            </div>
            <div className="text-sm text-gray-600">Longest Streak</div>
          </div>

          <div className="card text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {habits.filter((h) => h.completedToday).length}
            </div>
            <div className="text-sm text-gray-600">Completed Today</div>
          </div>

          <div className="card text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {habits.length > 0
                ? Math.round(
                    (habits.filter((h) => h.completedToday).length /
                      habits.length) *
                      100
                  )
                : 0}
              %
            </div>
            <div className="text-sm text-gray-600">Today's Rate</div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Completion Trend */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Completion Trend
            </h3>
            <div className="h-64">
              <Line data={getCompletionTrendData()} options={chartOptions} />
            </div>
          </div>

          {/* Weekly Pattern */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Weekly Pattern
            </h3>
            <div className="h-64">
              <Bar data={getWeeklyPatternData()} options={barChartOptions} />
            </div>
          </div>

          {/* Category Distribution */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Habits by Category
            </h3>
            <div className="h-64">
              {habits.length > 0 ? (
                <Doughnut data={getCategoryData()} options={doughnutOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No habits to display
                </div>
              )}
            </div>
          </div>

          {/* Streak Distribution */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Streak Distribution (Days)
            </h3>
            <div className="h-64">
              <Bar data={getStreakData()} options={barChartOptions} />
            </div>
          </div>
        </div>

        {/* Detailed Insights */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Best Performing Habits */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              🏆 Top Performers
            </h3>
            <div className="space-y-3">
              {habits
                .sort((a, b) => (b.currentStreak || 0) - (a.currentStreak || 0))
                .slice(0, 5)
                .map((habit) => (
                  <div
                    key={habit._id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm">{habit.title}</div>
                      <div className="text-xs text-gray-500">
                        {habit.category}
                      </div>
                    </div>
                    <div className="text-sm font-bold text-primary-600">
                      {habit.currentStreak || 0} days
                    </div>
                  </div>
                ))}
              {habits.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  No habits to analyze yet
                </div>
              )}
            </div>
          </div>

          {/* Insights */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              💡 Insights
            </h3>
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="font-medium text-blue-800 text-sm">
                  Most Active Day
                </div>
                <div className="text-blue-600 text-xs">
                  Tuesdays show highest completion rates
                </div>
              </div>

              <div className="p-3 bg-green-50 rounded-lg">
                <div className="font-medium text-green-800 text-sm">
                  Improvement Trend
                </div>
                <div className="text-green-600 text-xs">
                  +15% completion rate this month
                </div>
              </div>

              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="font-medium text-purple-800 text-sm">
                  Category Focus
                </div>
                <div className="text-purple-600 text-xs">
                  Health habits perform best
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              🎯 Recommendations
            </h3>
            <div className="space-y-4">
              <div className="p-3 border-l-4 border-yellow-400 bg-yellow-50">
                <div className="font-medium text-yellow-800 text-sm">
                  Weekend Focus
                </div>
                <div className="text-yellow-700 text-xs">
                  Consider easier habits for weekends
                </div>
              </div>

              <div className="p-3 border-l-4 border-blue-400 bg-blue-50">
                <div className="font-medium text-blue-800 text-sm">
                  Habit Stacking
                </div>
                <div className="text-blue-700 text-xs">
                  Link new habits to existing ones
                </div>
              </div>

              <div className="p-3 border-l-4 border-green-400 bg-green-50">
                <div className="font-medium text-green-800 text-sm">
                  Consistency Boost
                </div>
                <div className="text-green-700 text-xs">
                  Set reminders for 2 PM daily
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
