"use client";

import { motion } from "framer-motion";
import type { SiteSettings } from "@/types";

const PATHS = [
  { name: "Destruction", skill: "Frontend Development", detail: "React, Next.js, Tailwind CSS" },
  { name: "Erudition", skill: "Backend Development", detail: "Node.js, REST API, Database" },
  { name: "Harmony", skill: "UI/UX Design", detail: "Figma, Design System" },
  { name: "Preservation", skill: "DevOps & Testing", detail: "Git, CI/CD, Debugging" },
];

export default function About({ settings }: { settings: SiteSettings | null }) {
  return (
    <section id="tentang" className="relative mx-auto max-w-6xl px-4 py-20 sm:px-5 md:py-28">
      <SectionHeading eyebrow="Character Profile" title="Tentang Saya" />

      <div className="mt-10 grid gap-6 md:mt-12 md:grid-cols-5 md:gap-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="hsr-panel px-6 py-6 md:col-span-2 md:py-8"
        >
          <p className="hsr-eyebrow">Lokasi</p>
          <p className="mt-1 mb-6 text-ink-primary">{settings?.location}</p>
          <p className="hsr-eyebrow">Path</p>
          <p className="mt-1 text-ink-primary">Developer · Pemecah Masalah</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="hsr-panel px-6 py-6 md:col-span-3 md:py-8"
        >
          <p className="hsr-eyebrow mb-3">Log Pribadi</p>
          <p className="leading-relaxed text-ink-muted">{settings?.about}</p>
        </motion.div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 md:mt-8 md:grid-cols-4 md:gap-4">
        {PATHS.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="hsr-panel px-4 py-5 md:px-5 md:py-6"
          >
            <p className="hsr-eyebrow text-astral">{p.name}</p>
            <p className="mt-2 font-display text-base text-ink-primary md:text-lg">{p.skill}</p>
            <p className="mt-1 text-xs text-ink-faint">{p.detail}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="text-center">
      <p className="hsr-eyebrow">{eyebrow}</p>
      <h2 className="mt-2 font-display text-2xl text-glow sm:text-3xl md:text-4xl">{title}</h2>
      <div className="mx-auto mt-4 h-px w-20 bg-gradient-to-r from-transparent via-gold to-transparent md:w-24" />
    </div>
  );
}