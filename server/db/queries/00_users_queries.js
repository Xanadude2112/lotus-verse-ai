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

// UPDATE

// DELETE


module.exports = {
  createUser,
};