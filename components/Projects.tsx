"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "./About";
import type { Project } from "@/types";

export default function Projects({ projects = [] }: { projects: Project[] }) {
  return (
    <section id="proyek" className="relative mx-auto max-w-6xl px-4 py-20 sm:px-5 md:py-28">
      <SectionHeading eyebrow="Mission Records" title="Proyek" />

      {projects.length === 0 ? (
        <p className="mt-10 text-center text-sm text-ink-faint md:mt-12">Proyek akan segera ditambahkan.</p>
      ) : (
        <div className="mt-10 space-y-4 md:mt-12 md:space-y-5">
          {projects.map((p, i) => (
            <motion.a
              key={p.id}
              href={p.link || "#"}
              target={p.link ? "_blank" : undefined}
              rel="noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="hsr-panel group flex flex-col gap-4 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-6 md:py-6"
            >
              <div>
                <p className="hsr-eyebrow text-astral">{p.code}</p>
                <p className="mt-1 font-display text-lg text-ink-primary group-hover:text-gold-bright md:text-xl">
                  {p.title}
                </p>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">{p.description}</p>
              </div>
              <div className="flex flex-wrap gap-2 md:justify-end">
                {p.stack.map((s) => (
                  <span key={s} className="rounded-sm border border-void-border px-2 py-1 font-mono text-[11px] text-ink-muted">
                    {s}
                  </span>
                ))}
              </div>
            </motion.a>
          ))}
        </div>
      )}
    </section>
  );
}