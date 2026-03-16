const mongoose = require("mongoose");

const regionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["country", "region", "city"],
      default: "country",
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    isoCode: {
      type: String,
      default: "",
      trim: true,
    },
    parentRegion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Region",
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "regions"
  }
);

module.exports = mongoose.model("Region", regionSchema);