import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    // We added 'status' and 'customMessage' so the email changes based on what happened!
    const { userEmail, userName, serviceType, status, customMessage } = await request.json();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Default messages if none are provided
    const statusText = status || "We are on process ⏳";
    const messageBody = customMessage || "Our team is currently reviewing your submission. You can track the status directly in your Dashboard. We will contact you shortly!";

    const mailOptions = {
      from: `"AutoSettle" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `AutoSettle - ${serviceType} Update`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f1f5f9; border-radius: 16px;">
          <h2 style="color: #0f172a;">Hello ${userName},</h2>
          <p style="color: #475569; font-size: 16px; line-height: 1.5;">
            There is an update regarding your <strong>${serviceType}</strong> request.
          </p>
          <div style="background-color: #f8fafc; padding: 16px; border-radius: 12px; margin: 20px 0;">
            <p style="color: #f97316; font-weight: bold; margin: 0; font-size: 18px;">Status: ${statusText}</p>
            <p style="color: #64748b; font-size: 15px; margin-top: 8px;">
              ${messageBody}
            </p>
          </div>
          <p style="color: #475569; font-size: 16px;">Thank you for choosing AutoSettle!</p>
          <p style="color: #0f172a; font-weight: bold;">- The AutoSettle Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}