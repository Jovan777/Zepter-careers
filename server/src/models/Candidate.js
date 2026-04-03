const mongoose = require("mongoose");

const candidateDocumentSchema = new mongoose.Schema(
  {
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
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const candidateSchema = new mongoose.Schema(
  {
    publicId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
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
      unique: true,
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
    },
    city: {
      type: String,
      default: "",
      trim: true,
    },
    documents: {
      type: [candidateDocumentSchema],
      default: [],
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
  },
  {
    timestamps: true,
    collection: "candidates",
  }
);

module.exports = mongoose.model("Candidate", candidateSchema);