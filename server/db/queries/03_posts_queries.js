const db = require("../connection");

//CREATE

const createPost = async (post) => {
  const { user_id, image_id, img_url, caption } = post;
  try {
    const newPost = await db.query(
      `
      INSERT INTO posts (user_id, image_id, img_url, caption)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `,
      [user_id, image_id, img_url, caption]
    );
    return newPost.rows[0];
  } catch (err) {
    console.log(`ERROR: ${err}`);
  }
};


//READ

const getAllPosts = async () => {
  try {
    const allPosts = await db.query(`
      SELECT * FROM posts;
    `);
    return allPosts.rows;
  } catch (err) {
    console.log(`ERROR: ${err}`);
  }
}

const getPostById = async (id) => {
  try {
    const post = await db.query(
      `
      SELECT * FROM posts
      WHERE id = $1;
    `,
      [id]
    );
    return post.rows[0];
  } catch (err) {
    console.log(`ERROR: ${err}`);
  }
}

const getPostByUsername = async (username) => {
  try {
    const posts = await db.query(
      `
      SELECT posts.* 
      FROM posts
      JOIN users ON posts.user_id = users.id
      WHERE users.username = $1;
      `,
      [username]
    );
    return posts.rows;
  } catch (err) {
    console.log(`ERROR: ${err}`);
  }
};



//UPDATE

const updatePostCaption = async (post) => {
  const { id, caption } = post;
  try {
    const updatedPost = await db.query(
      `
      UPDATE posts
      SET caption = $2
      WHERE id = $1
      RETURNING *;
      `,
      [id, caption]
    );
    return updatedPost.rows[0];
  } catch (err) {
    console.log(`ERROR: ${err}`);
  }
}



//DELETE

const deletePost = async (id) => {
  try {
    const deletedPost = await db.query(
      `
      DELETE FROM posts
      WHERE id = $1
      RETURNING *;
      `,
      [id]
    );
    return deletedPost.rows[0];
  } catch (err) {
    console.log(`ERROR: ${err}`);
  }
}

module.exports = { 
  createPost,
  getAllPosts,
  getPostById,
  getPostByUsername,
  updatePostCaption,
  deletePost
};