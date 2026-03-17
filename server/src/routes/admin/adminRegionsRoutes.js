const express = require("express");
const adminAuthMiddleware = require("../../middlewares/adminAuthMiddleware");
const {
  getRegions,
  getRegionById,
  createRegion,
  updateRegion,
  deleteRegion,
} = require("../../controllers/admin/adminRegionsController");

const router = express.Router();

router.use(adminAuthMiddleware);

router.get("/", getRegions);
router.get("/:id", getRegionById);
router.post("/", createRegion);
router.put("/:id", updateRegion);
router.delete("/:id", deleteRegion);

module.exports = router;