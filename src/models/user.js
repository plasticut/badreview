const mongoose = require("mongoose");

mongoose.model('user', new Schema({
  _id: Number,
  name: String,
  login: String,
  auth: {
    password: String,
  },
  avatar: String,
}));