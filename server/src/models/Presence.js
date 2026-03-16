const mongoose = require("mongoose");

const presenceSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    region: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Region",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true, 
    collection: "presences"
   }
);

presenceSchema.index({ company: 1, region: 1 }, { unique: true });

module.exports = mongoose.model("Presence", presenceSchema);