const express = require("express");

const {
  register,
  login,
} = require("../controllers/authController");

const router = express.Router();

// Allow registration only in development
if (process.env.NODE_ENV !== "production") {
  router.post("/register", register);
}

// Login is always available
router.post("/login", login);

module.exports = router;