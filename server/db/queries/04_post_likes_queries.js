const db = require("../connection");

// CREATE
const likeAPost = async (post_like) => {
  const { user_id, post_id } = post_like;
  try {
    const newPostLike = await db.query(
      `
      INSERT INTO post_likes (user_id, post_id)
      VALUES ($1, $2)
      RETURNING *;
      `,
      [user_id, post_id]
    );
    if (!newPostLike.rows[0]) {
      throw new Error('Post like failed to be created.');
    }
    return newPostLike.rows[0];
  } catch (err) {
    console.error(`ERROR in likeAPost: ${err.message}`);
    throw new Error('Unable to like the post. Please try again.');
  }
};

// READ
const viewPostLikes = async (post_id) => {
  try {
    const postLikes = await db.query(
      `
      SELECT users.username
      FROM post_likes
      JOIN users ON post_likes.user_id = users.id
      WHERE post_likes.post_id = $1;
      `,
      [post_id]
    );
    if (postLikes.rows.length === 0) {
      throw new Error('No likes found for this post.');
    }
    return postLikes.rows;
  } catch (err) {
    console.error(`ERROR in viewPostLikes: ${err.message}`);
    throw new Error('Unable to retrieve post likes.');
  }
};

// DELETE
const unlikeAPost = async (post_like) => {
  const { user_id, post_id } = post_like;
  try {
    const deletedPostLike = await db.query(
      `
      DELETE FROM post_likes
      WHERE user_id = $1 AND post_id = $2
      RETURNING *;
      `,
      [user_id, post_id]
    );
    if (!deletedPostLike.rows[0]) {
      throw new Error('Post like not found or already removed.');
    }
    return deletedPostLike.rows[0];
  } catch (err) {
    console.error(`ERROR in unlikeAPost: ${err.message}`);
    throw new Error('Unable to unlike the post. Please try again.');
  }
};

module.exports = {
  likeAPost,
  viewPostLikes,
  unlikeAPost
};
