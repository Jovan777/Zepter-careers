const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server pokrenut i radi!");
});

app.use("/api/jobs", require("./routes/publicJobRoutes"));
app.use("/api/applications", require("./routes/applicationRoutes"));

app.use("/api/admin/auth", require("./routes/admin/adminAuthRoutes"));
app.use("/api/admin/dashboard", require("./routes/admin/adminDashboardRoutes"));
app.use("/api/admin/companies", require("./routes/admin/adminCompaniesRoutes"));
app.use("/api/admin/regions", require("./routes/admin/adminRegionsRoutes"));
app.use("/api/admin/presences", require("./routes/admin/adminPresencesRoutes"));
app.use("/api/admin/jobs", require("./routes/admin/adminJobsRoutes"));
app.use("/api/admin/translations", require("./routes/admin/adminTranslationsRoutes"));

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server pokrenut na portu ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Greška pri povezivanju na MongoDB:", error.message);
  });