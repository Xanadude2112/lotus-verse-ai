const db = require("../connection");

// CREATE

const createUser = async (user) => {
  const { username, email, password } = user;
  try {
    const newUser = await db.query(
      `
      INSERT INTO users (username, email, password)
      VALUES ($1, $2, $3)
      RETURNING *;
    `,
      [username, email, password]
    );
    return newUser.rows[0];
  } catch (err) {
    console.log(`ERROR: ${err}`);
  }
};
// READ

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

const udpdateUser = async (id, username, email, password) => {
  try {
    const updatedUser = await db.query(
      `
      UPDATE users
      SET username = $2, email = $3, password = $4
      WHERE id = $1
      RETURNING *;
    `,
      [id, username, email, password]
    );
    return updatedUser.rows[0];
  } catch (err) {
    console.log(`ERROR: ${err}`);
  }
};

// DELETE

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
  udpdateUser,
  deleteUser,
};
