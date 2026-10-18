"use client";

import { motion } from "framer-motion";
import type { SiteSettings, PathSkill } from "@/types";

// Animasi muncul yang dipakai berulang, supaya konsisten di semua kartu
const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

export default function About({ settings, paths = [] }: { settings: SiteSettings | null; paths: PathSkill[] }) {
  return (
    <section id="tentang" className="relative mx-auto max-w-[1440px] px-6 py-20 sm:px-10 md:py-28 lg:px-16 xl:px-20">
      <SectionHeading eyebrow="Character Profile" title="Tentang Saya" />

      {/* Dua panel sama tinggi di desktop: bio di kiri, info di kanan */}
      <div className="mt-10 grid gap-5 md:mt-14 lg:grid-cols-[1.4fr_1fr] lg:gap-7">
        <motion.div {...reveal()} className="hsr-panel px-6 py-7 md:px-10 md:py-10">
          <p className="hsr-eyebrow mb-3 text-astral">Log Pribadi</p>
          <p className="max-w-prose text-base leading-relaxed text-ink-muted md:text-lg">{settings?.about}</p>
        </motion.div>

        <motion.dl
          {...reveal(0.1)}
          className="hsr-panel flex flex-col justify-center divide-y divide-void-border px-6 py-3 md:px-10"
        >
          <div className="py-4">
            <dt className="hsr-eyebrow">Lokasi</dt>
            <dd className="mt-1 text-ink-primary">{settings?.location}</dd>
          </div>
          <div className="py-4">
            <dt className="hsr-eyebrow">Path</dt>
            <dd className="mt-1 text-ink-primary">Developer · Pemecah Masalah</dd>
          </div>
        </motion.dl>
      </div>

      {/* Jumlah path dinamis dari admin: flex-wrap + justify-center, baris terakhir tetap di tengah */}
      {paths.length > 0 && (
        <div className="mt-6 flex flex-wrap justify-center gap-3 md:mt-8 md:gap-6">
          {paths.map((p, i) => (
            <motion.div
              key={p.id}
              {...reveal(i * 0.08)}
              className="hsr-panel basis-[calc(50%_-_6px)] px-4 py-5 md:basis-[calc(33.333%_-_16px)] md:px-5 md:py-6 lg:basis-[calc(25%_-_18px)]"
            >
              <p className="hsr-eyebrow text-astral">{p.pathName}</p>
              <p className="mt-2 font-display text-base text-ink-primary md:text-lg">{p.skill}</p>
              <p className="mt-1 text-xs text-ink-muted">{p.detail}</p>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}

export function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="text-center"
    >
      <p className="hsr-eyebrow">{eyebrow}</p>
      <h2 className="mt-2 font-display text-3xl text-glow sm:text-4xl md:text-5xl">{title}</h2>
      {/* Garis emas memanjang dari tengah setelah judul muncul */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, delay: 0.35, ease: "easeOut" }}
        className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent md:w-28"
      />
    </motion.div>
  );
}