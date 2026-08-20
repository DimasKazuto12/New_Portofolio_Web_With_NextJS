"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "./About";
import type { SiteSettings } from "@/types";

const initialState = { name: "", email: "", message: "" };
type Status = "idle" | "sending" | "success" | "error";

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
    <section id="kontak" className="relative mx-auto max-w-3xl px-4 py-20 sm:px-5 md:py-28">
      <SectionHeading eyebrow="Transmission" title="Hubungi Saya" />

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
        onSubmit={handleSubmit}
        className="hsr-panel mt-10 space-y-4 px-5 py-6 sm:px-8 md:mt-12 md:space-y-5 md:px-10 md:py-10"
      >
        <div>
          <label htmlFor="name" className="hsr-eyebrow mb-2 block">Nama</label>
          <input id="name" name="name" required value={form.name} onChange={handleChange} placeholder="Nama kamu" className="input" />
        </div>
        <div>
          <label htmlFor="email" className="hsr-eyebrow mb-2 block">Email</label>
          <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="email-kamu@contoh.com" className="input" />
        </div>
        <div>
          <label htmlFor="message" className="hsr-eyebrow mb-2 block">Pesan</label>
          <textarea id="message" name="message" rows={4} required value={form.message} onChange={handleChange} placeholder="Tulis pesanmu di sini..." className="input resize-none" />
        </div>

        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full rounded-sm bg-gold px-6 py-3 text-sm font-medium tracking-wide text-void transition-colors hover:bg-gold-bright disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "sending" ? "Mengirim..." : "Kirim Transmisi"}
        </button>

        {status === "success" && <p className="text-center text-sm text-stardust">Pesan berhasil dikirim. Terima kasih!</p>}
        {status === "error" && <p className="text-center text-sm text-red-400">{errorMsg || "Terjadi kesalahan. Coba lagi nanti."}</p>}

        <p className="text-center text-xs text-ink-faint">
          Atau kirim email langsung ke{" "}
          <a href={`mailto:${settings?.email}`} className="text-gold hover:text-gold-bright">{settings?.email}</a>
        </p>
      </motion.form>
    </section>
  );
}