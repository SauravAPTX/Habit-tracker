const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const auth = require("./routes/auth.route.js");

const app = express();

// Middleware - functions that run before your API routes
app.use(cors()); // Allow frontend to call backend
app.use(express.json()); // Parse JSON data from requests

// Routes
app.use("/api/auth", auth);

// Basic test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

// Database connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/habittracker")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
