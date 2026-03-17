const mongoose = require("mongoose");
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
        ...docs.map((item) => Number.parseInt(item.publicId, 10)).filter((n) => !Number.isNaN(n))
    );

    return String(maxValue + 1);
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


        const job = await Job.findOne({
            publicId: normalizedJobId,
            status: "published",
        });

        if (!job) {
            return res.status(404).json({
                message: "Posao nije pronađen ili nije objavljen.",
            });
        }

        let candidate = await Candidate.findOne({
            email: normalizedEmail,
        });

        if (!candidate) {
            const nextCandidatePublicId = await getNextNumericPublicId(Candidate);

            candidate = await Candidate.create({
                publicId: nextCandidatePublicId,
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

        const nextApplicationPublicId = await getNextNumericPublicId(Application);

        const application = await Application.create({
            publicId: nextApplicationPublicId,
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
                publicId: application.publicId,
                candidate: candidate._id,
                candidatePublicId: candidate.publicId,
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