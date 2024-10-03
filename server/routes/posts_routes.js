const express = require("express");
// const jwt = require('jsonwebtoken');
const router = express.Router();
const {
  getUserById
} = require("../db/queries/00_users_queries");
const {
  getImageById
} = require("../db/queries/01_images_queries");
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
  deletePost
} = require("../db/queries/03_posts_queries");
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


// create a post
// http://localhost:8080/posts/:user_id/:image_id
router.post("/:user_id/:image_id", authenticateToken, async (req, res) => {
  const { user_id, image_id } = req.params;
  const { img_url, caption } = req.body;
  try {
    // Check if the user exists
    const userId = await getUserById(user_id);
    if (!userId) {
      return res.status(401).json({
        message: "Please log in to create posts.",
        loginLink: "/login",
      });
    }

    const image = await getImageById(image_id);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }
    
    const post = await createPost({
      user_id,
      image_id,
      img_url,
      caption
    });

    if (!post) {
      return res.status(500).json({ message: "Post failed" });
    }

    console.log(`Post created successfully! ✅ ${post}`);
    res.status(201).json(post);
  } catch (err) {
    console.error(`Error in post route: ${err.message}`);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// get all posts
// http://localhost:8080/posts
router.get("/", async (req, res) => {
  try {
    const posts = await getAllPosts();
    if (!posts) {
      return res.status(404).json({ message: "Posts not found" });
    }
    console.log(`All posts retrieved successfully! ✅ ${posts}`);
    res.status(200).json(posts);
  } catch (err) {
    console.error(`Error in get all posts route: ${err.message}`);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// get a post by id
// http://localhost:8080/posts/:user_id/:post_id
router.get("/:user_id/:post_id", async (req, res) => {
  const { post_id } = req.params; // user_id is not needed here
  try {
    const post = await getPostById(post_id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    console.log(`Post retrieved successfully! ✅ ${post}`);
    res.status(200).json(post);
  } catch (err) {
    console.error(`Error in get post by id route: ${err.message}`);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// delete a post
// http://localhost:8080/posts/:user_id/:post_id/delete
router.delete("/:user_id/:post_id/delete", authenticateToken, async (req, res) => {
  const { user_id, post_id } = req.params;
  try {
    const userId = await getUserById(user_id);
    if (!userId) {
      return res.status(401).json({
        message: "Please log in to delete posts.",
        loginLink: "/login",
      });
    }

    const post = await getPostById(post_id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const deletedPost = await deletePost(post_id);
    console.log(`Post deleted successfully! ✅ ${deletedPost}`);
    res.status(200).json(deletedPost);
  } catch (err) {
    console.error(`Error in delete post route: ${err.message}`);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

module.exports = router;