const sendVerificationEmail = async ({ email, subject, text, html }) => {
  console.log("EMAIL placeholder:", {
    email,
    subject,
    text,
    html,
  });

  return {
    success: true,
    provider: "email-placeholder",
    messageId: `mock-${Date.now()}`,
  };
};

module.exports = {
  sendVerificationEmail,
};