const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const adminAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    console.log("AUTH HEADER:", authHeader);

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Nedostaje Bearer token.",
      });
    }

    const token = authHeader.split(" ")[1];
    console.log("TOKEN:", token);

    if (!token) {
      return res.status(401).json({
        message: "Token nije prosleđen.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("DECODED TOKEN:", decoded);

    const admin = await Admin.findById(decoded.adminId);
    console.log("ADMIN FROM DB:", admin);

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
    console.error("ADMIN AUTH ERROR:", error);

    return res.status(401).json({
      message: "Neispravan ili istekao token.",
    });
  }
};

module.exports = adminAuthMiddleware;