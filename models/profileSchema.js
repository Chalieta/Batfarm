const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  userID: { type: String, require: true, unique: true },
  serverID: { type: String, require: true },
  coins: { type: Number, default: 1000 },
  bank: { type: Number },
  // Last daily timestamp
  // Last work timestamp
});

const model = mongoose.model("Profiles", profileSchema);

module.exports = model;
