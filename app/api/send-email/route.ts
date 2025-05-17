import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface EmailParams {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASS!,
  },
});

export async function POST(request: Request) {
  const { to, subject, html } = (await request.json()) as EmailParams;
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    });
    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (err) {
    console.error('Error sending email:', err);
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 },
    );
  }
}
