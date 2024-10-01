const express = require("express");
// const jwt = require('jsonwebtoken');
const router = express.Router();
const { getUserById } = require("../db/queries/00_users_queries");
const { getImageById } = require("../db/queries/01_images_queries");
const {
  createFavouriteImage,
  getFavouriteImagesByUser,
  deleteFavouriteImage,
} = require("../db/queries/02_favourite_images_queries");
const {
  createPost,
  getAllPosts,
  getPostById,
  getPostByUsername,
  updatePostCaption,
  deletePost,
} = require("../db/queries/03_posts_queries");
const {
  commentOnAPost,
  viewAllCommentsOnAPost,
  deleteComment,
} = require("../db/queries/05_post_comments_queries");
const emptyArray = [];

// comment on a post
// http://localhost:8080/comments/:user_id/:post_id
router.post("/:user_id/:post_id", async (req, res) => {
  const { user_id, post_id } = req.params;
  const { comment_content } = req.body;
  try {
    // Check if the user exists
    const userId = await getUserById(user_id);
    if (!userId) {
      // Return a structured response with a message and link
      return res.status(401).json({
        message: "Please log in to comment on posts.",
        loginLink: "/login",
      });
    }

    const post = await getPostById(post_id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    // Pass the correct

    const postComment = await commentOnAPost(comment_content);

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

module.exports = router;
