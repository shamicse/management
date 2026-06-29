const nodemailer = require('nodemailer');
const env = require('../config/env');
const logger = require('./logger');

const isSmtpConfigured = () =>
  Boolean(env.SMTP_HOST?.trim() && env.SMTP_USER?.trim() && env.SMTP_PASS?.trim());

const extractLink = (text = '', html = '') => {
  const fromText = text.match(/https?:\/\/[^\s<]+/)?.[0];
  if (fromText) return fromText.replace(/[).,]+$/, '');
  const fromHtml = html.match(/href="(https?:\/\/[^"]+)"/)?.[1];
  return fromHtml || null;
};

const logDevEmail = ({ to, subject, text, html }) => {
  const link = extractLink(text, html);
  const isReset = /reset/i.test(subject);
  const isVerify = /verify/i.test(subject);

  const lines = [
    '',
    '══════════════════════════════════════════════════════════',
    '  EMAIL (SMTP not configured — copy link from terminal)',
    '══════════════════════════════════════════════════════════',
    `  To:      ${to}`,
    `  From:    ${env.MAIL_FROM}`,
    `  Subject: ${subject}`,
  ];

  if (link) {
    lines.push(`  Link:    ${link}`);
    if (isReset) {
      lines.push('', '  >>> PASSWORD RESET URL (open in browser) <<<', `  ${link}`);
    }
    if (isVerify) {
      lines.push('', '  >>> EMAIL VERIFICATION URL (open in browser) <<<', `  ${link}`);
    }
  } else if (text) {
    lines.push('', `  ${text}`);
  }

  lines.push('══════════════════════════════════════════════════════════', '');
  logger.info({ to, subject, link, mode: 'dev-console' }, 'Email logged to terminal (SMTP not configured)');
  // eslint-disable-next-line no-console
  console.log(lines.join('\n'));
};

const createTransport = async () => {
  if (isSmtpConfigured()) {
    return nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE === 'true',
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }

  return nodemailer.createTransport({ jsonTransport: true });
};

const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = await createTransport();
  const from = env.MAIL_FROM;

  const info = await transporter.sendMail({ from, to, subject, text, html });

  if (!isSmtpConfigured()) {
    logDevEmail({ to, subject, text, html });
  } else {
    logger.info({ to, subject, messageId: info.messageId }, 'Email sent via SMTP');
  }

  return info;
};

module.exports = { sendEmail, isSmtpConfigured };
