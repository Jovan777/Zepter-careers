const mongoose = require("mongoose");
const SchedulerEvent = require("../../models/SchedulerEvent");
const Application = require("../../models/Application");
const Candidate = require("../../models/Candidate");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const getSchedulerEvents = async (req, res) => {
  try {
    const events = await SchedulerEvent.find({})
      .populate("candidate", "firstName lastName email")
      .populate("application", "status")
      .sort({ startAt: 1 });

    return res.status(200).json({
      events,
    });
  } catch (error) {
    console.error("Greška u getSchedulerEvents:", error);
    return res.status(500).json({
      message: "Greška pri dohvatanju scheduler događaja.",
      error: error.message,
    });
  }
};

const getSchedulerEventById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: "Scheduler event id nije validan.",
      });
    }

    const event = await SchedulerEvent.findById(id)
      .populate("candidate", "firstName lastName email")
      .populate("application", "status");

    if (!event) {
      return res.status(404).json({
        message: "Scheduler event nije pronađen.",
      });
    }

    return res.status(200).json({
      event,
    });
  } catch (error) {
    console.error("Greška u getSchedulerEventById:", error);
    return res.status(500).json({
      message: "Greška pri dohvatanju scheduler event detalja.",
      error: error.message,
    });
  }
};

const createSchedulerEvent = async (req, res) => {
  try {
    const {
      application,
      type,
      startAt,
      endAt,
      timezone,
      locationOrLink,
      notes,
    } = req.body;

    if (!application || !isValidObjectId(application)) {
      return res.status(400).json({
        message: "application je obavezan i mora biti validan ObjectId.",
      });
    }

    if (!startAt || !endAt) {
      return res.status(400).json({
        message: "startAt i endAt su obavezni.",
      });
    }

    const existingApplication = await Application.findById(application).populate(
      "candidate",
      "firstName lastName email"
    );

    if (!existingApplication) {
      return res.status(404).json({
        message: "Application nije pronađen.",
      });
    }

    const event = await SchedulerEvent.create({
      application: existingApplication._id,
      candidate: existingApplication.candidate._id,
      type: type || "interview",
      startAt,
      endAt,
      timezone: timezone || "Europe/Belgrade",
      locationOrLink: locationOrLink ? String(locationOrLink).trim() : "",
      notes: notes ? String(notes).trim() : "",
    });

    const populated = await SchedulerEvent.findById(event._id)
      .populate("candidate", "firstName lastName email")
      .populate("application", "status");

    return res.status(201).json({
      message: "Scheduler događaj je uspešno kreiran.",
      event: populated,
    });
  } catch (error) {
    console.error("Greška u createSchedulerEvent:", error);
    return res.status(500).json({
      message: "Greška pri kreiranju scheduler događaja.",
      error: error.message,
    });
  }
};

const updateSchedulerEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      type,
      startAt,
      endAt,
      timezone,
      locationOrLink,
      notes,
    } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: "Scheduler event id nije validan.",
      });
    }

    const event = await SchedulerEvent.findById(id);

    if (!event) {
      return res.status(404).json({
        message: "Scheduler event nije pronađen.",
      });
    }

    if (typeof type === "string") {
      event.type = type;
    }

    if (startAt !== undefined) {
      event.startAt = startAt;
    }

    if (endAt !== undefined) {
      event.endAt = endAt;
    }

    if (typeof timezone === "string") {
      event.timezone = timezone.trim();
    }

    if (typeof locationOrLink === "string") {
      event.locationOrLink = locationOrLink.trim();
    }

    if (typeof notes === "string") {
      event.notes = notes.trim();
    }

    await event.save();

    const populated = await SchedulerEvent.findById(event._id)
      .populate("candidate", "firstName lastName email")
      .populate("application", "status");

    return res.status(200).json({
      message: "Scheduler događaj je uspešno izmenjen.",
      event: populated,
    });
  } catch (error) {
    console.error("Greška u updateSchedulerEvent:", error);
    return res.status(500).json({
      message: "Greška pri izmeni scheduler događaja.",
      error: error.message,
    });
  }
};

const deleteSchedulerEvent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: "Scheduler event id nije validan.",
      });
    }

    const event = await SchedulerEvent.findById(id);

    if (!event) {
      return res.status(404).json({
        message: "Scheduler event nije pronađen.",
      });
    }

    await event.deleteOne();

    return res.status(200).json({
      message: "Scheduler događaj je uspešno obrisan.",
    });
  } catch (error) {
    console.error("Greška u deleteSchedulerEvent:", error);
    return res.status(500).json({
      message: "Greška pri brisanju scheduler događaja.",
      error: error.message,
    });
  }
};

module.exports = {
  getSchedulerEvents,
  getSchedulerEventById,
  createSchedulerEvent,
  updateSchedulerEvent,
  deleteSchedulerEvent,
};