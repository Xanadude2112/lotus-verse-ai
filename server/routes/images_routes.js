const express = require("express");
const bcrypt = require("bcrypt");
// const jwt = require('jsonwebtoken');
const router = express.Router();
const {
  getUserById,
  getUserByUsername,
  getUserByEmail,
} = require("../db/queries/00_users_queries");
const {
  createImage,
  getAllImages,
  getImageById,
  getImagesByUserId,
  getImagesByPrompt,
  viewImageByOldest,
  viewImageByNewest,
  deleteImage,
} = require("../db/queries/01_images_queries");

// generate a new image
// http://localhost:8080/images/:id/generate
router.post("/:id/generate", async (req, res) => {
  const { id } = req.params; // user id
  const { prompt, image_url } = req.body;
  if (!prompt) {
    return res
      .status(400)
      .json({ error: "Please enter a prompt to generate an image" });
  }
  try {
    // if user does not exist or is not logged in throw error and redirect to login
    const userId = await getUserById(id);
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Please log in to generate an image" });
    }
    const newImage = await createImage({ prompt, image_url, user_id: id });
    console.log(`Image created successfully! ✅ ${newImage}`);
    res.status(201).json(newImage);
  } catch (err) {
    console.error(`Error in generate image route: ${err.message}`);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});
