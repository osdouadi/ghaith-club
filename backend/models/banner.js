const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    banner: {
      type: String,
      required: [true, "Banner field is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Banner = mongoose.model("Banner", bannerSchema);

module.exports = Banner;
