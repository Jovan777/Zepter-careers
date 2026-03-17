const mongoose = require("mongoose");

const SUPPORTED_LOCALES = [
  "en",
  "de-DACH",
  "sr",
  "hr",
  "pl",
  "cs",
  "it",
  "fr",
  "uk",
  "ru",
  "be",
  "sl",
];

const parseStringArray = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const normalizeLocale = (locale) => {
  return locale && String(locale).trim() ? String(locale).trim() : "en";
};

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

module.exports = {
  SUPPORTED_LOCALES,
  parseStringArray,
  normalizeLocale,
  isValidObjectId,
};