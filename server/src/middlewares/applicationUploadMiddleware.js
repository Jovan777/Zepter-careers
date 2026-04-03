const fs = require("fs");
const path = require("path");
const multer = require("multer");

const uploadDir = path.join(process.cwd(), "uploads", "applications");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const safeOriginal = file.originalname.replace(/\s+/g, "_");
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}-${safeOriginal}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowed = [".pdf", ".doc", ".docx"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowed.includes(ext)) {
    return cb(new Error("Dozvoljeni formati su PDF, DOC i DOCX."));
  }

  cb(null, true);
};

const uploadApplicationFiles = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 10,
  },
});

module.exports = uploadApplicationFiles;