"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "./About";
import type { SkillGroup } from "@/lib/skills";

const LEVEL_LABEL = ["", "Dasar", "Cukup", "Menengah", "Baik", "Mahir"];

export default function Skills({ groups }: { groups: SkillGroup[] }) {
  if (groups.length === 0) return null;

  return (
    <section id="skill" className="relative mx-auto max-w-[1440px] px-6 py-20 sm:px-10 md:py-28 lg:px-16 xl:px-20">
      <SectionHeading eyebrow="Skill Tree" title="Keahlian" />

      {/* flex-wrap + justify-center: jumlah grup berapa pun tetap rapi dan di tengah */}
      <div className="mt-10 flex flex-wrap justify-center gap-4 sm:gap-6 md:mt-14">
        {groups.map((g, gi) => (
          <motion.div
            key={g.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: gi * 0.1, ease: "easeOut" } }}
            viewport={{ once: true, margin: "-60px" }}
            className="hsr-panel basis-full p-6 sm:basis-[calc(50%_-_12px)] md:p-8 lg:basis-[calc(33.333%_-_16px)]"
          >
            <p className="hsr-eyebrow text-astral">{g.title}</p>
            {g.note && <p className="mt-1 text-xs text-ink-muted">{g.note}</p>}

            <ul className="mt-5 space-y-4">
              {g.skills.map((s, i) => (
                <li key={s.name} className="flex items-center justify-between gap-4">
                  <span className="text-sm text-ink-primary">{s.name}</span>
                  <span className="flex items-center gap-3" role="img" aria-label={`${s.name}: ${LEVEL_LABEL[s.level]}`}>
                    <span className="hidden font-mono text-[11px] text-ink-muted sm:inline">{LEVEL_LABEL[s.level]}</span>
                    <span className="flex gap-1" aria-hidden>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <motion.span
                          key={n}
                          initial={{ opacity: 0, scale: 0.6 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + i * 0.06 + n * 0.05, duration: 0.3 }}
                          className={`text-xs ${n <= s.level ? "text-gold-bright" : "text-ink-faint/40"}`}
                        >
                          ◆
                        </motion.span>
                      ))}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}