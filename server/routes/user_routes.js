const express = require("express");
const bcrypt = require("bcrypt");
// const jwt = require('jsonwebtoken');
const router = express.Router();
const {
  createUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
  getUserByUsername,
  updateUser,
  deleteUser,
} = require("../db/queries/00_users_queries");

// create (register) a new user
// http://localhost:8080/users/register
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: "Please fill in all fields" });
  }
  try {
    const userExists = await getUserByUsername(username);
    const emailExists = await getUserByEmail(email);

    if (userExists) {
      return res.status(400).json({ message: "Username already exists" });
    }
    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await createUser({ username, email, hashedPassword });
    console.log(`USER REGISTERED OK!! ✅ ${newUser}`);
    res.status(201).json(newUser);
  } catch (err) {
    if (err.message === 'Username or email already exists') {
      return res.status(400).json({ message: err.message });
    }
    console.error(`Error in register route: ${err.message}`);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});





module.exports = router;