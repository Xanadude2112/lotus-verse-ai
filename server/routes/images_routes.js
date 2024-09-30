const express = require("express");
const bcrypt = require("bcrypt");
// const jwt = require('jsonwebtoken');
const userRoutes = require("./user_routes");
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
      // Return a structured response with a message and link
      return res.status(401).json({
        message: "Please log in to view images.",
        loginLink: "/login",
      });
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
  try {
    const userId = await getUserById(id);
    if (!userId) {
      // Return a structured response with a message and link
      return res.status(401).json({
        message: "Please log in to view images.",
        loginLink: "/login",
      });
    }

    const userImages = await getImagesByUserId(id);
    if (userImages.length === 0) {
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
// http://localhost:8080/images/:id/:image_id
router.get("/:id/:image_id", async (req, res) => {
  const { id, image_id } = req.params;
  //check if the user has permission to view the image
  try {
    const userId = await getUserById(id);
    if (!userId) {
      // Return a structured response with a message and link
      return res.status(401).json({
        message: "Please log in to view images.",
        loginLink: "/login",
      });
    }

    const image = await getImageById(image_id);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    console.log(`IMAGE FOUND: ${image}`);
    res.status(200).json(image);
  } catch (err) {
    console.error(`Error in get image by id route: ${err.message}`);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// get a specific image by prompt
// http://localhost:8080/images/:id/prompt/:prompt_text
router.get("/:id/prompt/:prompt_text", async (req, res) => {
  const { id, prompt_text } = req.params;
  try {
    const userId = await getUserById(id);
    if (!userId) {
      // Return a structured response with a message and link
      return res.status(401).json({
        message: "Please log in to view images.",
        loginLink: "/login",
      });
    }

    const image = await getImagesByPrompt(prompt_text);
    if (image.length === 0) {
      return res.status(404).json({ message: "Image not found" });
    }

    console.log(`IMAGE FOUND: ${image}`);
    res.status(200).json(image);
  } catch (err) {
    console.error(`Error in get image by prompt route: ${err.message}`);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// delete a specific image
// http://localhost:8080/images/:id/delete/:image_id
router.delete("/:id/delete/:image_id", async (req, res) => {
  const { id, image_id } = req.params;
  try {
    const userId = await getUserById(id);

    if (!userId) {
      // Return a structured response with a message and link
      return res.status(401).json({
        message: "Please log in to view images.",
        loginLink: "/login",
      });
    }

    const image = await getImageById(image_id);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
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
