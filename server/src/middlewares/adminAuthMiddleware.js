const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const adminAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Nedostaje Bearer token.",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Token nije prosleđen.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(decoded.adminId);

    if (!admin || !admin.isActive) {
      return res.status(401).json({
        message: "Admin nije pronađen ili nije aktivan.",
      });
    }

    req.admin = {
      _id: admin._id,
      email: admin.email,
      role: admin.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Neispravan ili istekao token.",
    });
  }
};

module.exports = adminAuthMiddleware;