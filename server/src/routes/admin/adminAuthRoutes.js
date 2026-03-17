const express = require("express");
const {
  loginAdmin,
  getCurrentAdmin,
  logoutAdmin,
} = require("../../controllers/admin/adminAuthController");
const adminAuthMiddleware = require("../../middlewares/adminAuthMiddleware");

const router = express.Router();

router.post("/login", loginAdmin);
router.post("/logout", adminAuthMiddleware, logoutAdmin);
router.get("/me", adminAuthMiddleware, getCurrentAdmin);

module.exports = router;