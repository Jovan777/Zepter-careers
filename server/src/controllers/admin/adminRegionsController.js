const mongoose = require("mongoose");
const Region = require("../../models/Region");

const getRegions = async (req, res) => {
    try {
        const regions = await Region.find({})
            .populate("parentRegion", "name type")
            .sort({ type: 1, name: 1 });

        return res.status(200).json(regions);
    } catch (error) {
        console.error("Greška u getRegions:", error);
        return res.status(500).json({
            message: "Greška pri dohvatanju regiona.",
            error: error.message,
        });
    }
};

const getRegionById = async (req, res) => {
    try {
        const region = await Region.findById(req.params.id).populate("parentRegion", "name type");

        if (!region) {
            return res.status(404).json({
                message: "Region nije pronađen.",
            });
        }

        return res.status(200).json(region);
    } catch (error) {
        console.error("Greška u getRegionById:", error);
        return res.status(500).json({
            message: "Greška pri dohvatanju regiona.",
            error: error.message,
        });
    }
};

const createRegion = async (req, res) => {
    try {
        const { type, name, isoCode, parentRegion, isActive } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Naziv regiona je obavezan.",
            });
        }

        if (parentRegion && !mongoose.Types.ObjectId.isValid(parentRegion)) {
            return res.status(400).json({
                message: "Prosleđeni parentRegion nije validan.",
            });
        }

        const region = await Region.create({
            type: type || "country",
            name: name.trim(),
            isoCode: isoCode ? isoCode.trim() : "",
            parentRegion: parentRegion || null,
            isActive: typeof isActive === "boolean" ? isActive : true,
        });

        return res.status(201).json({
            message: "Region je uspešno kreiran.",
            region,
        });
    } catch (error) {
        console.error("Greška u createRegion:", error);
        return res.status(500).json({
            message: "Greška pri kreiranju regiona.",
            error: error.message,
        });
    }
};

const updateRegion = async (req, res) => {
    try {
        const { type, name, isoCode, parentRegion, isActive } = req.body;

        const region = await Region.findById(req.params.id);

        if (!region) {
            return res.status(404).json({
                message: "Region nije pronađen.",
            });
        }

        if (parentRegion && !mongoose.Types.ObjectId.isValid(parentRegion)) {
            return res.status(400).json({
                message: "Prosleđeni parentRegion nije validan.",
            });
        }

        if (typeof type === "string") {
            region.type = type;
        }

        if (typeof name === "string") {
            region.name = name.trim();
        }

        if (typeof isoCode === "string") {
            region.isoCode = isoCode.trim();
        }

        if (parentRegion === null || parentRegion === "") {
            region.parentRegion = null;
        } else if (parentRegion) {
            region.parentRegion = parentRegion;
        }

        if (typeof isActive === "boolean") {
            region.isActive = isActive;
        }

        await region.save();

        return res.status(200).json({
            message: "Region je uspešno izmenjen.",
            region,
        });
    } catch (error) {
        console.error("Greška u updateRegion:", error);
        return res.status(500).json({
            message: "Greška pri izmeni regiona.",
            error: error.message,
        });
    }
};

const deleteRegion = async (req, res) => {
    try {
        const region = await Region.findById(req.params.id);

        if (!region) {
            return res.status(404).json({
                message: "Region nije pronađen.",
            });
        }

        await region.deleteOne();

        return res.status(200).json({
            message: "Region je uspešno obrisan.",
        });
    } catch (error) {
        console.error("Greška u deleteRegion:", error);
        return res.status(500).json({
            message: "Greška pri brisanju regiona.",
            error: error.message,
        });
    }
};

module.exports = {
    getRegions,
    getRegionById,
    createRegion,
    updateRegion,
    deleteRegion,
};