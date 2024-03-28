const Banner = require("../models/banner");
const catchAsync = require("../utils/catchAsync");

// Get paginated banners
exports.getPaginatedBanner = catchAsync(async (req, res, next) => {
  const banners = await Banner.find();

  res.status(200).json({
    message: "success",
    data: {
      banners,
    },
    total: banners.length,
  });
});

// Get banner by id
exports.getBannerById = catchAsync(async (req, res, next) => {
  const banner = await Banner.findById(req.params.id);

  if (!banner) {
    res.status(404).json({
      message: "Image not found",
    });
  } else {
    res.status(200).json({
      message: "Success",
      data: {
        banner,
      },
    });
  }
});

// Create a new banner
exports.createBanner = catchAsync(async (req, res, next) => {
  if (!req.resizedImagePath) {
    return res.status(400).json({ error: "No image uploaded" });
  }

  const banner = req.resizedImagePath;

  const newBanner = await Banner.create({ banner });

  res.status(201).json({
    message: "success",
    data: {
      newBanner,
    },
  });
});

// Update a banner
exports.updateBanner = catchAsync(async (req, res, next) => {
  if (!req.resizedImagePath) {
    return res.status(400).json({ error: "No image uploaded" });
  }
  const banner = req.resizedImagePath;

  const updatedBanner = await Banner.findByIdAndUpdate(
    req.params.id,
    { banner },
    {
      new: true,
    }
  );

  if (!updatedBanner) {
    res.status(404).json({
      message: "Banner not found",
    });
  } else {
    res.status(200).json({
      message: "Banner updated successfully",
      data: {
        banner,
      },
    });
  }
});

// Delete a banner
exports.deleteBanner = catchAsync(async (req, res, next) => {
  const banner = await Banner.findByIdAndDelete(req.params.id);

  if (!banner) {
    res.status(404).json({ message: "Banner not found" });
  } else {
    res.status(200).json({ message: "Banner deleted succussfully" });
  }
});
