const express = require("express");
const { submitApplication } = require("../controllers/applicationController");
const uploadCv = require("../middlewares/cvUploadMiddleware");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "Applications ruta radi. Za slanje prijave koristi POST /api/applications",
  });
});

router.post("/", uploadCv.single("cv"), submitApplication);

module.exports = router;