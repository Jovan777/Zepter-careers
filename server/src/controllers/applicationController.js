const mongoose = require("mongoose");
const Candidate = require("../models/Candidate");
const Application = require("../models/Application");
const Job = require("../models/Job");

const submitApplication = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      country,
      city,
      jobId,
      cvFileName,
      cvFileUrl,
    } = req.body;

    if (!firstName || !lastName || !email || !jobId) {
      return res.status(400).json({
        message: "firstName, lastName, email i jobId su obavezni.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedJobId = String(jobId).trim();

    const jobQuery = {
      status: "published",
    };

    if (mongoose.Types.ObjectId.isValid(normalizedJobId)) {
      jobQuery.$or = [
        { _id: normalizedJobId },
        { publicId: normalizedJobId },
      ];
    } else {
      jobQuery.publicId = normalizedJobId;
    }

    const job = await Job.findOne(jobQuery);

    if (!job) {
      return res.status(404).json({
        message: "Posao nije pronađen ili nije objavljen.",
      });
    }

    let candidate = await Candidate.findOne({
      email: normalizedEmail,
    });

    if (!candidate) {
      candidate = await Candidate.create({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: normalizedEmail,
        phone: phone ? phone.trim() : "",
        country: country ? country.trim() : "",
        city: city ? city.trim() : "",
        documents:
          cvFileName || cvFileUrl
            ? [
                {
                  fileName: cvFileName || "",
                  fileUrl: cvFileUrl || "",
                  uploadedAt: new Date(),
                },
              ]
            : [],
      });
    } else {
      candidate.firstName = firstName.trim();
      candidate.lastName = lastName.trim();
      candidate.phone = phone ? phone.trim() : candidate.phone;
      candidate.country = country ? country.trim() : candidate.country;
      candidate.city = city ? city.trim() : candidate.city;

      if (cvFileName || cvFileUrl) {
        candidate.documents.push({
          fileName: cvFileName || "",
          fileUrl: cvFileUrl || "",
          uploadedAt: new Date(),
        });
      }

      await candidate.save();
    }

    const application = await Application.create({
      candidate: candidate._id,
      job: job._id,
      status: "new",
      reason: "",
      cvDocument: {
        fileName: cvFileName || "",
        fileUrl: cvFileUrl || "",
      },
      events: [
        {
          type: "created",
          timestamp: new Date(),
          data: {
            cvUrl: cvFileUrl || "",
          },
        },
      ],
    });

    job.appliedCount += 1;
    await job.save();

    return res.status(201).json({
      message: "Prijava je uspešno poslata.",
      application: {
        _id: application._id,
        candidate: candidate._id,
        job: job._id,
        jobPublicId: job.publicId,
        status: application.status,
      },
    });
  } catch (error) {
    console.error("Greška u submitApplication:", error);

    return res.status(500).json({
      message: "Greška pri slanju prijave.",
      error: error.message,
    });
  }
};

module.exports = {
  submitApplication,
};