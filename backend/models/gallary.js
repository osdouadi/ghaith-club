const mongoose = require("mongoose");

const gallarySchema = new mongoose.Schema({
  image: {
    type: String,
    required: [true, "Image field is required"],
  },
});

const Gallary = mongoose.model("Gallary", gallarySchema);

module.exports = Gallary;
