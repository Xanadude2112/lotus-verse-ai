const express = require("express");
const jwt = require("jsonwebtoken"); // Ensure jwt is required
const router = express.Router();
const { getUserById } = require("../db/queries/00_users_queries");
const { getPostById } = require("../db/queries/03_posts_queries");
const {
  commentOnAPost,
  viewAllCommentsOnAPost,
  deleteComment,
} = require("../db/queries/05_post_comments_queries");

// middleware to verify jwt
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden if token is invalid
    req.user = user;
    next();
  });
};

// comment on a post 
// http://localhost:8080/comments/:post_id
router.post("/:post_id", authenticateToken, async (req, res) => {
  const { post_id } = req.params;
  const { comment_content } = req.body;
  const user_id = req.user.id; // Get user ID from the JWT

  try {
    // Check if the post exists
    const post = await getPostById(post_id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const postComment = await commentOnAPost(comment_content, post_id, user_id);

    if (!postComment) {
      return res.status(500).json({ message: "Post comment failed" });
    }

    console.log(`Post comment successfully! ✅ ${postComment}`);
    res.status(201).json(postComment);
  } catch (err) {
    console.error(`Error in comment post route: ${err.message}`);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// et all comments on a post
// http://localhost:8080/comments/:post_id
router.get("/:post_id", async (req, res) => {
  const { post_id } = req.params;
  try {
    // Check if the post exists
    const post = await getPostById(post_id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comments = await viewAllCommentsOnAPost(post_id);
    if (!comments.length) {
      return res.status(404).json({ message: "No comments found" });
    }

    console.log(`Comments found successfully! ✅ ${comments}`);
    res.status(200).json(comments);
  } catch (err) {
    console.error(`Error in get comments route: ${err.message}`);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// delete a comment 
// http://localhost:8080/comments/:comment_id/delete
router.delete("/:comment_id/delete", authenticateToken, async (req, res) => {
  const { comment_id } = req.params;
  const user_id = req.user.id; // Get user ID from the JWT

  try {
    // Check if the comment exists and if the user is the owner of the comment
    const comment = await deleteComment(comment_id, user_id); // Pass user_id to ensure ownership
    if (!comment) {
      return res.status(404).json({ message: "Comment not found or not authorized" });
    }

    console.log(`Comment deleted successfully! ✅ ${comment}`);
    res.status(200).json(comment);
  } catch (err) {
    console.error(`Error in delete comment route: ${err.message}`);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

module.exports = router;
