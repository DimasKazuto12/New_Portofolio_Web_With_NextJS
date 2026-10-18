"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin } from "lucide-react";
import { SectionHeading } from "./About";
import type { SiteSettings } from "@/types";

const initialState = { name: "", email: "", message: "" };
type Status = "idle" | "sending" | "success" | "error";

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

export default function ContactForm({ settings }: { settings: SiteSettings | null }) {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengirim pesan.");
      setStatus("success");
      setForm(initialState);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Terjadi kesalahan.");
    }
  }

  return (
    <section id="kontak" className="relative mx-auto max-w-[1440px] px-6 py-20 sm:px-10 md:py-28 lg:px-16 xl:px-20">
      <SectionHeading eyebrow="Transmission" title="Hubungi Saya" />

      {/* Desktop: ajakan di kiri, form di kanan. HP: ditumpuk */}
      <div className="mt-10 grid gap-5 md:mt-14 lg:grid-cols-[1fr_1.4fr] lg:gap-7">
        <motion.div {...reveal()} className="hsr-panel flex flex-col justify-between gap-8 px-6 py-7 md:px-10 md:py-10">
          <div>
            <p className="hsr-eyebrow mb-3 text-astral">Sinyal Masuk</p>
            <h3 className="font-display text-2xl text-ink-primary md:text-3xl">Ayo terhubung</h3>
            <p className="mt-3 max-w-md leading-relaxed text-ink-muted">
              Punya proyek, kolaborasi, atau sekadar ingin ngobrol soal game? Kirim transmisi lewat form ini.
            </p>
          </div>

          <ul className="space-y-3 text-sm">
            {settings?.email && (
              <li className="flex items-center gap-3 text-ink-muted">
                <Mail size={16} className="shrink-0 text-gold" />
                <a href={`mailto:${settings.email}`} className="break-all text-gold transition-colors hover:text-gold-bright">
                  {settings.email}
                </a>
              </li>
            )}
            {settings?.location && (
              <li className="flex items-center gap-3 text-ink-muted">
                <MapPin size={16} className="shrink-0 text-gold" />
                {settings.location}
              </li>
            )}
          </ul>
        </motion.div>

        <motion.form
          {...reveal(0.1)}
          onSubmit={handleSubmit}
          className="hsr-panel grid gap-4 px-6 py-7 sm:grid-cols-2 md:gap-5 md:px-10 md:py-10"
        >
          <div>
            <label htmlFor="name" className="hsr-eyebrow mb-2 block">Nama</label>
            <input id="name" name="name" required value={form.name} onChange={handleChange} placeholder="Nama kamu" className="input" />
          </div>
          <div>
            <label htmlFor="email" className="hsr-eyebrow mb-2 block">Email</label>
            <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="email-kamu@contoh.com" className="input" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="message" className="hsr-eyebrow mb-2 block">Pesan</label>
            <textarea id="message" name="message" rows={5} required value={form.message} onChange={handleChange} placeholder="Tulis pesanmu di sini..." className="input resize-none" />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            aria-busy={status === "sending"}
            className="w-full rounded-sm bg-gold px-6 py-3 text-sm font-medium tracking-wide text-void transition-all hover:bg-gold-bright hover:shadow-[0_0_26px_rgba(236,210,154,0.45)] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none sm:col-span-2"
          >
            {status === "sending" ? "Mengirim..." : "Kirim Transmisi"}
          </button>

          {/* role="status": pembaca layar ikut mengumumkan hasil pengiriman */}
          <div role="status" aria-live="polite" className="sm:col-span-2">
            {status === "success" && (
              <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-center text-sm text-stardust">
                Pesan berhasil dikirim. Terima kasih!
              </motion.p>
            )}
            {status === "error" && (
              <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-center text-sm text-red-400">
                {errorMsg || "Terjadi kesalahan. Coba lagi nanti."}
              </motion.p>
            )}
          </div>
        </motion.form>
      </div>
    </section>
  );
}