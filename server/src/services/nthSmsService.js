const sendOtpSms = async ({ phone, message }) => {
  console.log("NTH SMS placeholder:", {
    phone,
    message,
  });

  return {
    success: true,
    provider: "nth-placeholder",
    messageId: `mock-${Date.now()}`,
  };
};

module.exports = {
  sendOtpSms,
};