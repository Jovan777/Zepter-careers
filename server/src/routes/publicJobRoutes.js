const express = require("express");
const {
  getPublishedJobs,
  getJobById,
} = require("../controllers/publicJobController");

const router = express.Router();

router.get("/", getPublishedJobs);
router.get("/:publicId", getJobById);

module.exports = router;