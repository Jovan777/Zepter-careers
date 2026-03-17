const express = require("express");
const { getDashboardStats } = require("../../controllers/admin/adminDashboardController");
const adminAuthMiddleware = require("../../middlewares/adminAuthMiddleware");

const router = express.Router();

router.get("/", adminAuthMiddleware, getDashboardStats);

module.exports = router;