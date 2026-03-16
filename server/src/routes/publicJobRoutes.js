const express = require("express");
const {
  getPublishedJobs,
  getJobById,
} = require("../controllers/publicJobController");

const router = express.Router();

router.get("/", getPublishedJobs);
router.get("/:id", getJobById);

module.exports = router;