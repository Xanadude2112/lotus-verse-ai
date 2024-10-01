const express = require("express");
const bcrypt = require("bcrypt");
// const jwt = require('jsonwebtoken');
const router = express.Router();
const {
  createUser,
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

// login a user
// http://localhost:8080/users/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Please fill in all fields" });
  }
  try {
    const user = await getUserByEmail(email);

    if(!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    
    // thiis is bcrypt comparing the password from the request to the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid) {
      return res.status(401).json ({ message: "Invalid email or password" });
    }

    console.log(`USER LOGGED IN OK!! ✅ ${user}`);
    res.status(200).json({ message: "User logged in successfully" });
  } catch (err) {
    console.error(`Error in login route: ${err.message}`);
    res.status(500).json({ message: "Server error. Please try again." });
  }
})


// edit a user's information
// http://localhost:8080/users/:id/edit
router.put("/:id/edit", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: "Please fill in all fields" });
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const editedUser = await updateUser(req.params.id, username, email, hashedPassword);
    console.log(`USER EDITED OK!! ✅ ${editedUser}`);
    res.status(200).json(editedUser);
  } catch (err) {
    console.error(`Error in edit route: ${err.message}`);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

module.exports = router;