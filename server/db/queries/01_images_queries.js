const db = require('../connection');

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
}

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
}

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
}

//UPDATE


//DELETE