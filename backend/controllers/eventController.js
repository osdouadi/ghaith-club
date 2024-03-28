const Event = require("../models/event");
const catchAsync = require("../utils/catchAsync");

// Get paginated events
exports.getPaginatedEvents = catchAsync(async (req, res, next) => {
  const events = await Event.find();

  res.status(200).json({
    message: "success",
    data: {
      events,
    },
  });
});

// Get event by id
exports.getEventById = catchAsync(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404).json({
      message: "Event not found",
    });
  } else {
    res.status(200).json({
      message: "Success",
      data: {
        event,
      },
    });
  }
});

// Create a new event
exports.createEvent = catchAsync(async (req, res, next) => {
  if (!req.resizedImagePath) {
    return res.status(400).json({ error: "No image uploaded" });
  }

  const image = req.resizedImagePath;

  const newEvent = await Event.create({
    title: req.body.title,
    details: req.body.details,
    date: req.body.date,
    image: image,
  });

  res.status(201).json({
    message: "success",
    data: {
      newEvent,
    },
  });
});

// Update an event
exports.updateEvent = catchAsync(async (req, res, next) => {
  if (!req.resizedImagePath) {
    return res.status(400).json({ error: "No image uploaded" });
  }

  const image = req.resizedImagePath;

  const event = await Event.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      details: req.body.details,
      date: req.body.date,
      image: image,
    },
    {
      new: true,
    }
  );

  if (!event) {
    res.status(404).json({
      message: "Event not found",
    });
  } else {
    res.status(200).json({
      message: "Event updated successfully",
      data: {
        event,
      },
    });
  }
});

// Delete an event
exports.deleteEvent = catchAsync(async (req, res, next) => {
  const event = await Event.findByIdAndDelete(req.params.id);

  if (!event) {
    res.status(404).json({ message: "Event not found" });
  } else {
    res.status(200).json({ message: "Event deleted succussfully" });
  }
});
