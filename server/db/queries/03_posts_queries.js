const db = require("../connection");

//CREATE

const createPost = async (post) => {
  const { user_id, image_id, caption } = post;
  try {
    const newPost = await db.query(
      `
      INSERT INTO posts (user_id, image_id, caption)
      VALUES ($1, $2, $3)
      RETURNING *;
      `,
      [user_id, image_id, caption]
    );
    return newPost.rows[0];
  } catch (err) {
    console.log(`ERROR: ${err}`);
  }
};


//READ




//UPDATE





//DELETE