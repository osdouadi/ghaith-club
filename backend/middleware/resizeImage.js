const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const resizeImage = (title, width, height, pathName) => {
  return catchAsync(async (req, res, next) => {
    if (!req.file) return next(new AppError(`No ${title} uploaded`, 400));

    const resizedImage = await sharp(req.file.buffer)
      .resize(width, height)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toBuffer();

    const randomChars = Math.random().toString(36).substring(2, 7);
    const fileName = `${title}-${randomChars}-${Date.now()}-image.jpg`;
    const filePath = path.join(`img/${pathName}`, fileName);
    fs.writeFile(filePath, resizedImage, (err) => {
      if (err) {
        return next(new AppError("Error saving resized image", 500));
      }
      req.resizedImagePath = filePath;
      next();
    });
  });
};

module.exports = resizeImage;
