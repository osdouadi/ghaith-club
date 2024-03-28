const Comment = require("../models/comment");
const catchAsync = require("../utils/catchAsync");
const { Post, PostCounter } = require("./../models/post");

// Create a new post
exports.createPost = catchAsync(async (req, res, next) => {
  const images = req.resizedImagePaths;

  const newPost = await Post.create({
    title: req.body.title,
    summary: req.body.summary,
    content: req.body.content,
    images,
  });

  res.status(201).json({
    status: "success",
    data: {
      newPost,
    },
  });
});

// Get paginated posts
exports.getPaginated = catchAsync(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 9;
  const skip = (page - 1) * limit;
  
  const counter = await PostCounter.findOne();
  const totalPosts = counter ? counter.count : 0;
  const pageCount = Math.ceil(totalPosts / limit)

  const activityList = await Post.find({})
    .skip(skip)
    .limit(limit)
    .populate("comments");

  res.status(200).json({
    status: "success",
    activityList,
    page,
    totalPosts,
    pageCount,
  });
});

// Get post by id
exports.getPostById = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id).populate({
    path: "comments",
    populate: { path: "userId" },
  });

  if (!post) {
    return res.status(404).json({
      status: "fail",
      message: "Post not found",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      post,
    },
  });
});

// Add comment
exports.addComment = catchAsync(async (req, res, next) => {
  // Create a comment document
  const newComment = await Comment.create({
    text: req.body.text,
    postId: req.body.postId,
    userId: req.body.userId,
  });

  // Find the post which the comment belongs to
  const post = await Post.findById(req.body.postId);

  // Add the comment's id to the comments array
  post.comments.push(newComment._id);

  // Save the updated post
  await post.save();

  res.status(200).json({
    success: true,
    post,
  });
});

// Update a post
exports.updatePost = catchAsync(async (req, res, next) => {
  updatedData = {
    title: req.body.title,
    summary: req.body.summary,
    content: req.body.content,
    cover: req.body.cover,
    images: req.body.images,
  };

  const post = await Post.findByIdAndUpdate(req.params.id, updatedData, {
    new: true,
  });

  if (!post) {
    res.status(404).json({ message: "Post not found" });
  } else {
    res.status(200).json({
      message: "post updated successfully",
      data: {
        post,
      },
    });
  }
});

// Delete post
exports.deletePost = catchAsync(async (req, res, next) => {
  const post = await Post.findByIdAndDelete(req.params.id);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  try {
    await PostCounter.findOneAndUpdate(
      {},
      { $inc: { count: -1 } },
      { upsert: true, new: true }
    );
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }

  res.status(204).json({ message: "Post deleted successfully" });
});
