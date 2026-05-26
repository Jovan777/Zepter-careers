const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed."));
    }

    return cb(null, true);
  },
});

const uploadPdf = (req, res, next) => {
  upload.single("pdf")(req, res, (error) => {
    if (!error) {
      return next();
    }

    if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "PDF file must be 10MB or smaller.",
      });
    }

    return res.status(400).json({
      message: error.message || "Invalid PDF upload.",
    });
  });
};

module.exports = uploadPdf;
