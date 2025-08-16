import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { recipient, subject, message } = await req.json();

    if (!recipient || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Setup Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // Gmail example
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER, // 🔑 from .env.local
        pass: process.env.SMTP_PASS,
      },
    });

    // Send Email
    await transporter.sendMail({
      from: `"AI Summarizer" <${process.env.SMTP_USER}>`,
      to: recipient,
      subject: subject || "Your AI Summary",
      text: message,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 });
  }
}
