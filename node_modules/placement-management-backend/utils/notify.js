const Notification = require('../models/Notification');
const Student = require('../models/Student');
const Recruiter = require('../models/Recruiter');
const Admin = require('../models/Admin');
const { sendEmail } = require('./email');

const resolveRecipientEmail = async ({ recipientRole, recipient }) => {
  if (recipientRole === 'student') {
    const u = await Student.findById(recipient).select('email');
    return u?.email;
  }
  if (recipientRole === 'recruiter') {
    const u = await Recruiter.findById(recipient).select('email');
    return u?.email;
  }
  if (recipientRole === 'admin') {
    const u = await Admin.findById(recipient).select('username');
    return u?.username;
  }
  return null;
};

const sendSms = async ({ to, text }) => {
  // Provider placeholder (Twilio/Fast2SMS/etc.)
  // eslint-disable-next-line no-console
  console.log('SMS (dev):', { to, text });
  return true;
};

const sendWhatsapp = async ({ to, text }) => {
  // Provider placeholder (Twilio/Meta/etc.)
  // eslint-disable-next-line no-console
  console.log('WhatsApp (dev):', { to, text });
  return true;
};

const createNotification = async ({
  recipientRole,
  recipient,
  type,
  title,
  message,
  metadata = {},
  channels = { inApp: true },
}) => {
  const doc = await Notification.create({
    recipientRole,
    recipient,
    type,
    title,
    message,
    metadata,
    channels: {
      inApp: channels.inApp !== false,
      email: !!channels.email,
      sms: !!channels.sms,
      whatsapp: !!channels.whatsapp,
    },
  });

  const toEmail = doc.channels.email ? await resolveRecipientEmail({ recipientRole, recipient }) : null;
  if (toEmail) {
    await sendEmail({ to: toEmail, subject: title, text: message, html: `<p>${message}</p>` });
    doc.delivered.emailAt = new Date();
  }

  if (doc.channels.sms) {
    await sendSms({ to: toEmail || 'unknown', text: message });
    doc.delivered.smsAt = new Date();
  }

  if (doc.channels.whatsapp) {
    await sendWhatsapp({ to: toEmail || 'unknown', text: message });
    doc.delivered.whatsappAt = new Date();
  }

  await doc.save();
  return doc;
};

module.exports = { createNotification };

