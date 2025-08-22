import express from "express";
import {
  getHabits,
  getHabit,
  createHabit,
  updateHabit,
  deleteHabit,
  toggleHabitCompletion,
  getHabitAnalytics,
} from "../controllers/habit.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Habit CRUD routes
router
  .route("/")
  .get(getHabits) // GET /api/habits
  .post(createHabit); // POST /api/habits

router
  .route("/:id")
  .get(getHabit) // GET /api/habits/:id
  .put(updateHabit) // PUT /api/habits/:id
  .delete(deleteHabit); // DELETE /api/habits/:id

// Habit completion routes
router.post("/:id/complete", toggleHabitCompletion); // POST /api/habits/:id/complete

// Analytics routes
router.get("/:id/analytics", getHabitAnalytics); // GET /api/habits/:id/analytics

export default router;
