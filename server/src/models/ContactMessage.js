const mongoose = require("mongoose");

const CONTACT_MESSAGE_STATUSES = ["new", "read", "answered", "archived"];

const contactMessageSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      default: "",
      trim: true,
    },
    lastName: {
      type: String,
      default: "",
      trim: true,
    },
    fullName: {
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
    countryLabel: {
      type: String,
      default: "",
      trim: true,
    },
    reason: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },
    reasonLabel: {
      type: String,
      default: "",
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    sourcePage: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: CONTACT_MESSAGE_STATUSES,
      default: "new",
      index: true,
    },
    readAt: {
      type: Date,
      default: null,
    },
    answeredAt: {
      type: Date,
      default: null,
    },
    adminNote: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: "contactMessages",
  }
);

contactMessageSchema.index({ createdAt: -1 });
contactMessageSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("ContactMessage", contactMessageSchema);
module.exports.CONTACT_MESSAGE_STATUSES = CONTACT_MESSAGE_STATUSES;
