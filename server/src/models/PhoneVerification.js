const mongoose = require("mongoose");

const PHONE_VERIFICATION_PURPOSES = ["job_alert", "application", "signup"];

const phoneVerificationSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    purpose: {
      type: String,
      enum: PHONE_VERIFICATION_PURPOSES,
      default: "job_alert",
      index: true,
    },
    otpCodeHash: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    attemptCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    maxAttempts: {
      type: Number,
      default: 5,
      min: 1,
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
    collection: "phoneVerifications",
  }
);

phoneVerificationSchema.index({ phone: 1, purpose: 1, createdAt: -1 });

module.exports = mongoose.model("PhoneVerification", phoneVerificationSchema);