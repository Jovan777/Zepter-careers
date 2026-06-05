const mongoose = require("mongoose");

const SALES_CONSULTANT_APPLICATION_STATUSES = [
  "new",
  "contacted",
  "in_progress",
  "accepted",
  "rejected",
  "archived",
];

const salesConsultantEventSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { _id: false }
);

const salesConsultantApplicationSchema = new mongoose.Schema(
  {
    publicId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    country: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },
    city: {
      type: String,
      default: "",
      trim: true,
    },
    message: {
      type: String,
      default: "",
      trim: true,
    },
    motivation: {
      type: String,
      default: "",
      trim: true,
    },
    cvDocument: {
      fileName: {
        type: String,
        default: "",
        trim: true,
      },
      fileUrl: {
        type: String,
        default: "",
        trim: true,
      },
    },
    acceptedTerms: {
      type: Boolean,
      default: false,
    },
    acceptedTermsAt: {
      type: Date,
      default: null,
    },
    marketingConsent: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: SALES_CONSULTANT_APPLICATION_STATUSES,
      default: "new",
      index: true,
    },
    reason: {
      type: String,
      default: "",
      trim: true,
    },
    events: {
      type: [salesConsultantEventSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: "salesConsultantApplications",
  }
);

salesConsultantApplicationSchema.index({ createdAt: -1 });
salesConsultantApplicationSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model(
  "SalesConsultantApplication",
  salesConsultantApplicationSchema
);
module.exports.SALES_CONSULTANT_APPLICATION_STATUSES =
  SALES_CONSULTANT_APPLICATION_STATUSES;
