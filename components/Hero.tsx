"use client";

import Image from "next/image";
import {
    motion,
    useReducedMotion,
    useScroll,
    useTransform,
    type Variants,
} from "framer-motion";
import { SiGithub, SiLinkerd, SiInstagram, SiStarship } from "@icons-pack/react-simple-icons";
import { MapPin } from "lucide-react";
import type { SiteSettings } from "@/types";

// Teks muncul satu per satu (stagger) saat halaman dibuka
const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item: Variants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

export default function Hero({ settings }: { settings: SiteSettings | null }) {
    const reduce = useReducedMotion();

    // Saat scroll turun, hero memudar dan naik sedikit
    const { scrollY } = useScroll();
    const fade = useTransform(scrollY, [0, 500], [1, 0.25]);
    const lift = useTransform(scrollY, [0, 500], [0, -40]);

    const socials = [
        { href: settings?.github, icon: SiGithub, label: "GitHub" },
        { href: settings?.linkedin, icon: SiLinkerd, label: "LinkedIn" }, // SiLinkerd = logo Linkerd, bukan LinkedIn
        { href: settings?.instagram, icon: SiInstagram, label: "Instagram" },
    ].filter((s) => s.href);

    return (
        <section
            id="beranda"
            className="relative flex min-h-[100svh] items-center overflow-hidden pt-24 pb-16 lg:pt-20 lg:pb-12"
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(179,168,255,0.16),transparent_60%)]" />

            <motion.div
                style={reduce ? undefined : { opacity: fade, y: lift }}
                className="relative z-10 mx-auto grid w-full max-w-[1440px] items-center gap-10 px-6 sm:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14 lg:px-16 xl:px-20"
            >
                {/* Kolom teks: kiri di desktop, di bawah foto di HP */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="order-2 text-center lg:order-1 lg:text-left"
                >
                    <motion.p variants={item} className="hsr-eyebrow mb-3 md:mb-4">
                        Trailblaze Mission · 001
                    </motion.p>

                    <motion.h1
                        variants={item}
                        className="font-display text-4xl font-semibold leading-[1.08] sm:text-5xl md:text-6xl xl:text-7xl"
                    >
                        {/* Kilau emas pelan. Ganti #ecd29a dengan warna gold-bright kamu kalau beda */}
                        <motion.span
                            className="inline-block bg-[linear-gradient(100deg,#fff_30%,#ecd29a_45%,#fff_60%)] bg-[length:250%_100%] bg-clip-text text-transparent"
                            animate={reduce ? undefined : { backgroundPosition: ["0% 0%", "-250% 0%"] }}
                            transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
                        >
                            {settings?.name}
                        </motion.span>
                    </motion.h1>

                    <motion.p variants={item} className="mt-4 md:mt-5">
                        <span className="inline-block rounded-full border border-astral/50 px-4 py-1 font-mono text-xs tracking-wide text-astral sm:text-sm">
                            {settings?.role}
                        </span>
                    </motion.p>

                    {settings?.location && (
                        <motion.p
                            variants={item}
                            className="mt-3 flex items-center justify-center gap-1.5 text-sm text-ink-muted lg:justify-start"
                        >
                            <MapPin size={14} /> {settings.location}
                        </motion.p>
                    )}

                    <motion.p
                        variants={item}
                        className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-ink-muted md:mt-6 md:text-lg lg:mx-0"
                    >
                        {settings?.tagline}
                    </motion.p>

                    <motion.div
                        variants={item}
                        className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 lg:justify-start md:mt-8"
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
                    </motion.div>

                    {/* Ikon sosial media: muncul otomatis kalau link diisi di admin */}
                    {socials.length > 0 && (
                        <motion.div
                            variants={item}
                            className="mt-6 flex items-center justify-center gap-4 lg:justify-start"
                        >
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
                </motion.div>

                {/* Kolom foto: kanan di desktop, di atas di HP */}
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
                        {/* Dua cincin orbit berputar pelan, arah berlawanan */}
                        <motion.div
                            aria-hidden
                            animate={reduce ? undefined : { rotate: 360 }}
                            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                            className="absolute -inset-4 rounded-full border border-dashed border-gold/30 lg:-inset-6"
                        />
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
                                <div className="flex h-full items-center justify-center text-5xl text-gold/40"><SiStarship size={30}/></div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>
    );
}