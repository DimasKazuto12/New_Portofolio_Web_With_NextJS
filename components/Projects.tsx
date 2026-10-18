"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { SectionHeading } from "./About";
import ImageLightbox from "./ImageLightbox";
import type { Project } from "@/types";
import { ImEnlarge2 } from "react-icons/im";
import { FaHandsPraying } from "react-icons/fa6";

const LIMIT = 6; // jumlah kartu yang tampil sebelum tombol "Lihat semua"

export default function Projects({ projects = [] }: { projects: Project[] }) {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const [expanded, setExpanded] = useState(false);

  const visible = expanded ? projects : projects.slice(0, LIMIT);

  return (
    <section id="proyek" className="relative mx-auto max-w-[1440px] px-6 py-20 sm:px-10 md:py-28 lg:px-16 xl:px-20">
      <SectionHeading eyebrow="Mission Records" title="Proyek" />

      {projects.length === 0 ? (
        <div className="mt-10 rounded-sm border border-dashed border-void-border px-6 py-14 text-center text-sm text-ink-muted md:mt-14">
          <FaHandsPraying size={15}/> Belum ada proyek. Misi baru segera hadir.
        </div>
      ) : (
        <>
          {/* flex-wrap + justify-center: 1–2 kartu tetap ukuran normal di tengah, baris terakhir juga di tengah */}
          <div className="mt-10 flex flex-wrap justify-center gap-4 sm:gap-6 md:mt-14">
            {visible.map((p, i) => (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: (i % 3) * 0.1 } }}
                viewport={{ once: true, margin: "-60px" }}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                className="hsr-panel group flex basis-full flex-col overflow-hidden transition-shadow hover:shadow-[0_14px_44px_-14px_rgba(179,168,255,0.4)] sm:basis-[calc(50%_-_12px)] lg:basis-[calc(33.333%_-_16px)]"
              >
                {/* Foto proyek rasio 16:10. Tanpa foto tetap ada placeholder supaya tinggi kartu sejajar */}
                {p.imageUrl ? (
                  <button
                    type="button"
                    onClick={() => setLightbox({ src: p.imageUrl!, alt: p.title })}
                    className="relative aspect-[16/10] w-full cursor-zoom-in overflow-hidden border-b border-void-border bg-void"
                  >
                    <Image
                      src={p.imageUrl}
                      alt={p.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-end justify-end bg-gradient-to-t from-black/50 via-transparent to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span className="text-xs tracking-widest text-gold-bright"><ImEnlarge2 size={15}/></span>
                    </div>
                  </button>
                ) : (
                  <div className="flex aspect-[16/10] w-full items-center justify-center border-b border-void-border bg-void text-4xl text-gold/30">
                    ✦
                  </div>
                )}

                <div className="flex flex-1 flex-col px-5 py-5 md:px-6 md:py-6">
                  <p className="hsr-eyebrow text-astral">{p.code}</p>
                  <h3 className="mt-1 font-display text-lg text-ink-primary transition-colors group-hover:text-gold-bright md:text-xl">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{p.description}</p>

                  {/* mt-auto: stack dan tautan selalu menempel di dasar kartu */}
                  <div className="mt-auto pt-5">
                    {p.stack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {p.stack.map((s) => (
                          <span key={s} className="rounded-sm border border-void-border px-2 py-0.5 font-mono text-[11px] text-ink-muted">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                    {p.link && (
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex items-center gap-1 text-sm text-astral transition-colors hover:text-gold-bright"
                      >
                        Buka Proyek
                      </a>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {projects.length > LIMIT && (
            <div className="mt-8 text-center md:mt-10">
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="rounded-sm border border-gold/60 px-6 py-2.5 text-sm tracking-wide text-gold-bright transition-colors hover:bg-gold/10"
              >
                {expanded ? "Tampilkan lebih sedikit" : `Lihat semua (${projects.length})`}
              </button>
            </div>
          )}
        </>
      )}

      {lightbox && (
        <ImageLightbox
          src={lightbox.src}
          alt={lightbox.alt}
          open={!!lightbox}
          onClose={() => setLightbox(null)}
        />
      )}
    </section>
  );
}