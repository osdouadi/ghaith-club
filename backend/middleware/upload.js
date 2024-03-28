const multer = require("multer");
const AppError = require("../utils/appError");

const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg"];

const singleUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError("Invalid image type!", 400), false);
    }
  },
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
});


const arrayUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError("Invalid images type!", 400), false);
    }
  },
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
}); 

exports.singleUpload = singleUpload;
exports.arrayUpload = arrayUpload;
