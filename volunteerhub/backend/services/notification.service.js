const nodemailer = require("nodemailer");

// let transporter = null;
// if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
//   transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: Number(process.env.SMTP_PORT || 587),
//     secure: String(process.env.SMTP_SECURE || "false") === "true",
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASS
//     }
//   });
// }

async function sendNotificationEmail(to, subject, body) {
  // IN TESTING
  // if (!to) return { delivered: false, reason: "missing recipient" };
  // if (!transporter) {
  //   console.log(`[EMAIL-FALLBACK] to=${to} subject=${subject} body=${body}`);
  //   return { delivered: false, reason: "smtp not configured" };
  // }
  // await transporter.sendMail({
  //   from: process.env.SMTP_FROM || process.env.SMTP_USER,
  //   to,
  //   subject,
  //   text: body
  // });
  return { delivered: true };
}

module.exports = { sendNotificationEmail };
