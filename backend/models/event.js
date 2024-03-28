const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "An event must have a title"],
  },
  details: {
    type: String,
    required: [true, "An event must have details"],
  },
  date: {
    type: Date
  },
  image: {
    type: String,
    default: "event-default.png",
  },
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
