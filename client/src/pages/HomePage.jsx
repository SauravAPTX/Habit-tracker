import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Build{" "}
            <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              Better Habits
            </span>
            <br />
            Every Day
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Track your daily habits, visualize your progress, and stay motivated
            with our beautiful and simple habit tracking app.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="btn-primary text-lg px-8 py-4 inline-block"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="btn-primary text-lg px-8 py-4 inline-block"
                >
                  Start Building Habits
                </Link>
                <Link
                  to="/login"
                  className="btn-outline text-lg px-8 py-4 inline-block"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Feature Preview */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="card text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">✓</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Simple Tracking
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Mark habits as complete with just one click. No complicated
                setup required.
              </p>
            </div>

            <div className="card text-center p-6">
              <div className="w-16 h-16 bg-success-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-success-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">📊</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Visual Progress
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                See your streaks and progress with beautiful charts and
                analytics.
              </p>
            </div>

            <div className="card text-center p-6 sm:col-span-2 lg:col-span-1">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">🎯</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Stay Motivated
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Compete with friends and climb the leaderboard to stay
                motivated.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="bg-white py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Built with Modern Technology
            </h2>
            <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
              A full-stack application showcasing best practices in web
              development
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 max-w-3xl mx-auto">
            {[
              { name: "React + Vite", color: "bg-blue-100 text-blue-700" },
              {
                name: "Node.js + Express",
                color: "bg-green-100 text-green-700",
              },
              {
                name: "MongoDB Atlas",
                color: "bg-emerald-100 text-emerald-700",
              },
              {
                name: "Tailwind CSS v4",
                color: "bg-indigo-100 text-indigo-700",
              },
              {
                name: "JWT Authentication",
                color: "bg-purple-100 text-purple-700",
              },
              { name: "Docker + AWS", color: "bg-orange-100 text-orange-700" },
            ].map((tech, index) => (
              <span
                key={index}
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium ${tech.color}`}
              >
                {tech.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-400">
            Built with ❤️ as a learning project • MERN Stack + Modern DevOps
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
