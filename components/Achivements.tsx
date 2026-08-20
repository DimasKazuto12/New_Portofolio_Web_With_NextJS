"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "./About";
import type { CertificateWithSkills } from "@/types";

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5 shrink-0">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < count ? "text-gold-bright" : "text-void-border"}>★</span>
      ))}
    </div>
  );
}

export default function Achievements({ items = [] }: { items: CertificateWithSkills[] }) {
  return (
    <section id="pencapaian" className="relative mx-auto max-w-6xl px-4 py-20 sm:px-5 md:py-28">
      <SectionHeading eyebrow="Relic Cache" title="Pencapaian & Sertifikat" />

      {items.length === 0 ? (
        <p className="mt-10 text-center text-sm text-ink-faint md:mt-12">Sertifikat akan segera ditambahkan.</p>
      ) : (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-12 md:gap-6 lg:grid-cols-3">
          {items.map((a, i) => (
            <motion.a
              key={a.id}
              href={a.link || "#"}
              target={a.link ? "_blank" : undefined}
              rel="noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              whileHover={{ y: -4 }}
              className="hsr-panel group flex flex-col justify-between px-5 py-5 transition-shadow hover:shadow-[0_0_30px_rgba(205,164,94,0.12)] md:px-6 md:py-6"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <p className="font-display text-base leading-snug text-ink-primary group-hover:text-gold-bright md:text-lg">
                    {a.title}
                  </p>
                  <Stars count={a.rarity} />
                </div>
                <p className="mt-1 hsr-eyebrow text-astral">{a.issuer}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{a.description}</p>
                {a.skills.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {a.skills.map((s) => (
                      <span key={s.id} className="rounded-sm border border-void-border px-2 py-0.5 font-mono text-[10px] text-ink-muted">
                        {s.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <p className="mt-5 font-mono text-xs text-ink-faint">{a.date}</p>
            </motion.a>
          ))}
        </div>
      )}
    </section>
  );
}