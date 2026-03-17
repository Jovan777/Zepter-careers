const mongoose = require("mongoose");
const Presence = require("../../models/Presence");
const Company = require("../../models/Company");
const Region = require("../../models/Region");

const getPresences = async (req, res) => {
    try {
        const presences = await Presence.find({})
            .populate("company", "name")
            .populate("region", "name isoCode type")
            .sort({ createdAt: -1 });

        return res.status(200).json(presences);
    } catch (error) {
        console.error("Greška u getPresences:", error);
        return res.status(500).json({
            message: "Greška pri dohvatanju prisustava.",
            error: error.message,
        });
    }
};

const getPresenceById = async (req, res) => {
    try {
        const presence = await Presence.findById(req.params.id)
            .populate("company", "name")
            .populate("region", "name isoCode type");

        if (!presence) {
            return res.status(404).json({
                message: "Presence nije pronađen.",
            });
        }

        return res.status(200).json(presence);
    } catch (error) {
        console.error("Greška u getPresenceById:", error);
        return res.status(500).json({
            message: "Greška pri dohvatanju presence zapisa.",
            error: error.message,
        });
    }
};

const createPresence = async (req, res) => {
    try {
        const { company, region, isActive } = req.body;

        if (!company || !region) {
            return res.status(400).json({
                message: "company i region su obavezni.",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(company) || !mongoose.Types.ObjectId.isValid(region)) {
            return res.status(400).json({
                message: "company ili region nisu validni ObjectId.",
            });
        }

        const existingCompany = await Company.findById(company);
        const existingRegion = await Region.findById(region);

        if (!existingCompany || !existingRegion) {
            return res.status(404).json({
                message: "Kompanija ili region ne postoje.",
            });
        }

        const existingPresence = await Presence.findOne({ company, region });

        if (existingPresence) {
            return res.status(409).json({
                message: "Presence za ovu company-region kombinaciju već postoji.",
            });
        }

        const presence = await Presence.create({
            company,
            region,
            isActive: typeof isActive === "boolean" ? isActive : true,
        });

        return res.status(201).json({
            message: "Presence je uspešno kreiran.",
            presence,
        });
    } catch (error) {
        console.error("Greška u createPresence:", error);
        return res.status(500).json({
            message: "Greška pri kreiranju presence zapisa.",
            error: error.message,
        });
    }
};

const updatePresence = async (req, res) => {
    try {
        const { company, region, isActive } = req.body;

        const presence = await Presence.findById(req.params.id);

        if (!presence) {
            return res.status(404).json({
                message: "Presence nije pronađen.",
            });
        }

        const nextCompany = company || presence.company.toString();
        const nextRegion = region || presence.region.toString();

        if (
            !mongoose.Types.ObjectId.isValid(nextCompany) ||
            !mongoose.Types.ObjectId.isValid(nextRegion)
        ) {
            return res.status(400).json({
                message: "company ili region nisu validni ObjectId.",
            });
        }

        const duplicatePresence = await Presence.findOne({
            company: nextCompany,
            region: nextRegion,
            _id: { $ne: presence._id },
        });

        if (duplicatePresence) {
            return res.status(409).json({
                message: "Već postoji drugi presence sa istom company-region kombinacijom.",
            });
        }

        presence.company = nextCompany;
        presence.region = nextRegion;

        if (typeof isActive === "boolean") {
            presence.isActive = isActive;
        }

        await presence.save();

        return res.status(200).json({
            message: "Presence je uspešno izmenjen.",
            presence,
        });
    } catch (error) {
        console.error("Greška u updatePresence:", error);
        return res.status(500).json({
            message: "Greška pri izmeni presence zapisa.",
            error: error.message,
        });
    }
};

const deletePresence = async (req, res) => {
    try {
        const presence = await Presence.findById(req.params.id);

        if (!presence) {
            return res.status(404).json({
                message: "Presence nije pronađen.",
            });
        }

        await presence.deleteOne();

        return res.status(200).json({
            message: "Presence je uspešno obrisan.",
        });
    } catch (error) {
        console.error("Greška u deletePresence:", error);
        return res.status(500).json({
            message: "Greška pri brisanju presence zapisa.",
            error: error.message,
        });
    }
};

module.exports = {
    getPresences,
    getPresenceById,
    createPresence,
    updatePresence,
    deletePresence,
};