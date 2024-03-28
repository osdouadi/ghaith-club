const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const resizeMultiple = (title, width, height, pathName) => {
  return catchAsync(async (req, res, next) => {
    if (!req.files || req.files.length === 0)
      return next(new AppError(`No ${title} uploaded`, 400));

    const resizePromises = req.files.map(async (file, index) => {
      const resizedImage = await sharp(file.buffer)
        .resize(width, height)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toBuffer();

      const randomChars = Math.random().toString(36).substring(2, 7);
      const fileName = `${title}-${randomChars}-${Date.now()}-image.jpg`;
      const filePath = path.join(`public/img/${pathName}`, fileName);

      const imagePathInDB = `/img/${pathName}/${fileName}`;

      return new Promise((resolve, reject) => {
        fs.writeFile(filePath, resizedImage, (err) => {
          if (err) {
            reject(new AppError("Error saving resized images", 500));
          }
          resolve(imagePathInDB);
        });
      });
    });

    try {
      const resizedFilePaths = await Promise.all(resizePromises);
      req.resizedImagePaths = resizedFilePaths;
      next();
    } catch (err) {
      next(err);
    }
  });
};

module.exports = resizeMultiple;