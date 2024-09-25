const express = require("express");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 8080;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send(`WE ARE LIVE MFFFFFFF 🏎️💨`);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀`);
});
