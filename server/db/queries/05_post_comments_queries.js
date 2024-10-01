const db = require("../connection");

// CREATE

const commentOnAPost = async (comment_content, post_id, user_id) => {
  try {
    const newComment = await db.query(
      `
      INSERT INTO post_comments (comment_content, post_id, user_id)
      VALUES ($1, $2, $3)
      RETURNING *;
      `,
      [comment_content, post_id, user_id]
    );

    if (!newComment.rows[0]) {
      throw new Error("Comment creation failed.");
    }

    return newComment.rows[0];
  } catch (err) {
    console.error(`ERROR in commentOnAPost: ${err.message}`);
    throw new Error("Unable to post the comment. Please try again.");
  }
};

// READ

const viewAllCommentsOnAPost = async (post_id) => {
  try {
    const allComments = await db.query(
      `
      SELECT post_comments.id, post_comments.comment_content, post_comments.created_at, u.username
      FROM post_comments post_comments
      JOIN users u ON post_comments.user_id = u.id
      WHERE post_comments.post_id = $1
      ORDER BY post_comments.created_at DESC;
      `,
      [post_id]
    );

    // Check if there are no comments
    if (allComments.rows.length === 0) {
      return []; // Return an empty array if no comments found
    }

    return allComments.rows;
  } catch (err) {
    console.error(`ERROR in viewAllCommentsOnAPost: ${err.message}`);
    throw new Error("Unable to retrieve comments. Please try again.");
  }
};

// UPDATE



// DELETE

const deleteComment = async (comment_id) => {
  try {
    const deletedComment = await db.query(
      `
      DELETE FROM post_comments
      WHERE id = $1
      RETURNING *;
      `,
      [comment_id]
    );

    if (!deletedComment.rows[0]) {
      throw new Error("Comment deletion failed.");
    }

    return deletedComment.rows[0];
  } catch (err) {
    console.error(`ERROR in deleteComment: ${err.message}`);
    throw new Error("Unable to delete the comment. Please try again.");
  }
}

module.exports = {
  commentOnAPost,
  viewAllCommentsOnAPost,
  deleteComment
};
