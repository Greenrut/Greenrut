import nodemailer from 'nodemailer'
import { config } from '../config/env.js'

let cachedTransporter = null

function hasSmtpConfig() {
  return Boolean(config.smtp.host && config.smtp.user && config.smtp.pass)
}

function getTransporter() {
  if (!hasSmtpConfig()) return null
  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      tls: {
        rejectUnauthorized: config.smtp.rejectUnauthorized,
      },
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
    })
  }

  return cachedTransporter
}

export async function sendEmail({ to, subject, text, html }) {
  const transporter = getTransporter()
  if (!transporter) {
    console.warn('SMTP is not configured. Password reset email was not sent automatically.', { to, subject })
    if (text) console.warn(text)
    return { provider: 'console' }
  }

    return transporter.sendMail({
    from: config.smtp.from || config.smtp.user,
    envelope: {
      from: config.smtp.user,
      to,
    },
    replyTo: config.smtp.user,
    to,
    subject,
    text,
    html,
  })
}

