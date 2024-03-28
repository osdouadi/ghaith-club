const express = require("express");
const postController = require("./../controllers/postController");
const { singleUpload, arrayUpload } = require("../middleware/upload");
const resizeImage = require("../middleware/resizeImage");
const resizeMultiple = require("../middleware/resizeMultiple");

const router = express.Router();

router.post(
  "/",
  //singleUpload.single("cover"),
 // resizeImage("cover", 2000, 1333, "posts"),
  arrayUpload.array("images"),
  resizeMultiple("images", 2000, 1333, "posts"),
  postController.createPost
);
router.get("/", postController.getPaginated);
router.get("/:id", postController.getPostById);
router.put("/:id", postController.addComment);
router.put(
  "/:id",
  singleUpload.single("cover"),
  arrayUpload.array("images", 15),
  resizeImage("cover", 2000, 1333, "posts"),
  resizeMultiple("images", 2000, 1333, "posts"),
  postController.updatePost
);
router.delete("/:id", postController.deletePost);
module.exports = router;
