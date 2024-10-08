const express = require("express");
const jwt = require('jsonwebtoken');
const router = express.Router();
const {
  getImageById
} = require("../db/queries/01_images_queries");
const {
  createFavouriteImage,
  getFavouriteImagesByUser,
  deleteFavouriteImage,
} = require("../db/queries/02_favourite_images_queries");
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


// favourite an image
// http://localhost:8080/favorites/:image_id
router.post("/:image_id", authenticateToken, async (req, res) => {
  const { image_id } = req.params;
  try {
    const image = await getImageById(image_id);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }
    
    const faveImage = await createFavouriteImage({
      user_id: req.userId,
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
// http://localhost:8080/favorites
router.get("/", authenticateToken, async (req, res) => {
  try {
    const faveImages = await getFavouriteImagesByUser(req.userId);
    if (faveImages === emptyArray) {
      return res.status(404).json({ message: "There are no favourite images to display" });
    }

    console.log(`Favourite images found successfully! ✅ ${faveImages}`);
    res.status(200).json(faveImages);
  } catch (err) {
    console.error(`Error in get favourite images route: ${err.message}`);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// unfavourite an image
// http://localhost:8080/favorites/unfavorite/:image_id
router.delete("/unfavorite/:image_id", authenticateToken, async (req, res) => {
  const { image_id } = req.params;
  try {
    const image = await getImageById(image_id);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    const faveImage = await deleteFavouriteImage({ user_id: req.userId, image_id });

    if (!faveImage) {
      return res.status(500).json({ message: "Unfavourite image failed" });
    }

    console.log(`Image unfavourited successfully! ✅ ${faveImage}`);
    res.status(200).json(faveImage);
  } catch (err) {
    console.error(`Error in unfavourite image route: ${err.message}`);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

module.exports = router;
