const mongoose = require("mongoose");

const jobAlertSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, trim: true, lowercase: true, index: true },
    keyword: { type: String, default: "", trim: true },
    locale: { type: String, default: "en", trim: true },

    workArea: { type: String, default: "", trim: true, index: true },
    locationType: {
      type: String,
      enum: ["remote", "specific", "hybrid", ""],
      default: "",
      index: true,
    },
    city: { type: String, default: "", trim: true, index: true },

    acceptedTerms: { type: Boolean, default: false },
    acceptedTermsAt: { type: Date, default: null },
    marketingConsent: { type: Boolean, default: false },

    isVerified: { type: Boolean, default: false, index: true },
    isActive: { type: Boolean, default: true, index: true },
    unsubscribeToken: { type: String, required: true, unique: true, index: true },
    lastSentAt: { type: Date, default: null },
  },
  { timestamps: true, collection: "jobAlerts" }
);

jobAlertSchema.pre("validate", function (next) {
  if (this.locationType === "remote") {
    this.city = "";
  }
  next();
});

jobAlertSchema.index(
  {
    email: 1,
    keyword: 1,
    locale: 1,
    workArea: 1,
    locationType: 1,
    city: 1,
  },
  { unique: true }
);

module.exports = mongoose.model("JobAlert", jobAlertSchema);