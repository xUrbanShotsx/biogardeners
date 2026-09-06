import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, mobile, notes } = await req.json();

    if (!firstName || !lastName || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await resend.emails.send({
      from:    "BioGardeners Contact <onboarding@resend.dev>",
      to:      ["hello@biogardeners.com.au"],
      replyTo: email,
      subject: `New enquiry from ${firstName} ${lastName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <div style="background: #00A856; padding: 20px 24px; border-radius: 12px 12px 0 0;">
            <h1 style="color: #fff; margin: 0; font-size: 20px;">New Contact Enquiry</h1>
            <p style="color: rgba(255,255,255,0.7); margin: 4px 0 0; font-size: 13px;">BioGardeners website</p>
          </div>
          <div style="background: #f9fafb; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 13px; width: 120px;">Name</td>
                <td style="padding: 8px 0; font-weight: 600; font-size: 14px; color: #111827;">${firstName} ${lastName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Email</td>
                <td style="padding: 8px 0; font-size: 14px;"><a href="mailto:${email}" style="color: #00A856;">${email}</a></td>
              </tr>
              ${mobile ? `
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Mobile</td>
                <td style="padding: 8px 0; font-size: 14px; color: #111827;">${mobile}</td>
              </tr>` : ""}
              ${notes ? `
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 13px; vertical-align: top;">Message</td>
                <td style="padding: 8px 0; font-size: 14px; color: #111827; white-space: pre-wrap;">${notes}</td>
              </tr>` : ""}
            </table>
          </div>
          <p style="color: #9ca3af; font-size: 12px; margin-top: 16px; text-align: center;">
            Reply directly to this email to respond to ${firstName}.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact]", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
