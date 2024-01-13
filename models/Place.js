const mongoose = require("mongoose");

const PlaceSchema = new mongoose.Schema({
  ower: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  address: String,
  photos: [String],
  description: String,
  perks: [String],
  extraInfo: String,
  checkIn: Number,
  checkout: Number,
  maxGuests: Number,
});

const PlaceModel = mongoose.model("Place", PlaceSchema);

module.exports = PlaceModel;