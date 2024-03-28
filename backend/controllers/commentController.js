const Comment = require("../models/comment");
const catchAsync = require("../utils/catchAsync");

exports.createComment = catchAsync(async (req, res, next) => {
  const newComment = await Comment.create({
    content: req.body.content,
    postId: req.body.postId,
    userId: req.body.userId,
  });

  res.status(201).json({
    status: "success",
    data: {
      newComment,
    },
  });
});


