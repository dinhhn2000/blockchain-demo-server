const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  privateKey: {
    type: String,
    require: true,
  },
  publicKey: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("users", userSchema);
