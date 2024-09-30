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
const { route } = require("./user_routes");

// generate a new image
// http://localhost:8080/images/:id/generate
router.post("/:id/generate", async (req, res) => {
  const { id } = req.params; // user id
  const { prompt_text, img_url } = req.body;
  if (!prompt_text) {
    return res
      .status(400)
      .json({ error: "Please enter a prompt to generate an image" });
  }
  try {
    // Check if the user exists
    const userId = await getUserById(id);
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Please log in to generate an image" });
    }

    // Pass the correct field names to createImage
    const newImage = await createImage({
      prompt_text,
      img_url,
      user_id: id,
    });

    if (!newImage) {
      return res.status(500).json({ message: "Image creation failed" });
    }

    console.log(`Image created successfully! ✅ ${newImage}`);
    res.status(201).json(newImage);
  } catch (err) {
    console.error(`Error in generate image route: ${err.message}`);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// get all user images
// http://localhost:8080/images/:id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  // check if user has permission to view images
  try {
    const userId = await getUserById(id);
    if(!userId) {
      res.redirect('/users/login');
      return res.status(401).json({ message: "Please log in to view images" });
    }
    const userImages = await getImagesByUserId(id);
    if (!userImages) {
      return res.status(404).json({ message: "No images found" });
    }
    console.log(`ALL IMAGES ARE AS FOLLOWS: ${userImages}`);
    res.status(200).json(userImages);
  } catch  (err) {
    console.error(`Error in get all images route: ${err.message}`);
    res.status(500).json({ message: "Server error. Please try again." });
  }
})

module.exports = router;