const express = require("express");
const bannerController = require("./../controllers/bannerController");
const { uploadImage } = require("../middleware/upload");
const { resizeImage } = require("../middleware/resizeImage");

const router = express.Router();

router.get("/", bannerController.getPaginatedBanner);
router.get("/:id", bannerController.getBannerById);
router.post(
  "/",
  bannerController.createBanner
);
router.put(
  "/:id",
  bannerController.updateBanner
);
router.delete("/:id", bannerController.deleteBanner);

module.exports = router;
