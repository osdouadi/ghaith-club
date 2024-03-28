const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A post must have a title"],
    },
    summary: {
      type: String,
      required: [true, "A post must have a summary"],
    },
    content: {
      type: String,
      required: [true, "A post must have a content"],
    },
    slug: String,
    images: [String],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    reactions: [
      {
        type: String,
        enum: ["like", "love", "flower", "sad"],
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const postCounterSchema = new mongoose.Schema({
  count: {
    type: Number,
    default: 0,
  },
});

postSchema.post("save", async function () {
  try {
    await PostCounter.findOneAndUpdate(
      {},
      { $inc: { count: 1 } },
      { upsert: true, new: true }
    );
  } catch (err) {
    console.error("Error updating PostCounter", err);
  }
});

postSchema.pre(
  "remove",
  { document: true, query: false },
  async function (next) {
    try {
      await PostCounter.findOneAndUpdate(
        {},
        { $inc: { count: -1 } },
        { upsert: true, new: true }
      );
      next();
    } catch (err) {
      console.error("Error updating PostCounter", err);
    }
  }
);

const Post = mongoose.model("Post", postSchema);
const PostCounter = mongoose.model("PostCounter", postCounterSchema);

module.exports = { Post, PostCounter };
