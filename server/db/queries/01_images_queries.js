const db = require("../connection");

//CREATE

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
