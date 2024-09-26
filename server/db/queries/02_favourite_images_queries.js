const db = require("../connection");

//CREATE

const createFavouriteImage = async (favourite_image) => {
  try {
 const newFavouriteImage = await db.query(
  // Insert the 'user_id' and 'image_id' into the 'favourite_images' table
  // The values to be inserted will be provided by the placeholders ($1, $2)
  // After insertion, return the newly created record (the entire row)
  `
  INSERT INTO favourite_images (user_id, image_id)
  VALUES ($1, $2)
  RETURNING *;
  `,
  // The values for 'user_id' and 'image_id' to replace the placeholders
  [favourite_image.user_id, favourite_image.image_id]
);
// Return the first row (the new favorite image record) from the query result
return newFavouriteImage.rows[0];
  } catch (err) {
    console.log(`ERROR: ${err}`);
  }
};

//READ

const getFavouriteImagesByUser = async (user_id) => {
  try {
    const userFavourites = await db.query(
      // Perform an inner join between the 'images' table and the 'favourite_images' table
      // We are joining favourite_images with images on the 'id' that matches 'image_id' in favourite_images
      // This means we're only grabbing the images from the 'images' table that have the same id as the 'image_id' in the 'favourite_images' table
      // As a result, we get only those images that have been marked as favorites by users
      `
      SELECT images.*
      FROM images
      JOIN favourite_images ON images.id = favourite_images.image_id
      WHERE favourite_images.user_id = $1;
      `,
      [user_id]
    );
    return userFavourites.rows;  // Return the list of favorite images
  } catch (err) {
    console.error(`ERROR: ${err}`);
  }
};



//UPDATE



//DELETE

const deleteFavouriteImage = async (favourite_image) => {
  try {
    const deletedFavouriteImage = await db.query(
      // Delete the record from the 'favourite_images' table where the 'user_id' and 'image_id' match the provided values
      `
      DELETE FROM favourite_images
      WHERE user_id = $1 AND image_id = $2
      RETURNING *;  
      `,
      [favourite_image.user_id, favourite_image.image_id] // Pass the user_id and image_id from the favourite_image object
    );

    // Return the deleted favorite image record or null if nothing was deleted
    return deletedFavouriteImage.rows.length > 0 ? deletedFavouriteImage.rows[0] : null;  // Return the deleted record if it exists
  } catch (err) {
    console.error(`ERROR: ${err}`);
  }
};

module.exports = {
  createFavouriteImage,
  getFavouriteImagesByUser,
  deleteFavouriteImage
};