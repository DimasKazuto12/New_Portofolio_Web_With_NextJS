"use client";

import { motion } from "framer-motion";
import type { SiteSettings, PathSkill } from "@/types";

export default function About({ settings, paths = [], }: { settings: SiteSettings | null; paths: PathSkill[]; }) {
  return (
    <section id="tentang" className="relative mx-auto max-w-6xl px-4 py-20 sm:px-5 md:py-28">
      <SectionHeading eyebrow="Character Profile" title="Tentang Saya" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
        className="hsr-panel mt-10 overflow-hidden px-6 py-7 md:mt-12 md:px-10 md:py-9"
      >
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <p className="hsr-eyebrow mb-3 text-astral">Log Pribadi</p>
            <p className="leading-relaxed text-ink-muted">{settings?.about}</p>
          </div>
          <div className="flex flex-col gap-4 border-t border-void-border pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
            <div>
              <p className="hsr-eyebrow">Lokasi</p>
              <p className="mt-1 text-sm text-ink-primary">{settings?.location}</p>
            </div>
            <div>
              <p className="hsr-eyebrow">Path</p>
              <p className="mt-1 text-sm text-ink-primary">Developer · Pemecah Masalah</p>
            </div>
          </div>
        </div>
      </motion.div>

      {paths.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-3 md:mt-8 md:grid-cols-4 md:gap-4">
          {paths.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="hsr-panel px-4 py-5 md:px-5 md:py-6"
            >
              <p className="hsr-eyebrow text-astral">{p.pathName}</p>
              <p className="mt-2 font-display text-base text-ink-primary md:text-lg">{p.skill}</p>
              <p className="mt-1 text-xs text-ink-faint">{p.detail}</p>
            </motion.div>
          ))}
        </div>
      )}
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