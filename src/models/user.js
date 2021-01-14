const mongoose = require("mongoose");

mongoose.model('user', new Schema({
  _id: Number,
  name: String,
  login: String,
  password: String,
  avatar: String,
  accessCount: Number,
}));