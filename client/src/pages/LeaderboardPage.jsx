import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useHabits } from "../context/HabitContext.jsx";

const LeaderboardPage = () => {
  const { user } = useAuth();
  const { getHabitStats } = useHabits();
  const [timeFrame, setTimeFrame] = useState("week"); // week, month, allTime
  const [category, setCategory] = useState("all");

  // Mock leaderboard data - in a real app, this would come from your backend
  const generateLeaderboardData = () => {
    const mockUsers = [
      {
        id: 1,
        name: "Sarah Johnson",
        avatar: "👩‍💻",
        completionRate: 98,
        streakDays: 45,
        totalHabits: 8,
      },
      {
        id: 2,
        name: "Mike Chen",
        avatar: "👨‍🎓",
        completionRate: 95,
        streakDays: 38,
        totalHabits: 12,
      },
      {
        id: 3,
        name: "Alex Rivera",
        avatar: "👩‍🎨",
        completionRate: 92,
        streakDays: 31,
        totalHabits: 6,
      },
      {
        id: 4,
        name: "Jordan Smith",
        avatar: "👨‍⚕️",
        completionRate: 90,
        streakDays: 28,
        totalHabits: 10,
      },
      {
        id: 5,
        name: "Taylor Brown",
        avatar: "👩‍🔬",
        completionRate: 88,
        streakDays: 25,
        totalHabits: 7,
      },
      {
        id: 6,
        name: "Casey Wilson",
        avatar: "👨‍🍳",
        completionRate: 85,
        streakDays: 22,
        totalHabits: 9,
      },
      {
        id: 7,
        name: "Jamie Davis",
        avatar: "👩‍🏫",
        completionRate: 82,
        streakDays: 19,
        totalHabits: 5,
      },
      {
        id: 8,
        name: "Morgan Lee",
        avatar: "👨‍💼",
        completionRate: 80,
        streakDays: 16,
        totalHabits: 11,
      },
    ];

    // Add current user to the list
    const currentUserStats = getHabitStats();
    const currentUser = {
      id: "current",
      name: user?.name || "You",
      avatar: "🎯",
      completionRate: currentUserStats.completionRate,
      streakDays: currentUserStats.longestStreak,
      totalHabits: currentUserStats.totalHabits,
      isCurrentUser: true,
    };

    return [...mockUsers, currentUser].sort((a, b) => {
      if (timeFrame === "week" || timeFrame === "month") {
        return b.completionRate - a.completionRate;
      }
      return b.streakDays - a.streakDays;
    });
  };

  const leaderboardData = generateLeaderboardData();
  const currentUserRank =
    leaderboardData.findIndex((user) => user.isCurrentUser) + 1;

  const getRankIcon = (position) => {
    switch (position) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return "🏅";
    }
  };

  const getTimeFrameLabel = () => {
    switch (timeFrame) {
      case "week":
        return "This Week";
      case "month":
        return "This Month";
      case "allTime":
        return "All Time";
      default:
        return "This Week";
    }
  };

  const getMetricLabel = () => {
    switch (timeFrame) {
      case "week":
      case "month":
        return "Completion Rate";
      case "allTime":
        return "Longest Streak";
      default:
        return "Completion Rate";
    }
  };

  const getMetricValue = (user) => {
    switch (timeFrame) {
      case "week":
      case "month":
        return `${user.completionRate}%`;
      case "allTime":
        return `${user.streakDays} days`;
      default:
        return `${user.completionRate}%`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🏆 Leaderboard
          </h1>
          <p className="text-gray-600">
            See how you rank against other habit builders
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4 mb-8">
          <div className="flex rounded-lg bg-white shadow-sm border">
            {["week", "month", "allTime"].map((period) => (
              <button
                key={period}
                onClick={() => setTimeFrame(period)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  timeFrame === period
                    ? "bg-primary-500 text-white"
                    : "text-gray-600 hover:text-gray-900"
                } ${period === "week" ? "rounded-l-lg" : ""} ${
                  period === "allTime" ? "rounded-r-lg" : ""
                }`}
              >
                {period === "week"
                  ? "This Week"
                  : period === "month"
                  ? "This Month"
                  : "All Time"}
              </button>
            ))}
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field w-auto"
          >
            <option value="all">All Categories</option>
            <option value="health">Health</option>
            <option value="productivity">Productivity</option>
            <option value="mindfulness">Mindfulness</option>
            <option value="learning">Learning</option>
            <option value="social">Social</option>
          </select>
        </div>

        {/* Your Rank Card */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="card bg-gradient-to-r from-primary-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">🎯</div>
                <div>
                  <div className="text-lg font-semibold">Your Rank</div>
                  <div className="text-primary-100">
                    {getTimeFrameLabel()} •{" "}
                    {category === "all" ? "All Categories" : category}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">#{currentUserRank}</div>
                <div className="text-primary-100">
                  out of {leaderboardData.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="max-w-4xl mx-auto">
          <div className="card p-0">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {getTimeFrameLabel()} Rankings
              </h3>
              <p className="text-sm text-gray-600">
                Ranked by {getMetricLabel().toLowerCase()}
              </p>
            </div>

            <div className="divide-y divide-gray-200">
              {leaderboardData.map((user, index) => (
                <div
                  key={user.id}
                  className={`p-6 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                    user.isCurrentUser
                      ? "bg-primary-50 border-l-4 border-primary-500"
                      : ""
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    {/* Rank */}
                    <div className="flex-shrink-0 w-12 text-center">
                      <div className="text-2xl">{getRankIcon(index + 1)}</div>
                      <div className="text-sm font-bold text-gray-900">
                        #{index + 1}
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{user.avatar}</div>
                      <div>
                        <div
                          className={`font-semibold ${
                            user.isCurrentUser
                              ? "text-primary-700"
                              : "text-gray-900"
                          }`}
                        >
                          {user.name}
                          {user.isCurrentUser && (
                            <span className="ml-2 text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          {user.totalHabits} habits • {user.streakDays} day best
                          streak
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">
                      {getMetricValue(user)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {getMetricLabel()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Achievement Badges */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              🏅 Achievement Badges
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-3xl mb-2">🥇</div>
                <div className="font-medium text-yellow-800">Top Performer</div>
                <div className="text-xs text-yellow-600">
                  {currentUserRank <= 3 ? "Achieved!" : "Reach top 3"}
                </div>
              </div>

              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl mb-2">💯</div>
                <div className="font-medium text-blue-800">Perfect Week</div>
                <div className="text-xs text-blue-600">
                  {getHabitStats().completionRate === 100
                    ? "Achieved!"
                    : "100% completion rate"}
                </div>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl mb-2">🔥</div>
                <div className="font-medium text-purple-800">Streak Master</div>
                <div className="text-xs text-purple-600">
                  {getHabitStats().longestStreak >= 30
                    ? "Achieved!"
                    : "30+ day streak"}
                </div>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl mb-2">🌟</div>
                <div className="font-medium text-green-800">
                  Consistency King
                </div>
                <div className="text-xs text-green-600">
                  {getHabitStats().totalHabits >= 10
                    ? "Achieved!"
                    : "10+ active habits"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Features */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Friends Activity */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                👥 Friends Activity
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl">👩‍💻</div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">
                      Sarah completed "Morning Jog"
                    </div>
                    <div className="text-xs text-gray-500">2 hours ago</div>
                  </div>
                  <div className="text-xs text-success-600">+5 day streak</div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl">👨‍🎓</div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">
                      Mike reached 30-day streak!
                    </div>
                    <div className="text-xs text-gray-500">5 hours ago</div>
                  </div>
                  <div className="text-xs text-yellow-600">🏅 Achievement</div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl">👩‍🎨</div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">
                      Alex added "Read 30 minutes"
                    </div>
                    <div className="text-xs text-gray-500">1 day ago</div>
                  </div>
                  <div className="text-xs text-blue-600">New habit</div>
                </div>
              </div>

              <button className="w-full mt-4 btn-outline text-sm">
                Invite Friends
              </button>
            </div>

            {/* Challenges */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🎯 Weekly Challenges
              </h3>
              <div className="space-y-4">
                <div className="p-4 border border-primary-200 rounded-lg bg-primary-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-primary-800">
                      Perfect Week
                    </div>
                    <div className="text-sm text-primary-600">2 days left</div>
                  </div>
                  <div className="text-sm text-primary-700 mb-3">
                    Complete all habits for 7 days straight
                  </div>
                  <div className="w-full bg-primary-200 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full transition-all"
                      style={{ width: "70%" }}
                    ></div>
                  </div>
                  <div className="text-xs text-primary-600 mt-1">
                    5/7 days completed
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-gray-800">Early Bird</div>
                    <div className="text-sm text-gray-600">6 days left</div>
                  </div>
                  <div className="text-sm text-gray-700 mb-3">
                    Complete morning habits before 8 AM
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gray-400 h-2 rounded-full transition-all"
                      style={{ width: "30%" }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    2/7 days completed
                  </div>
                </div>
              </div>

              <button className="w-full mt-4 btn-primary text-sm">
                Join New Challenge
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
