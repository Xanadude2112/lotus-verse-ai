const db = require("../connection");

//CREATE

// create a new image
const createImage = async (image) => {
  const { img_url, prompt_text, user_id } = image;
  try {
    const newImage = await db.query(
      `
      INSERT INTO images (img_url, prompt_text, user_id) 
      VALUES ($1, $2, $3) 
      RETURNING *;
    `,
      [img_url, prompt_text, user_id]
    );
    return newImage.rows[0];
  } catch (err) {
    console.log(`ERROR: ${err}`);
  }
};

//READ

// get all images
const getAllImages = async () => {
  try {
    const allImages = await db.query(`
      SELECT * FROM images;
    `);
    return allImages.rows;
  } catch (err) {
    console.log(`ERROR: ${err}`);
  }
};

// get an image by id
const getImageById = async (id) => {
  try {
    const image = await db.query(
      `
      SELECT * FROM images
      WHERE id = $1;
    `,
      [id]
    );
    return image.rows[0];
  } catch (err) {
    console.log(`ERROR: ${err}`);
  }
};

// get images by user_id
const getImagesByUserId = async (user_id) => {
  try {
    const images = await db.query(
      `
      SELECT * FROM images
      WHERE user_id = $1;
    `,
      [user_id]
    );
    return images.rows;
  } catch (err) {
    console.log(`ERROR: ${err}`);
  }
};

// get images by prompt_text
const getImagesByPrompt = async (prompt_text) => {
  try {
    const images = await db.query(
      `
      SELECT * FROM images
      WHERE prompt_text = $1;
    `,
      [prompt_text]
    );
    return images.rows;
  } catch (err) {
    console.log(`ERROR: ${err}`);
  }
};

// sort images by oldest
const viewImageByOldest = async () => {
  try {
    const images = await db.query(
      `
      SELECT * FROM images
      ORDER BY created_at ASC;
    `
    );
    return images.rows;
  } catch (err) {
    console.log(`ERROR: ${err}`);
  }
};

// sort images by newest
const viewImageByNewest = async () => {
  try {
    const images = await db.query(
      `
      SELECT * FROM images
      ORDER BY created_at DESC;
    `
    );
    return images.rows;
  } catch (err) {
    console.log(`ERROR: ${err}`);
  }
};

//UPDATE

//DELETE

// delete an image by id
const deleteImage = async (id) => {
  try {
    const deletedImage = await db.query(
      `
      DELETE FROM images
      WHERE id = $1
      RETURNING *;
    `,
      [id]
    );
    return deletedImage.rows[0];
  } catch (err) {
    console.log(`ERROR: ${err}`);
  }
};

module.exports = {
  createImage,
  getAllImages,
  getImageById,
  getImagesByUserId,
  getImagesByPrompt,
  viewImageByOldest,
  viewImageByNewest,
  deleteImage,
};
