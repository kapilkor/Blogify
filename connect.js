require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/blogifyDB";

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

module.exports = mongoose;