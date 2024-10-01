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
  likeAPost,
  viewPostLikes,
  unlikeAPost,
} = require("../db/queries/04_post_likes_queries");
const emptyArray = [];


// like a post
// http://localhost:8080/likes/:user_id/:post_id
router.post("/:user_id/:post_id", async (req, res) => {
  const { user_id, post_id } = req.params;
  try {
    // Check if the user exists
    const userId = await getUserById(user_id);
    if (!userId) {
      // Return a structured response with a message and link
      return res.status(401).json({
        message: "Please log in to like posts.",
        loginLink: "/login",
      });
    }

    const post = await getPostById(post_id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    // Pass the correct

    const postLike = await likeAPost({
      user_id,
      post_id,
    });

    if (!postLike) {
      return res.status(500).json({ message: "Post like failed" });
    }

    console.log(`Post liked successfully! ✅ ${postLike}`);
    res.status(201).json(postLike);
  } catch (err) {
    console.error(`Error in like post route: ${err.message}`);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});


// see all likes of a post
// http://localhost:8080/likes/:post_id
// Retrieve likes for a specific post
router.get("/:post_id", async (req, res) => {
  const { post_id } = req.params;
  try {
    const postLikes = await viewPostLikes(post_id);
    if (postLikes.length === 0) {
      return res.status(404).json({ message: "No likes on this post" });
    }

    console.log(`Post likes retrieved successfully! ✅ ${postLikes}`);
    res.status(200).json(postLikes);
  } catch (err) {
    console.error(`Error in view post likes route: ${err.message}`);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});



module.exports = router;