const express = require("express");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoutes = require('./routes/user_routes');
const imagesRoutes = require('./routes/images_routes');
const faveImagesRoutes = require('./routes/favourite_images_routes');
const postRoutes = require('./routes/posts_routes');
const postLikesRoutes = require('./routes/post_likes_routes');
const postCommentsRoutes = require('./routes/post_comments_route');
require("./db/connection");

const PORT = process.env.PORT || 8080;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', userRoutes);
app.use('/images', imagesRoutes);
app.use('/favorites', faveImagesRoutes);
app.use('/posts', postRoutes);
app.use('/likes', postLikesRoutes);
app.use('/comments', postCommentsRoutes);

app.get("/", (req, res) => {
  res.send(`WE ARE LIVE MFFFFFFF 🏎️💨`);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀`);
});
