const APPLICATION_STATUSES = [
  "new",
  "screening",
  "interview",
  "offer",
  "onboarding",
  "hired",
  "rejected",
  "withdrawn",
  "archived",
];

const formatStatusLabel = (status) => {
  const map = {
    new: "New",
    screening: "Screening",
    interview: "Interview",
    offer: "Offer",
    onboarding: "Onboarding",
    hired: "Hired",
    rejected: "Rejected",
    withdrawn: "Withdrawn",
    archived: "Archived",
  };

  return map[status] || status;
};

module.exports = {
  APPLICATION_STATUSES,
  formatStatusLabel,
};