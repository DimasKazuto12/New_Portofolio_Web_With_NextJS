"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import type { SiteSettings } from '@/types';

export default function Hero({ settings }: { settings: SiteSettings | null }) {
    return (
        <section id="beranda" className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-4 pt-20 sm:px-5 md:pt-24 md:pb-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%, rgba(139,127,212,0.15), transparent_60%)]" />

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="hsr-panel relative z-10 mx-auto w-full max-w-2xl px-6 py-8 text-center sm:px-8 sm:py-10 md:px-14 md:py-14"
            >
                <div className="relative mx-auto mb-5 h-28 w-28 sm:h-32 sm:w-32 md:h-36 md:w-36">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold via-astral to-gold opacity-70 blur-[6px]" />
                    <div className="absolute inset-[3px] overflow-hidden rounded-full border-2 border-gold-bright/80 bg-void">
                        <Image
                            src={settings?.photoUrl || "/firefly.jpg"}
                            alt="Foto profil"
                            fill
                            sizes="144px"
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>

                <p className="hsr-eyebrow mb-3 md:mb-4">Trailblaze Mission · 001</p>
                <h1 className="font-display text-3xl font-semibold text-glow sm:text-4xl md:text-6xl">
                    {settings?.name}
                </h1>
                <p className="mt-3 font-mono text-xs tracking-wide text-astral sm:text-sm md:mt-4 md:text-base">
                    {settings?.role}
                </p>
                <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-ink-muted md:mt-6 md:text-base">
                    {settings?.tagline}
                </p>

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
            </motion.div >
        </section >
    )
}