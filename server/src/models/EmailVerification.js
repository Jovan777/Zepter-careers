const mongoose = require("mongoose");

const EMAIL_VERIFICATION_PURPOSES = ["job_alert", "application", "signup"];

const emailVerificationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    purpose: {
      type: String,
      enum: EMAIL_VERIFICATION_PURPOSES,
      default: "job_alert",
      index: true,
    },
    tokenHash: {
      type: String,
      required: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    resendCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastSentAt: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "emailVerifications",
  }
);

emailVerificationSchema.index({ email: 1, purpose: 1, createdAt: -1 });

module.exports = mongoose.model("EmailVerification", emailVerificationSchema);