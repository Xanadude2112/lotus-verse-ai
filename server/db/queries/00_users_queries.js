const db = require("../connection");

// CREATE

// create a new user
const createUser = async (user) => {
  const { username, email, hashedPassword } = user;
  try {
    const newUser = await db.query(
      `
      INSERT INTO users (username, email, password)
      VALUES ($1, $2, $3)
      RETURNING *;
    `,
      [username, email, hashedPassword]
    );
    return newUser.rows[0];
  } catch (err) {
    // Handle unique constraint violation error
    if (err.code === '23505') { // 23505 is the unique violation error code in PostgreSQL
      throw new Error('Username or email already exists');
    }
    console.log(`ERROR: ${err}`);
    throw err; // Rethrow the error for further handling
  }
};

// READ


// get all users
const getAllUsers = async () => {
  try {
    const allUsers = await db.query(`
      SELECT * FROM users;
    `);
    return allUsers.rows;
  } catch (err) {
    console.log(`ERROR: ${err}`);
  }
};

// get a user by id
const getUserById = async (id) => {
  try {
    const user = await db.query(
      `
      SELECT * FROM users
      WHERE id = $1;
    `,
      [id]
    );
    return user.rows[0];
  } catch (err) {
    console.log(`ERROR: ${err}`);
  }
};

// get a user by email
const getUserByEmail = async (email) => {
  try {
    const user = await db.query(
      `
      SELECT * FROM users
      WHERE email = $1;
    `,
      [email]
    );
    return user.rows[0];
  } catch (err) {
    console.log(`ERROR: ${err}`);
  }
};

// get a user by username
const getUserByUsername = async (username) => {
  try {
    const user = await db.query(
      `
      SELECT * FROM users
      WHERE username = $1;
    `,
      [username]
    );
    return user.rows[0];
  } catch (err) {
    console.log(`ERROR: ${err}`);
  }
};

// UPDATE

// edit a user
const updateUser = async (id, username, email, hashedPassword) => {
  try {
    const updatedUser = await db.query(
      `
      UPDATE users
      SET username = $2, email = $3, password = $4
      WHERE id = $1
      RETURNING *;
    `,
      [id, username, email, hashedPassword]
    );
    return updatedUser.rows[0];
  } catch (err) {
    console.log(`ERROR: ${err}`);
  }
};

// DELETE

// delete a user
const deleteUser = async (id) => {
  try {
    const deletedUser = await db.query(
      `
      DELETE FROM users
      WHERE id = $1
      RETURNING *;
    `,
      [id]
    );
    return deletedUser.rows[0];
  } catch (err) {
    console.log(`ERROR: ${err}`);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
  getUserByUsername,
  updateUser,
  deleteUser,
};
