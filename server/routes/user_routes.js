const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const {
  createUser,
  getUserByEmail,
  getUserByUsername,
  updateUser,
  deleteUser,
} = require("../db/queries/00_users_queries");

// middleware to verify jwt
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// register a new user
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: "Please fill in all fields" });
  }
  try {
    const userExists = await getUserByUsername(username);
    const emailExists = await getUserByEmail(email);

    if (userExists) {
      return res.status(409).json({ message: "Username already exists" });
    }
    if (emailExists) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await createUser({ username, email, hashedPassword });
    console.log(`USER REGISTERED OK!! ✅ ${newUser.username} ${newUser.email} ${newUser.hashedPassword}`);

    // generate a jwt
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({ newUser, token });
  } catch (err) {
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
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log(`USER LOGGED IN OK!! ✅ ${user}`);

    // generate a jwt
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ message: "User logged in successfully", token });
  } catch (err) {
    console.error(`Error in login route: ${err.message}`);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// edit user information (protected)
// http://localhost:8080/users/:id/edit
router.put("/:id/edit", authenticateToken, async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: "Please fill in all fields" });
  }
  try {
    if (req.user.userId !== parseInt(req.params.id, 10)) {
      return res.status(403).json({ message: "Not authorized to edit this user" });
    }

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

// delete user account (protected)
// http://localhost:8080/users/:id/delete
router.delete("/:id/delete", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    // if the user is not the owner of the account, return 403
    // parseInt is used to convert the string id to a number
    // 10 converts any number strings to numbers from a collection of numbers (0-9)
    if (req.user.userId !== parseInt(id, 10)) {
      return res.status(403).json({ message: "Not authorized to delete this user" });
    }

    const deletedUser = await deleteUser(id);
    console.log(`USER DELETED OK!! ✅ ${deletedUser}`);
    res.status(200).json(deletedUser);
  } catch (err) {
    console.error(`Error in delete route: ${err.message}`);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// get user information (protected)
// http://localhost:8080/users/:id
router.get("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    // if the user is not the owner of the account, return 403
    if (req.user.userId !== parseInt(id, 10)) {
      return res.status(403).json({ message: "Not authorized to view this user" });
    }

    const user = await getUserById(id);
    console.log(`USER FOUND OK!! ✅ ${user}`);
    res.status(200).json(user);
  } catch (err) {
    console.error(`Error in get user route: ${err.message}`);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

module.exports = router;
