const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  publicId: { type: String, required: true, unique: true, index: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true, index: true },

  // ostaviti postojeći region zbog kompatibilnosti
  region: { type: mongoose.Schema.Types.ObjectId, ref: "Region", required: true, index: true },

  // novo
  workArea: {
    type: String,
    default: "",
    trim: true,
    index: true,
  },
  employmentType: {
    type: String,
    enum: ["full_time", "part_time", "contract", "internship", "temporary", ""],
    default: "",
    index: true,
  },
  locationType: {
    type: String,
    enum: ["onsite", "remote", "hybrid"],
    default: "onsite",
    index: true,
  },

  status: {
    type: String,
    enum: ["draft", "published", "closed"],
    default: "draft",
    index: true,
  },
  publishStartAt: { type: Date, default: null },
  publishEndAt: { type: Date, default: null },
  notes: { type: String, default: "", trim: true },
  appliedCount: { type: Number, default: 0, min: 0 },
}, { timestamps: true, collection: "jobs" });

jobSchema.index({ status: 1, publishStartAt: -1 });
jobSchema.index({ company: 1, region: 1 });

module.exports = mongoose.model("Job", jobSchema);