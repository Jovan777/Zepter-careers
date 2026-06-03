const mongoose = require("mongoose");

const TALENT_POOL_AREA_OF_INTEREST = [
  "sales",
  "marketing",
  "it",
  "finance",
  "hr",
  "management",
  "administration",
  "logistics",
  "legal",
  "customer_support",
  "other",
];

const TALENT_POOL_STATUSES = [
  "new",
  "reviewed",
  "contacted",
  "interview",
  "talent_pool",
  "rejected",
  "archived",
];

const talentPoolEventSchema = new mongoose.Schema(
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

const talentPoolApplicationSchema = new mongoose.Schema(
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
    areaOfInterest: {
      type: String,
      required: true,
      enum: TALENT_POOL_AREA_OF_INTEREST,
      index: true,
    },
    message: {
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
    sourceLocale: {
      type: String,
      default: "sr",
      trim: true,
    },
    status: {
      type: String,
      enum: TALENT_POOL_STATUSES,
      default: "new",
      index: true,
    },
    reason: {
      type: String,
      default: "",
      trim: true,
    },
    events: {
      type: [talentPoolEventSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: "talentPoolApplications",
  }
);

talentPoolApplicationSchema.index({ createdAt: -1 });
talentPoolApplicationSchema.index({ areaOfInterest: 1, status: 1 });

module.exports = mongoose.model(
  "TalentPoolApplication",
  talentPoolApplicationSchema
);
module.exports.TALENT_POOL_AREA_OF_INTEREST = TALENT_POOL_AREA_OF_INTEREST;
module.exports.TALENT_POOL_STATUSES = TALENT_POOL_STATUSES;
