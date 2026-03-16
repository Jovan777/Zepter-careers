const express = require("express");
const { submitApplication } = require("../controllers/applicationController");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "Applications ruta radi. Za slanje prijave koristi POST /api/applications",
  });
});

router.post("/", submitApplication);

module.exports = router;