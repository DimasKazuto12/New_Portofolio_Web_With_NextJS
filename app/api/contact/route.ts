import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return Response.json({ error: "Semua field wajib diisi." }, { status: 400 });
    }
    if (!EMAIL_REGEX.test(email)) {
      return Response.json({ error: "Format email tidak valid." }, { status: 400 });
    }
    if (message.length > 5000) {
      return Response.json({ error: "Pesan terlalu panjang." }, { status: 400 });
    }

    try {
      await prisma.message.create({ data: { name, email, message } });
    } catch (dbError) {
      console.error("Gagal simpan pesan ke database:", dbError);
    }

    const { GMAIL_USER, GMAIL_APP_PASSWORD, TO_EMAIL } = process.env;
    if (GMAIL_USER && GMAIL_APP_PASSWORD) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
        });
        await transporter.sendMail({
          from: `"Portfolio Contact Form" <${GMAIL_USER}>`,
          to: TO_EMAIL || GMAIL_USER,
          replyTo: email,
          subject: name,
          text: `Nama: ${name}\nEmail: ${email}\n\nPesan:\n${message}`,
          html: `
            <div style="font-family: sans-serif; line-height: 1.6;">
              <h2>Pesan baru dari portofolio</h2>
              <p><strong>Nama:</strong> ${escapeHtml(name)}</p>
              <p><strong>Email:</strong> ${escapeHtml(email)}</p>
              <p><strong>Pesan:</strong></p>
              <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
            </div>
          `,
        });
      } catch (mailErr) {
        console.error("Gagal mengirim email notifikasi:", mailErr);
      }
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("Gagal memproses pesan:", err);
    return Response.json({ error: "Gagal mengirim pesan. Coba lagi nanti." }, { status: 500 });
  }
}

function escapeHtml(str: string) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}