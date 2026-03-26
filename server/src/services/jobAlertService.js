const JobAlert = require("../models/JobAlert");
const JobTranslation = require("../models/JobTranslation");
require("../models/Company");
require("../models/Region");
const { sendMail } = require("./mailer");

const getAppBaseUrl = () => process.env.APP_BASE_URL || "http://localhost:5000";

const buildSearchableText = ({ translation, companyName, regionName, publicId }) => {
  return [
    translation?.name || "",
    translation?.whyThisPosition || "",
    translation?.aboutZepter || "",
    ...(translation?.responsibilities || []),
    ...(translation?.requirements || []),
    ...(translation?.whatZepterOffers || []),
    companyName || "",
    regionName || "",
    publicId || "",
  ]
    .join(" ")
    .toLowerCase();
};

const getTranslationForLocale = async (jobId, locale) => {
  let translation = await JobTranslation.findOne({
    job: jobId,
    locale,
  });

  if (!translation) {
    translation = await JobTranslation.findOne({
      job: jobId,
      locale: "en",
    });
  }

  return translation;
};

const sendJobAlertsForPublishedJob = async (job) => {
  const populatedJob = await job.populate([
    { path: "company", select: "name legalEntity" },
    { path: "region", select: "name isoCode" },
  ]);

  const alerts = await JobAlert.find({
    isActive: true,
  });

  if (!alerts.length) {
    return {
      totalAlerts: 0,
      matchedAlerts: 0,
      sentCount: 0,
      failedCount: 0,
    };
  }

  let matchedAlerts = 0;
  let sentCount = 0;
  let failedCount = 0;

  for (const alert of alerts) {
    try {
      const translation = await getTranslationForLocale(populatedJob._id, alert.locale);

      if (!translation) {
        continue;
      }

      const searchableText = buildSearchableText({
        translation,
        companyName: populatedJob.company?.name || "",
        regionName: populatedJob.region?.name || "",
        publicId: populatedJob.publicId,
      });

      const keyword = String(alert.keyword || "").trim().toLowerCase();

      if (keyword && !searchableText.includes(keyword)) {
        continue;
      }

      matchedAlerts += 1;

      const jobUrl = `${getAppBaseUrl()}/jobs/${populatedJob.publicId}`;
      const unsubscribeUrl = `${getAppBaseUrl()}/job-alerts/unsubscribe?token=${alert.unsubscribeToken}`;

      const subject = `New job alert: ${translation.name}`;
      const text = [
        `A new job matching your alert has been posted.`,
        ``,
        `Title: ${translation.name}`,
        `Company: ${populatedJob.company?.name || ""}`,
        `Region: ${populatedJob.region?.name || ""}`,
        `Job ID: ${populatedJob.publicId}`,
        `Link: ${jobUrl}`,
        ``,
        `To unsubscribe: ${unsubscribeUrl}`,
      ].join("\n");

      const html = `
        <p>A new job matching your alert has been posted.</p>
        <p><strong>Title:</strong> ${translation.name}</p>
        <p><strong>Company:</strong> ${populatedJob.company?.name || ""}</p>
        <p><strong>Region:</strong> ${populatedJob.region?.name || ""}</p>
        <p><strong>Job ID:</strong> ${populatedJob.publicId}</p>
        <p><a href="${jobUrl}">Open job</a></p>
        <hr />
        <p><a href="${unsubscribeUrl}">Unsubscribe</a></p>
      `;

      await sendMail({
        to: alert.email,
        subject,
        text,
        html,
      });

      alert.lastSentAt = new Date();
      await alert.save();

      sentCount += 1;
    } catch (error) {
      failedCount += 1;
      console.error(
        `Greška pri slanju job alert mejla za ${alert.email}:`,
        error.message
      );
    }
  }

  return {
    totalAlerts: alerts.length,
    matchedAlerts,
    sentCount,
    failedCount,
  };
};

module.exports = {
  sendJobAlertsForPublishedJob,
};