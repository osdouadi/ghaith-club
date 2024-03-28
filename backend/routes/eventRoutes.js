const express = require("express");
const eventController = require("./../controllers/eventController");
const { uploadImage } = require("../middleware/upload");
const resizeImage = require("../middleware/resizeImage");

const router = express.Router();

router.get("/", eventController.getPaginatedEvents);
router.get("/:id", eventController.getEventById);
router.post(
  "/",

  eventController.createEvent
);
router.put(
  "/:id",
  eventController.updateEvent
);
router.delete("/:id", eventController.deleteEvent);

module.exports = router;
