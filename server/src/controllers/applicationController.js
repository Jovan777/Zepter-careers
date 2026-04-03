const Candidate = require("../models/Candidate");
const Application = require("../models/Application");
const Job = require("../models/Job");

const getNextNumericPublicId = async (Model) => {
  const docs = await Model.find({
    publicId: { $regex: "^[0-9]+$" },
  }).select("publicId");

  if (!docs.length) {
    return "1";
  }

  const maxValue = Math.max(
    ...docs
      .map((item) => Number.parseInt(item.publicId, 10))
      .filter((n) => !Number.isNaN(n))
  );

  return String(maxValue + 1);
};

const normalizeBoolean = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized === "true" || normalized === "1" || normalized === "yes" || normalized === "on";
  }
  return false;
};

const submitApplication = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      country,
      city,
      jobPublicId,
      coverLetter,
      acceptedTerms,
      marketingConsent,
      locale,
    } = req.body;

    if (!firstName || !lastName || !email || !jobPublicId) {
      return res.status(400).json({
        message: "firstName, lastName, email i jobPublicId su obavezni.",
      });
    }

    const acceptedTermsValue = normalizeBoolean(acceptedTerms);
    const marketingConsentValue = normalizeBoolean(marketingConsent);

    if (!acceptedTermsValue) {
      return res.status(400).json({
        message: "Prihvatanje uslova korišćenja je obavezno.",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedJobPublicId = String(jobPublicId).trim();

    const job = await Job.findOne({
      publicId: normalizedJobPublicId,
      status: "published",
    });

    if (!job) {
      return res.status(404).json({
        message: "Posao nije pronađen ili nije objavljen.",
      });
    }

    const cvFile = req.files?.cv?.[0] || null;
    if (!cvFile) {
      return res.status(400).json({
        message: "CV je obavezan.",
      });
    }

    const extraFiles = req.files?.extraFiles || [];

    const cvDocument = {
      fileName: cvFile.filename,
      fileUrl: `/uploads/applications/${cvFile.filename}`,
    };

    const extraDocuments = extraFiles.map((file) => ({
      fileName: file.filename,
      fileUrl: `/uploads/applications/${file.filename}`,
      category: "other",
      uploadedAt: new Date(),
    }));

    let candidate = await Candidate.findOne({
      email: normalizedEmail,
    });

    const now = new Date();

    if (!candidate) {
      const nextCandidatePublicId = await getNextNumericPublicId(Candidate);

      candidate = await Candidate.create({
        publicId: nextCandidatePublicId,
        firstName: String(firstName).trim(),
        lastName: String(lastName).trim(),
        email: normalizedEmail,
        phone: phone ? String(phone).trim() : "",
        country: country ? String(country).trim() : "",
        city: city ? String(city).trim() : "",
        documents: [
          {
            fileName: cvDocument.fileName,
            fileUrl: cvDocument.fileUrl,
            uploadedAt: now,
          },
          ...extraDocuments.map((doc) => ({
            fileName: doc.fileName,
            fileUrl: doc.fileUrl,
            uploadedAt: doc.uploadedAt,
          })),
        ],
        acceptedTerms: acceptedTermsValue,
        acceptedTermsAt: acceptedTermsValue ? now : null,
        marketingConsent: marketingConsentValue,
      });
    } else {
      candidate.firstName = String(firstName).trim();
      candidate.lastName = String(lastName).trim();
      candidate.phone = phone ? String(phone).trim() : candidate.phone;
      candidate.country = country ? String(country).trim() : candidate.country;
      candidate.city = city ? String(city).trim() : candidate.city;
      candidate.acceptedTerms = acceptedTermsValue;
      candidate.acceptedTermsAt = acceptedTermsValue ? (candidate.acceptedTermsAt || now) : null;
      candidate.marketingConsent = marketingConsentValue;

      candidate.documents.push({
        fileName: cvDocument.fileName,
        fileUrl: cvDocument.fileUrl,
        uploadedAt: now,
      });

      extraDocuments.forEach((doc) => {
        candidate.documents.push({
          fileName: doc.fileName,
          fileUrl: doc.fileUrl,
          uploadedAt: doc.uploadedAt,
        });
      });

      await candidate.save();
    }

    const nextApplicationPublicId = await getNextNumericPublicId(Application);

    const application = await Application.create({
      publicId: nextApplicationPublicId,
      candidate: candidate._id,
      job: job._id,
      status: "new",
      reason: "",
      cvDocument,
      extraDocuments,
      coverLetter: coverLetter ? String(coverLetter).trim() : "",
      acceptedTerms: acceptedTermsValue,
      acceptedTermsAt: acceptedTermsValue ? now : null,
      marketingConsent: marketingConsentValue,
      sourceLocale: locale ? String(locale).trim() : "sr",
      events: [
        {
          type: "created",
          timestamp: now,
          data: {
            cvUrl: cvDocument.fileUrl,
            extraDocumentsCount: extraDocuments.length,
            sourceLocale: locale ? String(locale).trim() : "sr",
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
        publicId: application.publicId,
        candidate: candidate._id,
        candidatePublicId: candidate.publicId,
        job: job._id,
        jobPublicId: job.publicId,
        status: application.status,
        cvDocument: application.cvDocument,
        extraDocuments: application.extraDocuments,
        coverLetter: application.coverLetter,
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