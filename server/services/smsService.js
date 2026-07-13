export const smsService = {
  sendSMS: async (to, message) => {
    // If Twilio settings are missing, log simulator output
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      console.log(`[SMS SIMULATOR] Sent SMS to: ${to} | Content: ${message}`);
      return { success: true, sid: 'simulated_sms_sid' };
    }

    try {
      // Dynamic import to prevent errors if package is uninstalled
      const twilio = await import('twilio');
      const client = twilio.default(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );

      const response = await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER || '+15550000000',
        to
      });
      return response;
    } catch (err) {
      console.error('Twilio SMS delivery failed:', err);
      throw err;
    }
  }
};

export default smsService;
