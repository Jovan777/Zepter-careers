const Company = require("../../models/Company");

const getCompanies = async (req, res) => {
    try {
        const companies = await Company.find({}).sort({ name: 1 });

        return res.status(200).json(companies);
    } catch (error) {
        console.error("Greška u getCompanies:", error);
        return res.status(500).json({
            message: "Greška pri dohvatanju kompanija.",
            error: error.message,
        });
    }
};

const getCompanyById = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);

        if (!company) {
            return res.status(404).json({
                message: "Kompanija nije pronađena.",
            });
        }

        return res.status(200).json(company);
    } catch (error) {
        console.error("Greška u getCompanyById:", error);
        return res.status(500).json({
            message: "Greška pri dohvatanju kompanije.",
            error: error.message,
        });
    }
};

const createCompany = async (req, res) => {
    try {
        const { name, legalEntity, isActive } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Naziv kompanije je obavezan.",
            });
        }

        const company = await Company.create({
            name: name.trim(),
            legalEntity: legalEntity ? legalEntity.trim() : "",
            isActive: typeof isActive === "boolean" ? isActive : true,
        });

        return res.status(201).json({
            message: "Kompanija je uspešno kreirana.",
            company,
        });
    } catch (error) {
        console.error("Greška u createCompany:", error);
        return res.status(500).json({
            message: "Greška pri kreiranju kompanije.",
            error: error.message,
        });
    }
};

const updateCompany = async (req, res) => {
    try {
        const { name, legalEntity, isActive } = req.body;

        const company = await Company.findById(req.params.id);

        if (!company) {
            return res.status(404).json({
                message: "Kompanija nije pronađena.",
            });
        }

        if (typeof name === "string") {
            company.name = name.trim();
        }

        if (typeof legalEntity === "string") {
            company.legalEntity = legalEntity.trim();
        }

        if (typeof isActive === "boolean") {
            company.isActive = isActive;
        }

        await company.save();

        return res.status(200).json({
            message: "Kompanija je uspešno izmenjena.",
            company,
        });
    } catch (error) {
        console.error("Greška u updateCompany:", error);
        return res.status(500).json({
            message: "Greška pri izmeni kompanije.",
            error: error.message,
        });
    }
};

const deleteCompany = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);

        if (!company) {
            return res.status(404).json({
                message: "Kompanija nije pronađena.",
            });
        }

        await company.deleteOne();

        return res.status(200).json({
            message: "Kompanija je uspešno obrisana.",
        });
    } catch (error) {
        console.error("Greška u deleteCompany:", error);
        return res.status(500).json({
            message: "Greška pri brisanju kompanije.",
            error: error.message,
        });
    }
};

module.exports = {
    getCompanies,
    getCompanyById,
    createCompany,
    updateCompany,
    deleteCompany,
};
