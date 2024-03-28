const Gallary = require("../models/gallary");
const catchAsync = require("../utils/catchAsync");

// Get paginated gallaries
exports.getPaginatedGallary = catchAsync(async (req, res, next) => {
  const gallaries = await Gallary.find();

  res.status(200).json({
    message: "success",
    data: {
      gallaries,
    },
    total: gallaries.length,
  });
});

// Get gallary by id
exports.getGallaryById = catchAsync(async (req, res, next) => {
  const gallary = await Gallary.findById(req.params.id);

  if (!gallary) {
    res.status(404).json({
      message: "Gallary not found",
    });
  } else {
    res.status(200).json({
      message: "Success",
      data: {
        gallary,
      },
    });
  }
});

// Create a new gallary
exports.createGallary = catchAsync(async (req, res, next) => {
  if (!req.resizedImagePath) {
    return res.status(400).json({ error: "No image uploaded" });
  }

  const image = req.resizedImagePath;

  const newGallary = await Gallary.create({
    image,
  });

  res.status(201).json({
    message: "success",
    data: {
      newGallary,
    },
  });
});

// Update a gallary
exports.updateGallary = catchAsync(async (req, res, next) => {
  if (!req.resizedImagePath) {
    return res.status(400).json({ error: "No image uploaded" });
  }

  const image = req.resizedImagePath;

  const gallary = await Gallary.findByIdAndUpdate(
    req.params.id,
    { image },
    {
      new: true,
    }
  );

  if (!gallary) {
    res.status(404).json({
      message: "Image not found",
    });
  } else {
    res.status(200).json({
      message: "Image updated successfully",
      data: {
        gallary,
      },
    });
  }
});

// Delete a gallary
exports.deleteGallary = catchAsync(async (req, res, next) => {
  const gallary = await Gallary.findByIdAndDelete(req.params.id);

  if (!gallary) {
    res.status(404).json({ message: "Image not found" });
  } else {
    res.status(200).json({ message: "Image deleted succussfully" });
  }
});
