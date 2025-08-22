import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import Navbar from "./components/layout/Navbar";
import ProtectedRoute from "./components/common/ProtectedRoute";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import "./index.css";
import { HabitProvider } from "./context/HabitContext.jsx";

// Component to handle redirects for authenticated users
const AuthRedirect = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />

            {/* Auth Routes (redirect to dashboard if already logged in) */}
            <Route
              path="/login"
              element={
                <AuthRedirect>
                  <LoginForm />
                </AuthRedirect>
              }
            />
            <Route
              path="/register"
              element={
                <AuthRedirect>
                  <RegisterForm />
                </AuthRedirect>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <HabitProvider>
                    <DashboardPage />
                  </HabitProvider>
                </ProtectedRoute>
              }
            />

            {/* Placeholder routes for future features */}
            <Route
              path="/habits"
              element={
                <ProtectedRoute>
                  <div className="container mx-auto px-4 py-8">
                    <div className="card max-w-md mx-auto text-center">
                      <h2 className="text-2xl font-bold mb-4">Habits Page</h2>
                      <p className="text-gray-600">Coming soon in Phase 4!</p>
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />

            {/* Catch all route - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
