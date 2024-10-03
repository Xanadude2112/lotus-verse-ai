const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const {
  createImage,
  getImageById,
  getImagesByUserId,
  getImagesByPrompt,
  deleteImage,
} = require("../db/queries/01_images_queries");

const emptyArray = [];

// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: "Access token is required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user; // Add user information to request
    next();
  });
};

// generate a new image
// http://localhost:8080/images/generate
router.post("/generate", authenticateJWT, async (req, res) => {
  const { prompt_text, img_url } = req.body;
  const userId = req.user.id; // Get user ID from the JWT token

  if (!prompt_text) {
    return res.status(400).json({ error: "Please enter a prompt to generate an image" });
  }

  try {
    // Pass the correct field names to createImage
    const newImage = await createImage({
      prompt_text,
      img_url,
      user_id: userId,
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
// http://localhost:8080/images/
router.get("/", authenticateJWT, async (req, res) => {
  const userId = req.user.id; // Get user ID from the JWT token
  try {
    const userImages = await getImagesByUserId(userId);
    if (userImages === emptyArray) {
      return res.status(404).json({ message: "No images found" });
    }

    console.log(`ALL IMAGES ARE AS FOLLOWS: ${userImages}`);
    res.status(200).json(userImages);
  } catch (err) {
    console.error(`Error in get all images route: ${err.message}`);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// get a specific image by id
// http://localhost:8080/images/:image_id
router.get("/:image_id", authenticateJWT, async (req, res) => {
  const { image_id } = req.params;
  const userId = req.user.id; // Get user ID from the JWT token
  
  // Check if the user has permission to view the image
  try {
    const image = await getImageById(image_id);
    if (!image || image.user_id !== userId) { // Check if the image belongs to the user
      return res.status(404).json({ message: "Image not found or access denied" });
    }

    console.log(`IMAGE FOUND: ${image}`);
    res.status(200).json(image);
  } catch (err) {
    console.error(`Error in get image by id route: ${err.message}`);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// get a specific image by prompt
// http://localhost:8080/images/prompt/:prompt_text
router.get("/prompt/:prompt_text", authenticateJWT, async (req, res) => {
  const { prompt_text } = req.params;
  const userId = req.user.id; // Get user ID from the JWT token

  try {
    const images = await getImagesByPrompt(prompt_text);
    const filteredImages = images.filter(image => image.user_id === userId); // Filter images by user

    if (filteredImages.length === 0) {
      return res.status(404).json({ message: "No images found for this prompt" });
    }

    console.log(`IMAGES FOUND: ${filteredImages}`);
    res.status(200).json(filteredImages);
  } catch (err) {
    console.error(`Error in get image by prompt route: ${err.message}`);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// delete a specific image
// http://localhost:8080/images/delete/:image_id
router.delete("/delete/:image_id", authenticateJWT, async (req, res) => {
  const { image_id } = req.params;
  const userId = req.user.id; // Get user ID from the JWT token
  
  try {
    const image = await getImageById(image_id);
    if (!image || image.user_id !== userId) { // Check if the image belongs to the user
      return res.status(404).json({ message: "Image not found or access denied" });
    }

    const deletedImage = await deleteImage(image_id);
    if (!deletedImage) {
      return res.status(500).json({ message: "Image deletion failed" });
    }

    console.log(`IMAGE DELETED: ${deletedImage}`);
    res.status(200).json(deletedImage);
  } catch (err) {
    console.error(`Error in delete image route: ${err.message}`);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

module.exports = router;
