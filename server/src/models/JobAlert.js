const mongoose = require("mongoose");

const jobAlertSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    keyword: {
      type: String,
      default: "",
      trim: true,
    },
    locale: {
      type: String,
      default: "en",
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    unsubscribeToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    lastSentAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "jobAlerts",
  }
);

jobAlertSchema.index({ email: 1, keyword: 1, locale: 1 }, { unique: true });

module.exports = mongoose.model("JobAlert", jobAlertSchema);