const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB povezan");
  } catch (error) {
    console.error("Greška pri povezivanju na MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;