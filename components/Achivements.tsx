"use client";

import { useState, type ElementType } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { SectionHeading } from "./About";
import ImageLightbox from "./ImageLightbox";
import type { CertificateWithSkills } from "@/types";
import { ImStarFull } from "react-icons/im";
import { FaHandsPraying } from "react-icons/fa6";
import { ImEnlarge2 } from "react-icons/im";

const LIMIT = 6; // jumlah kartu yang tampil sebelum tombol "Lihat semua"

function Stars({ count }: { count: number }) {
  return (
    <div className="flex shrink-0 gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < count ? "text-gold-bright" : "text-void-border"}><ImStarFull size={10}/></span>
      ))}
    </div>
  );
}

export default function Achievements({ items = [] }: { items: CertificateWithSkills[] }) {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const [expanded, setExpanded] = useState(false);

  const visible = expanded ? items : items.slice(0, LIMIT);

  return (
    <section id="pencapaian" className="relative mx-auto max-w-[1440px] px-6 py-20 sm:px-10 md:py-28 lg:px-16 xl:px-20">
      <SectionHeading eyebrow="Relic Cache" title="Pencapaian & Sertifikat" />

      {items.length === 0 ? (
        <div className="mt-10 rounded-sm border border-dashed border-void-border px-6 py-14 text-center text-sm text-ink-muted md:mt-14">
          <FaHandsPraying size={15}/> Belum ada pencapaian. Sertifikat akan segera ditambahkan.
        </div>
      ) : (
        <>
          {/* flex-wrap + justify-center: 1–2 kartu tetap ukuran normal di tengah, baris terakhir juga di tengah */}
          <div className="mt-10 flex flex-wrap justify-center gap-4 sm:gap-6 md:mt-14">
            {visible.map((a, i) => {
              // Tanpa link: pakai <div>, supaya klik tidak melompat ke atas halaman
              const Body: ElementType = a.link ? "a" : "div";
              const bodyProps = a.link ? { href: a.link, target: "_blank", rel: "noreferrer" } : {};

              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: (i % 3) * 0.1 } }}
                  viewport={{ once: true, margin: "-60px" }}
                  whileHover={{ y: -4, transition: { duration: 0.25 } }}
                  className="hsr-panel group flex basis-full flex-col overflow-hidden transition-shadow hover:shadow-[0_14px_44px_-14px_rgba(179,168,255,0.4)] sm:basis-[calc(50%_-_12px)] lg:basis-[calc(33.333%_-_16px)]"
                >
                  {/* Area foto: rasio tetap, sertifikat tidak terpotong. Kalau tidak ada foto, tampil placeholder agar tinggi kartu tetap sama */}
                  {a.imageUrl ? (
                    <button
                      type="button"
                      onClick={() => setLightbox({ src: a.imageUrl!, alt: a.title })}
                      className="relative aspect-[16/10] w-full cursor-zoom-in overflow-hidden border-b border-void-border bg-void"
                    >
                      <Image
                        src={a.imageUrl}
                        alt={a.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-contain transition-transform duration-700 group-hover:scale-105"
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

                  <Body {...bodyProps} className="flex flex-1 flex-col justify-between px-5 py-5 md:px-6 md:py-6">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-display text-base leading-snug text-ink-primary transition-colors group-hover:text-gold-bright md:text-lg">
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
                    <p className="mt-5 font-mono text-xs text-ink-muted">{a.date}</p>
                  </Body>
                </motion.div>
              );
            })}
          </div>

          {items.length > LIMIT && (
            <div className="mt-8 text-center md:mt-10">
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="rounded-sm border border-gold/60 px-6 py-2.5 text-sm tracking-wide text-gold-bright transition-colors hover:bg-gold/10"
              >
                {expanded ? "Tampilkan lebih sedikit" : `Lihat semua (${items.length})`}
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