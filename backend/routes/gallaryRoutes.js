const express = require("express");
const gallaryController = require("./../controllers/gallaryController");
const { resizeImage } = require("../middleware/resizeImage");
const { uploadImage } = require("../middleware/upload");

const router = express.Router();

router.get("/", gallaryController.getPaginatedGallary);
router.get("/:id", gallaryController.getGallaryById);
router.post(
  "/",
  gallaryController.createGallary
);
router.put(
  "/:id",
  gallaryController.updateGallary
);
router.delete("/:id", gallaryController.deleteGallary);

module.exports = router;
