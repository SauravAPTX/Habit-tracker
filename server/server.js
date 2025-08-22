import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Import routes
import authRoutes from "./routes/auth.js";
import habitRoutes from "./routes/habits.js";

// Load environment variables
dotenv.config();

const app = express();

// Middleware - functions that run before your API routes
app.use(cors()); // Allow frontend to call backend
app.use(express.json()); // Parse JSON data from requests

// Health check endpoints
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

app.get("/api/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStatusMap = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  const health = {
    status: dbStatus === 1 ? "healthy" : "unhealthy",
    timestamp: new Date().toISOString(),
    services: {
      database: {
        status: dbStatusMap[dbStatus],
        connected: dbStatus === 1,
      },
      server: {
        status: "running",
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.version,
      },
    },
    environment: process.env.NODE_ENV || "development",
  };

  const statusCode = health.status === "healthy" ? 200 : 503;
  res.status(statusCode).json(health);
});

// API metrics endpoint
app.get("/api/metrics", (req, res) => {
  const metrics = {
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    version: {
      node: process.version,
      app: process.env.npm_package_version || "1.0.0",
    },
    environment: process.env.NODE_ENV || "development",
  };

  res.json(metrics);
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/habits", habitRoutes);

// Basic test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working with ES6 modules!" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);

  const isDevelopment = process.env.NODE_ENV === "development";

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
    ...(isDevelopment && { stack: err.stack }),
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Database connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/habittracker")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  mongoose.connection.close(() => {
    console.log("MongoDB connection closed");
    process.exit(0);
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
