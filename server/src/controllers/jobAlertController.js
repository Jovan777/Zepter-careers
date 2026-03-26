const crypto = require("crypto");
const JobAlert = require("../models/JobAlert");

const normalizeLocale = (locale) => {
    return locale && String(locale).trim() ? String(locale).trim() : "en";
};

const subscribeToJobAlerts = async (req, res) => {
    try {
        const { email, keyword, locale } = req.body;

        if (!email || !String(email).trim()) {
            return res.status(400).json({
                message: "Email je obavezan.",
            });
        }

        const normalizedEmail = String(email).trim().toLowerCase();
        const normalizedKeyword = keyword ? String(keyword).trim() : "";
        const normalizedLocale = normalizeLocale(locale);

        let existingAlert = await JobAlert.findOne({
            email: normalizedEmail,
            keyword: normalizedKeyword,
            locale: normalizedLocale,
        });

        if (existingAlert) {
            if (!existingAlert.isActive) {
                existingAlert.isActive = true;
                await existingAlert.save();
            }

            return res.status(200).json({
                message: "Pretplata je već postojala i sada je aktivna.",
                alert: {
                    email: existingAlert.email,
                    keyword: existingAlert.keyword,
                    locale: existingAlert.locale,
                    isActive: existingAlert.isActive,
                },
            });
        }

        const unsubscribeToken = crypto.randomBytes(24).toString("hex");

        const alert = await JobAlert.create({
            email: normalizedEmail,
            keyword: normalizedKeyword,
            locale: normalizedLocale,
            isActive: true,
            unsubscribeToken,
        });

        return res.status(201).json({
            message: "Uspešno ste prijavljeni na job alerts.",
            alert: {
                email: alert.email,
                keyword: alert.keyword,
                locale: alert.locale,
                isActive: alert.isActive,
            },
        });
    } catch (error) {
        console.error("Greška u subscribeToJobAlerts:", error);
        return res.status(500).json({
            message: "Greška pri prijavi na job alerts.",
            error: error.message,
        });
    }
};
const unsubscribeFromJobAlerts = async (req, res) => {
    try {
        const unsubscribeToken =
            req.body?.unsubscribeToken || req.query?.token || "";

        if (!unsubscribeToken || !String(unsubscribeToken).trim()) {
            return res.status(400).json({
                message: "unsubscribeToken je obavezan.",
            });
        }

        const alert = await JobAlert.findOne({
            unsubscribeToken: String(unsubscribeToken).trim(),
        });

        if (!alert) {
            return res.status(404).json({
                message: "Pretplata nije pronađena.",
            });
        }

        alert.isActive = false;
        await alert.save();

        return res.status(200).json({
            message: "Uspešno ste odjavljeni sa job alerts.",
        });
    } catch (error) {
        console.error("Greška u unsubscribeFromJobAlerts:", error);
        return res.status(500).json({
            message: "Greška pri odjavi sa job alerts.",
            error: error.message,
        });
    }
};

module.exports = {
    subscribeToJobAlerts,
    unsubscribeFromJobAlerts,
};