const express = require("express");
const jwt = require('jsonwebtoken');
const router = express.Router();
const { getUserById } = require("../db/queries/00_users_queries");
const { getPostById } = require("../db/queries/03_posts_queries");
const {
  likeAPost,
  viewPostLikes,
  unlikeAPost,
} = require("../db/queries/04_post_likes_queries");
const emptyArray = [];

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

// like a post 
// http://localhost:8080/likes/:post_id
router.post("/:post_id", authenticateToken, async (req, res) => {
  const { post_id } = req.params;
  const user_id = req.user.id; // Use the user ID from the JWT token
  
  try {
    const post = await getPostById(post_id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

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
router.get("/:post_id", async (req, res) => {
  const { post_id } = req.params;
  try {
    const postLikes = await viewPostLikes(post_id);
    if (postLikes === emptyArray) {
      return res.status(404).json({ message: "No likes on this post" });
    }

    console.log(`Post likes retrieved successfully! ✅ ${postLikes}`);
    res.status(200).json(postLikes);
  } catch (err) {
    console.error(`Error in view post likes route: ${err.message}`);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// unlike a post 
// http://localhost:8080/likes/:post_id/unlike
router.delete("/:post_id/unlike", authenticateToken, async (req, res) => {
  const { post_id } = req.params;
  const user_id = req.user.id; // Use the user ID from the JWT token
  
  try {
    const post = await getPostById(post_id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const postLike = await unlikeAPost({
      user_id,
      post_id,
    });

    if (!postLike) {
      return res.status(500).json({ message: "Post unlike failed" });
    }

    console.log(`Post unliked successfully! ✅ ${postLike}`);
    res.status(200).json(postLike);
  } catch (err) {
    console.error(`Error in unlike post route: ${err.message}`);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

module.exports = router;
