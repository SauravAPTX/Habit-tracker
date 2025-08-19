const express = require("express");
const { register, login, getMe } = require("../controllers/auth.controller.js");
const { protect } = require("../middlewares/auth.middleware.js");

const router = express.Router();

// Public routes (no authentication required)
router.post("/register", register);
router.post("/login", login);

// Protected routes (authentication required)
router.get("/me", protect, getMe);

module.exports = router;
