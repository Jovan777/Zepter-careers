const express = require("express");
const {
  getPublishedJobs,
  getJobById,
  getJobFilters,
} = require("../controllers/publicJobController");

const router = express.Router();

router.get("/filters", getJobFilters);
router.get("/", getPublishedJobs);
router.get("/:publicId", getJobById);

module.exports = router;