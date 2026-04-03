const crypto = require("crypto");
const JobAlert = require("../models/JobAlert");

const normalizeLocale = (locale) => {
  return locale && String(locale).trim() ? String(locale).trim() : "en";
};

const normalizeValue = (value) => {
  return value ? String(value).trim() : "";
};

const normalizeBoolean = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized === "true" || normalized === "1" || normalized === "yes" || normalized === "on";
  }
  return false;
};

const subscribeToJobAlerts = async (req, res) => {
  try {
    const {
      email,
      keyword,
      locale,
      workArea,
      locationType,
      city,
      acceptedTerms,
      marketingConsent,
    } = req.body;

    if (!email || !String(email).trim()) {
      return res.status(400).json({
        message: "Email je obavezan.",
      });
    }

    const acceptedTermsValue = normalizeBoolean(acceptedTerms);
    if (!acceptedTermsValue) {
      return res.status(400).json({
        message: "Prihvatanje uslova korišćenja je obavezno.",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedKeyword = normalizeValue(keyword);
    const normalizedLocale = normalizeLocale(locale);
    const normalizedWorkArea = normalizeValue(workArea);
    const normalizedLocationType = normalizeValue(locationType);
    const normalizedCity =
      normalizedLocationType === "remote" ? "" : normalizeValue(city);

    let existingAlert = await JobAlert.findOne({
      email: normalizedEmail,
      keyword: normalizedKeyword,
      locale: normalizedLocale,
      workArea: normalizedWorkArea,
      locationType: normalizedLocationType,
      city: normalizedCity,
    });

    if (existingAlert) {
      existingAlert.isActive = true;
      existingAlert.acceptedTerms = true;
      existingAlert.acceptedTermsAt = existingAlert.acceptedTermsAt || new Date();
      existingAlert.marketingConsent = normalizeBoolean(marketingConsent);

      await existingAlert.save();

      return res.status(200).json({
        message: "Pretplata je već postojala i sada je aktivna.",
        alert: {
          email: existingAlert.email,
          keyword: existingAlert.keyword,
          locale: existingAlert.locale,
          workArea: existingAlert.workArea,
          locationType: existingAlert.locationType,
          city: existingAlert.city,
          isActive: existingAlert.isActive,
        },
      });
    }

    const unsubscribeToken = crypto.randomBytes(24).toString("hex");

    const alert = await JobAlert.create({
      email: normalizedEmail,
      keyword: normalizedKeyword,
      locale: normalizedLocale,
      workArea: normalizedWorkArea,
      locationType: normalizedLocationType,
      city: normalizedCity,
      acceptedTerms: true,
      acceptedTermsAt: new Date(),
      marketingConsent: normalizeBoolean(marketingConsent),
      isVerified: false,
      isActive: true,
      unsubscribeToken,
    });

    return res.status(201).json({
      message: "Uspešno ste prijavljeni na job alerts.",
      alert: {
        email: alert.email,
        keyword: alert.keyword,
        locale: alert.locale,
        workArea: alert.workArea,
        locationType: alert.locationType,
        city: alert.city,
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
    const unsubscribeToken = req.body?.unsubscribeToken || req.query?.token || "";

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