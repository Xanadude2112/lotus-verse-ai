const express = require("express");
// const jwt = require('jsonwebtoken');
const router = express.Router();
const {
  getUserById,
  getUserByUsername,
  getUserByEmail,
} = require("../db/queries/00_users_queries");
const {
  createImage,
  getImageById,
  getImagesByUserId,
  getImagesByPrompt,
  deleteImage,
} = require("../db/queries/01_images_queries");
const {
  createFavouriteImage,
  getFavouriteImagesByUser,
  deleteFavouriteImage,
} = require("../db/queries/02_favourite_images_queries");

// favourite an image
// http://localhost:8080/favorites/:id/:image_id
router.post("/:id/:image_id", async (req, res) => {
  const { id, image_id } = req.params;
  try {
    // Check if the user exists
    const userId = await getUserById(id);
    if (!userId) {
      // Return a structured response with a message and link
      return res.status(401).json({
        message: "Please log in to favourite images.",
        loginLink: "/login",
      });
    }

    // Pass the correct field names to createImage
    const faveImage = await createFavouriteImage({
      user_id: id,
      image_id,
    });

    if (!faveImage) {
      return res.status(500).json({ message: "Favourite image failed" });
    }

    console.log(`Image favourited successfully! ✅ ${faveImage}`);
    res.status(201).json(faveImage);
  } catch (err) {
    console.error(`Error in favourite image route: ${err.message}`);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// get all user favourite images
// http://localhost:8080/favorites/:id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Check if the user exists
    const userId = await getUserById(id);
    if (!userId) {
      // Return a structured response with a message and link
      return res.status(401).json({
        message: "Please log in to view favourite images.",
        loginLink: "/login",
      });
    }

    const faveImages = await getFavouriteImagesByUser(id);

    if (!faveImages) {
      return res.status(500).json({ message: "Favourite images not found" });
    }

    console.log(`Favourite images found successfully! ✅ ${faveImages}`);
    res.status(200).json(faveImages);
  } catch (err) {
    console.error(`Error in get favourite images route: ${err.message}`);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

module.exports = router;
