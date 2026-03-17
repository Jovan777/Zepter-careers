const mongoose = require("mongoose");

const jobTranslationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },
    locale: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    locationOrLink: {
      type: String,
      default: "",
      trim: true,
    },
    whyThisPosition: {
      type: String,
      default: "",
      trim: true,
    },
    aboutZepter: {
      type: String,
      default: "",
      trim: true,
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    requirements: {
      type: [String],
      default: [],
    },
    whatZepterOffers: {
      type: [String],
      default: [],
    },
    applyLabel: {
      type: String,
      default: "Apply",
      trim: true,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: "jobTranslations",
  }
);

jobTranslationSchema.index({ job: 1, locale: 1 }, { unique: true });

module.exports = mongoose.model("JobTranslation", jobTranslationSchema);