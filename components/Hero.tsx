"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SiGithub, SiLinkerd, SiInstagram } from "@icons-pack/react-simple-icons";
import { MapPin } from 'lucide-react'
import type { SiteSettings } from "@/types";

export default function Hero({ settings }: { settings: SiteSettings | null }) {
    const socials = [
        { href: settings?.github, icon: SiGithub, label: "GitHub" },
        { href: settings?.linkedin, icon: SiLinkerd, label: "LinkedIn" },
        { href: settings?.instagram, icon: SiInstagram, label: "Instagram" },
    ].filter((s) => s.href);

    return (
        <section
            id="beranda"
            className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-4 pt-20 pb-16 sm:px-5 md:pt-24 md:pb-0"
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(139,127,212,0.15),transparent_60%)]" />

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="hsr-panel relative z-10 mx-auto w-full max-w-2xl overflow-hidden px-6 py-8 text-center sm:px-8 sm:py-10 md:px-14 md:py-14"
            >
                {/* garis dekoratif atas ala HUD game */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

                {/* Foto profil */}
                <div className="relative mx-auto mb-5 h-28 w-28 sm:h-32 sm:w-32 md:h-36 md:w-36">
                    <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-br from-gold via-astral to-gold opacity-60 blur-[8px]" />
                    <div className="absolute inset-[3px] overflow-hidden rounded-full border-2 border-gold-bright/80 bg-void">
                        {settings?.photoUrl ? (
                            <Image
                                src={settings.photoUrl}
                                alt={settings?.name || "Foto profil"}
                                fill
                                unoptimized
                                sizes="144px"
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-3xl text-gold/40">✦</div>
                        )}
                    </div>
                </div>

                <p className="hsr-eyebrow mb-3 md:mb-4">Trailblaze Mission · 001</p>
                <h1 className="font-display text-3xl font-semibold text-glow sm:text-4xl md:text-6xl">
                    {settings?.name}
                </h1>
                <p className="mt-3 font-mono text-xs tracking-wide text-astral sm:text-sm md:mt-4 md:text-base">
                    {settings?.role}
                </p>

                {settings?.location && (
                    <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-ink-faint">
                        <MapPin size={12} /> {settings.location}
                    </p>
                )}

                <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-ink-muted md:mt-6 md:text-base">
                    {settings?.tagline}
                </p>

                {/* Ikon sosial media — muncul otomatis kalau link diisi di admin */}
                {socials.length > 0 && (
                    <div className="mt-5 flex items-center justify-center gap-4">
                        {socials.map(({ href, icon: Icon, label }) => (
                            <a
                                key={label}
                                href={href!}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={label}
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-void-border text-ink-muted transition-colors hover:border-gold hover:text-gold-bright"
                            >
                                <Icon size={16} />
                            </a>
                        ))}
                    </div>
                )}

                <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 md:mt-8">
                    <a
                        href="#pencapaian"
                        className="w-full rounded-sm border border-gold/60 px-6 py-2.5 text-sm tracking-wide text-gold-bright transition-colors hover:bg-gold/10 sm:w-auto"
                    >
                        Lihat Pencapaian
                    </a>
                    <a
                        href="#kontak"
                        className="w-full rounded-sm bg-gold px-6 py-2.5 text-sm tracking-wide text-void transition-colors hover:bg-gold-bright sm:w-auto"
                    >
                        Hubungi Saya
                    </a>
                </div>
            </motion.div>
        </section>
    );
}