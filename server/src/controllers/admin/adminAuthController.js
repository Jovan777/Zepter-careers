const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../../models/Admin");

const createToken = (admin) => {
    return jwt.sign(
        {
            adminId: admin._id,
            email: admin.email,
            role: admin.role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "7d",
        }
    );
};

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email i password su obavezni.",
            });
        }

        const admin = await Admin.findOne({
            email: email.trim().toLowerCase(),
        });

        if (!admin || !admin.isActive) {
            return res.status(401).json({
                message: "Pogrešan email ili password.",
            });
        }

        let passwordOk = false;

        if (admin.passwordHash.startsWith("$2a$") || admin.passwordHash.startsWith("$2b$")) {
            passwordOk = await bcrypt.compare(password, admin.passwordHash);
        } else {
            passwordOk = password === admin.passwordHash;
        }

        if (!passwordOk) {
            return res.status(401).json({
                message: "Pogrešan email ili password.",
            });
        }

        const token = createToken(admin);

        return res.status(200).json({
            message: "Uspešna prijava.",
            token,
            admin: {
                _id: admin._id,
                email: admin.email,
                role: admin.role,
            },
        });
    } catch (error) {
        console.error("Greška u loginAdmin:", error);
        return res.status(500).json({
            message: "Greška pri prijavi admina.",
            error: error.message,
        });
    }
};

const getCurrentAdmin = async (req, res) => {
    return res.status(200).json({
        admin: req.admin,
    });
};

const logoutAdmin = async (req, res) => {
    return res.status(200).json({
        message: "Uspešno odjavljen admin.",
    });
};

module.exports = {
    loginAdmin,
    getCurrentAdmin,
    logoutAdmin,
};