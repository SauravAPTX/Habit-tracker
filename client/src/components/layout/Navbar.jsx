import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">
              HabitTracker
            </span>
            <span className="text-lg font-bold text-gray-900 sm:hidden">
              HT
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-600 hover:text-primary-600 transition-colors px-2 py-1 text-sm sm:text-base"
                >
                  Dashboard
                </Link>
                <Link
                  to="/habits"
                  className="text-gray-600 hover:text-primary-600 transition-colors px-2 py-1 text-sm sm:text-base hidden sm:block"
                >
                  Habits
                </Link>
                <Link
                  to="/analytics"
                  className="text-gray-600 hover:text-primary-600 transition-colors px-2 py-1 text-sm sm:text-base hidden md:block"
                >
                  Analytics
                </Link>
                <Link
                  to="/leaderboard"
                  className="text-gray-600 hover:text-primary-600 transition-colors px-2 py-1 text-sm sm:text-base hidden lg:block"
                >
                  🏆
                </Link>

                {/* Premium Badge */}
                {user?.subscriptionTier === "free" && (
                  <Link
                    to="/premium"
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium hover:from-yellow-500 hover:to-orange-600 transition-all"
                  >
                    ⭐ Upgrade
                  </Link>
                )}

                {/* User Menu */}
                <div className="flex items-center space-x-2 sm:space-x-3 ml-2 pl-2 border-l border-gray-200">
                  {user?.subscriptionTier === "premium" && (
                    <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full font-medium">
                      👑 Pro
                    </span>
                  )}
                  <span className="text-xs sm:text-sm text-gray-600 hidden md:block">
                    Welcome, {user?.name?.split(" ")[0]}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-xs sm:text-sm text-gray-600 hover:text-danger-600 transition-colors px-2 py-1"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-primary-600 transition-colors px-3 py-1 text-sm sm:text-base"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm py-2 px-3 sm:py-2 sm:px-4"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
