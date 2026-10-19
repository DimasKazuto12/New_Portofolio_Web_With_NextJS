"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
    animate,
    motion,
    useInView,
    useReducedMotion,
    useScroll,
    useTransform,
    type Variants,
} from "framer-motion";
import { SiGithub, SiInstagram } from "@icons-pack/react-simple-icons";
import { Download, MapPin } from "lucide-react";
import type { SiteSettings } from "@/types";

type Stat = { label: string; value: number };

const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item: Variants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

// Posisi chip skill di sekeliling foto
const CHIP_POS = [
    "left-[-1.5rem] top-[12%] lg:left-[-3.5rem]",
    "right-[-1.5rem] top-[28%] lg:right-[-4rem]",
    "left-[-0.5rem] bottom-[18%] lg:left-[-4.5rem]",
    "right-[-0.5rem] bottom-[6%] lg:right-[-2.5rem]",
];

function LinkedinIcon({ size = 16 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" />
        </svg>
    );
}

/** Angka yang menghitung naik saat terlihat di layar */
function CountUp({ value }: { value: number }) {
    const reduce = useReducedMotion();
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true });
    const [n, setN] = useState(0);

    useEffect(() => {
        if (!inView || reduce) return;
        const controls = animate(0, value, {
            duration: 1.2,
            ease: "easeOut",
            onUpdate: (v) => setN(Math.round(v)),
        });
        return () => controls.stop();
    }, [inView, value, reduce]);

    return <span ref={ref}>{reduce ? value : n}</span>;
}

export default function Hero({
    settings,
    stats = [],
    chips = [],
}: {
    settings: SiteSettings | null;
    stats?: Stat[];
    chips?: string[];
}) {
    const reduce = useReducedMotion();

    // Saat scroll turun, hero memudar dan naik sedikit
    const { scrollY } = useScroll();
    const fade = useTransform(scrollY, [0, 500], [1, 0.25]);
    const lift = useTransform(scrollY, [0, 500], [0, -40]);
    const cueFade = useTransform(scrollY, [0, 160], [1, 0]);

    const socials = [
        { href: settings?.github, icon: SiGithub, label: "GitHub" },
        { href: settings?.linkedin, icon: LinkedinIcon, label: "LinkedIn" },
        { href: settings?.instagram, icon: SiInstagram, label: "Instagram" },
    ].filter((s) => s.href);

    const shownStats = stats.filter((s) => s.value > 0);

    return (
        <section
            id="beranda"
            className="relative flex min-h-[100svh] items-center overflow-hidden pt-24 pb-24 lg:pt-28 lg:pb-20"
        >
            {/* ===== Lapisan latar ===== */}
            <div aria-hidden className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(179,168,255,0.16),transparent_60%)]" />

                {/* Grid tipis yang memudar ke tepi */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(236,210,154,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(236,210,154,0.05)_1px,transparent_1px)] bg-[size:56px_56px] [-webkit-mask-image:radial-gradient(ellipse_70%_60%_at_60%_50%,black,transparent)] [mask-image:radial-gradient(ellipse_70%_60%_at_60%_50%,black,transparent)]" />

            </div>

            {/* ===== Isi ===== */}
            <motion.div
                style={reduce ? undefined : { opacity: fade, y: lift }}
                className="relative z-10 mx-auto grid w-full max-w-[1440px] items-center gap-12 px-6 sm:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14 lg:px-16 xl:px-20"
            >
                {/* Kolom teks */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="order-2 text-center lg:order-1 lg:text-left"
                >
                    {settings?.availability && (
                        <motion.p
                            variants={item}
                            className="mb-4 inline-flex items-center gap-2 rounded-full border border-stardust/40 bg-stardust/10 px-3 py-1 text-xs text-stardust"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-stardust opacity-60" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-stardust" />
                            </span>
                            {settings.availability}
                        </motion.p>
                    )}

                    <motion.p variants={item} className="hsr-eyebrow mb-3 md:mb-4">
                        Trailblaze Mission · 001
                    </motion.p>

                    <motion.h1
                        variants={item}
                        className="font-display text-4xl font-semibold leading-[1.08] sm:text-5xl md:text-6xl xl:text-7xl"
                    >
                        <motion.span
                            className="inline-block bg-[linear-gradient(100deg,#fff_30%,var(--color-gold)_45%,#fff_60%)] bg-[length:250%_100%] bg-clip-text text-transparent"
                            animate={reduce ? undefined : { backgroundPosition: ["0% 0%", "-250% 0%"] }}
                            transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
                        >
                            {settings?.name}
                        </motion.span>
                    </motion.h1>

                    {/* Peran dan lokasi satu baris */}
                    <motion.div
                        variants={item}
                        className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 lg:justify-start"
                    >
                        <span className="inline-block rounded-full border border-astral/50 px-4 py-1 font-mono text-xs tracking-wide text-astral sm:text-sm">
                            {settings?.role}
                        </span>
                        {settings?.location && (
                            <span className="flex items-center gap-1.5 text-sm text-ink-muted">
                                <MapPin size={14} /> {settings.location}
                            </span>
                        )}
                    </motion.div>

                    <motion.p
                        variants={item}
                        className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-ink-muted md:text-lg lg:mx-0"
                    >
                        {settings?.tagline}
                    </motion.p>

                    <motion.div
                        variants={item}
                        className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 lg:justify-start"
                    >
                        <a
                            href="#pencapaian"
                            className="w-full rounded-sm border border-gold/60 px-6 py-2.5 text-sm tracking-wide text-gold-bright transition-colors hover:bg-gold/10 sm:w-auto"
                        >
                            Lihat Pencapaian
                        </a>
                        <a
                            href="#kontak"
                            className="w-full rounded-sm bg-gold px-6 py-2.5 text-sm tracking-wide text-void transition-all hover:bg-gold-bright hover:shadow-[0_0_26px_rgba(236,210,154,0.45)] sm:w-auto"
                        >
                            Hubungi Saya
                        </a>
                        {settings?.cvUrl && (
                            <a
                                href={settings.cvUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex w-full items-center justify-center gap-2 rounded-sm border border-void-border px-6 py-2.5 text-sm tracking-wide text-ink-muted transition-colors hover:border-gold hover:text-gold-bright sm:w-auto"
                            >
                                <Download size={14} /> Unduh CV
                            </a>
                        )}
                    </motion.div>

                    {socials.length > 0 && (
                        <motion.div variants={item} className="mt-6 flex items-center justify-center gap-4 lg:justify-start">
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
                        </motion.div>
                    )}

                    {/* Statistik: angka nyata dari database */}
                    {shownStats.length > 0 && (
                        <motion.div
                            variants={item}
                            className="mx-auto mt-9 flex max-w-lg items-stretch border-t border-void-border pt-6 lg:mx-0"
                        >
                            {shownStats.map((s, i) => (
                                <div
                                    key={s.label}
                                    className={`flex-1 px-4 text-center first:pl-0 lg:text-left ${i > 0 ? "border-l border-void-border" : ""}`}
                                >
                                    <p className="font-display text-3xl text-gold-bright md:text-4xl">
                                        <CountUp value={s.value} />
                                    </p>
                                    <p className="hsr-eyebrow mt-1">{s.label}</p>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </motion.div>

                {/* Kolom foto */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                    className="order-1 mx-auto lg:order-2"
                >
                    <motion.div
                        animate={reduce ? undefined : { y: [0, -14, 0] }}
                        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                        className="relative h-48 w-48 sm:h-56 sm:w-56 lg:h-72 lg:w-72 xl:h-80 xl:w-80"
                    >
                        {/* Cincin orbit; titik emas ikut berputar mengorbit */}
                        <motion.div
                            aria-hidden
                            animate={reduce ? undefined : { rotate: 360 }}
                            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                            className="absolute -inset-4 rounded-full border border-dashed border-gold/30 lg:-inset-6"
                        >
                            <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-gold shadow-[0_0_12px_rgba(236,210,154,0.9)]" />
                        </motion.div>
                        <motion.div
                            aria-hidden
                            animate={reduce ? undefined : { rotate: -360 }}
                            transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
                            className="absolute -inset-8 rounded-full border border-astral/20 lg:-inset-12"
                        />

                        <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-br from-gold via-astral to-gold opacity-50 blur-[14px]" />
                        <div className="absolute inset-[3px] overflow-hidden rounded-full border-2 border-gold-bright/80 bg-void">
                            {settings?.photoUrl ? (
                                <Image
                                    src={settings.photoUrl}
                                    alt={settings?.name || "Foto profil"}
                                    fill
                                    unoptimized
                                    sizes="(min-width: 1280px) 320px, (min-width: 1024px) 288px, 224px"
                                    className="object-cover"
                                    priority
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-5xl text-gold/40">✦</div>
                            )}
                            {/* Menyatukan foto dengan tema: tepi digelapkan ke navy, semburat ungu-emas */}
                            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,transparent_45%,rgba(10,12,24,0.6)_100%)]" />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-astral/25 via-transparent to-gold/15 mix-blend-soft-light" />
                        </div>

                        {/* Chip skill melayang */}
                        {chips.slice(0, CHIP_POS.length).map((c, i) => (
                            <motion.span
                                key={c}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={
                                    reduce
                                        ? { opacity: 1, scale: 1 }
                                        : { opacity: 1, scale: 1, y: [0, -8, 0] }
                                }
                                transition={{
                                    opacity: { duration: 0.5, delay: 0.9 + i * 0.15 },
                                    scale: { duration: 0.5, delay: 0.9 + i * 0.15 },
                                    y: { duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 },
                                }}
                                className={`absolute z-10 hidden items-center gap-1.5 rounded-sm border border-gold/30 bg-void/70 px-3 py-1.5 font-mono text-xs text-gold-bright shadow-[0_8px_24px_-8px_rgba(0,0,0,0.6)] backdrop-blur-md sm:flex ${CHIP_POS[i]}`}
                            >
                                <span aria-hidden className="text-[10px] text-gold">✦</span>
                                {c}
                            </motion.span>
                        ))}
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>
    );
}