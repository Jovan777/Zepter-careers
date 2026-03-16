const mongoose = require("mongoose");

const schedulerEventSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      index: true,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["screening", "interview", "meeting"],
      default: "interview",
      index: true,
    },
    startAt: {
      type: Date,
      required: true,
      index: true,
    },
    endAt: {
      type: Date,
      required: true,
    },
    timezone: {
      type: String,
      default: "Europe/Belgrade",
      trim: true,
    },
    locationOrLink: {
      type: String,
      default: "",
      trim: true,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true, 
    collection: "schedulerEvents"
  }
);

schedulerEventSchema.index({ application: 1, startAt: 1 });

module.exports = mongoose.model("SchedulerEvent", schedulerEventSchema);