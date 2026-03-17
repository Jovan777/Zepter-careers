const mongoose = require("mongoose");

const applicationEventSchema = new mongoose.Schema(
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

const applicationSchema = new mongoose.Schema(
  {
    publicId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
      index: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: [
        "new",
        "screening",
        "interview",
        "offer",
        "onboarding",
        "hired",
        "rejected",
        "withdrawn",
        "archived",
      ],
      default: "new",
      index: true,
    },
    reason: {
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
    events: {
      type: [applicationEventSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: "applications",
  }
);

applicationSchema.index({ candidate: 1, job: 1 });
applicationSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Application", applicationSchema);