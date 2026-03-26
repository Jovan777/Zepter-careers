const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");
const {verifyMailer} = require("./services/mailer");

dotenv.config();
console.log("MAILTRAP_API_TOKEN:", process.env.MAILTRAP_API_TOKEN);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
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

app.use("/api/admin/applications", require("./routes/admin/adminApplicationsRoutes"));
app.use("/api/admin/candidates", require("./routes/admin/adminCandidatesRoutes"));
app.use("/api/admin/scheduler", require("./routes/admin/adminSchedulerRoutes"));

app.use("/api/job-alerts", require("./routes/jobAlertRoutes"));

app.use("/api/phone-verification", require("./routes/phoneVerificationRoutes"));
app.use("/api/email-verification", require("./routes/emailVerificationRoutes"));

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server pokrenut na portu ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Greška pri povezivanju na MongoDB:", error.message);
  });