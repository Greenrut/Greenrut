import nodemailer from 'nodemailer'
import { config } from '../config/env.js'

let cachedTransporter = null

function hasSmtpConfig() {
  return Boolean(config.smtp.host && config.smtp.user && config.smtp.pass)
}

function hasResendConfig() {
  return Boolean(config.resend.apiKey)
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

async function sendWithResend({ to, subject, text, html }) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.resend.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: config.resend.from,
      to: Array.isArray(to) ? to : [to],
      subject,
      text,
      html,
    }),
  })

  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(data?.message || data?.error || 'Resend email failed')
  }

  return { provider: 'resend', data }
}

export async function sendEmail({ to, subject, text, html }) {
  if (hasResendConfig()) {
    return sendWithResend({ to, subject, text, html })
  }

  const transporter = getTransporter()
  if (!transporter) {
    console.warn('SMTP is not configured. Password reset email was not sent automatically.', { to, subject })
    if (text) console.warn(text)
    return { provider: 'console' }
  }

  return transporter.sendMail({
    from: config.smtp.user,
    envelope: {
      from: config.smtp.user,
      to,
    },
    replyTo: config.smtp.from || config.smtp.user,
    to,
    subject,
    text,
    html,
  })
}

