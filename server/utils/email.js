import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

/**
 * Thin email layer. In production it uses SMTP. In dev (or when SMTP is
 * not configured) it logs the message to the console so flows are testable
 * without a mail server.
 */

let transporter = null;

function getTransporter() {
  if (!env.email.enabled) return null;
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: env.email.host,
    port: env.email.port,
    secure: env.email.port === 465,
    auth: { user: env.email.user, pass: env.email.pass },
  });
  return transporter;
}

export async function sendEmail({ to, subject, html, text }) {
  const tx = getTransporter();
  if (!tx) {
    // eslint-disable-next-line no-console
    console.log('\n📧 [DEV EMAIL]');
    console.log(`   To:      ${to}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Body:    ${text || html}\n`);
    return { mocked: true };
  }
  return tx.sendMail({ from: env.email.from, to, subject, html, text });
}

export function verificationEmail({ name, url }) {
  return {
    subject: 'Verify your Aurora account',
    text: `Hi ${name}, verify your account: ${url}`,
    html: baseTemplate(
      'Confirm your email',
      `Welcome to Aurora, ${name}. Please confirm your email to activate your account.`,
      'Verify email',
      url,
    ),
  };
}

export function resetPasswordEmail({ name, url }) {
  return {
    subject: 'Reset your Aurora password',
    text: `Hi ${name}, reset your password: ${url} (valid 1 hour)`,
    html: baseTemplate(
      'Reset your password',
      `Hi ${name}, we received a request to reset your password. This link is valid for 1 hour.`,
      'Reset password',
      url,
    ),
  };
}

export function orderStatusEmail({ name, orderNumber, status }) {
  return {
    subject: `Order ${orderNumber} is now ${status}`,
    text: `Hi ${name}, your order ${orderNumber} status changed to ${status}.`,
    html: baseTemplate(
      'Order update',
      `Hi ${name}, your order <strong>${orderNumber}</strong> is now <strong>${status}</strong>.`,
      'View order',
      `${env.clientOrigins[0]}/account/orders`,
    ),
  };
}

function baseTemplate(title, body, cta, url) {
  return `
  <div style="font-family:Inter,Arial,sans-serif;max-width:520px;margin:0 auto;padding:32px;color:#0f172a">
    <h1 style="font-size:22px;margin:0 0 8px">Aurora</h1>
    <h2 style="font-size:18px;margin:24px 0 8px">${title}</h2>
    <p style="font-size:14px;line-height:1.6;color:#475569">${body}</p>
    <a href="${url}" style="display:inline-block;margin-top:20px;background:#4f46e5;color:#fff;
       text-decoration:none;padding:12px 24px;border-radius:10px;font-size:14px;font-weight:600">${cta}</a>
    <p style="font-size:12px;color:#94a3b8;margin-top:28px">If you didn't request this, you can ignore this email.</p>
  </div>`;
}

export default sendEmail;
