"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { SiStarship } from "@icons-pack/react-simple-icons";

const links = [
    { href: "#beranda", label: "Beranda", icon: "◆" },
    { href: "#tentang", label: "Tentang", icon: "✦" },
    { href: "#pencapaian", label: "Relik", icon: "★" },
    { href: "#proyek", label: "Misi", icon: "▲" },
    { href: "#riwayat", label: "Riwayat", icon: "◷", desktopOnly: true },
    { href: "#kontak", label: "Kontak", icon: "✉" },
];

export default function Navbar({ onOpenGame }: { onOpenGame: () => void }) {
    const [active, setActive] = useState("#beranda");

    // Garis progres scroll di paling atas layar
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

    // Menandai menu sesuai section yang sedang dilihat
    useEffect(() => {
        const els = links
            .map((l) => document.querySelector(l.href))
            .filter((el): el is Element => el !== null);

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) setActive("#" + e.target.id);
                });
            },
            { rootMargin: "-40% 0px -55% 0px" }
        );
        els.forEach((el) => io.observe(el));

        // Section terakhir (Kontak) pendek, jadi tandai manual saat sudah di dasar halaman
        const onScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 4) {
                setActive(links[links.length - 1].href);
            }
        };
        window.addEventListener("scroll", onScroll, { passive: true });

        return () => {
            io.disconnect();
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    return (
        <>
            <motion.div
                aria-hidden
                style={{ scaleX }}
                className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-gradient-to-r from-gold via-gold-bright to-astral"
            />

            {/* Desktop: grid 3 kolom supaya menu benar-benar di tengah */}
            <header className="fixed top-0 inset-x-0 z-40 hidden border-b border-void-border/60 bg-void/70 backdrop-blur-md md:block">
                <nav className="mx-auto grid max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center px-6 py-4 sm:px-10 lg:px-16 xl:px-20">
                    <a href="#beranda" className="font-display text-sm tracking-[0.2em] text-gold-bright">TRAILBLAZE LOG</a>

                    <ul className="flex gap-8 lg:gap-10">
                        {links.map((l) => {
                            const on = active === l.href;
                            return (
                                <li key={l.href}>
                                    <a
                                        href={l.href}
                                        aria-current={on ? "true" : undefined}
                                        className={`hsr-eyebrow relative transition-colors ${on ? "text-gold-bright" : "text-ink-muted hover:text-gold"}`}
                                    >
                                        {l.label}
                                        {on && (
                                            <motion.span
                                                layoutId="nav-underline"
                                                transition={{ type: "spring", stiffness: 380, damping: 34 }}
                                                className="absolute inset-x-0 -bottom-1.5 h-px bg-gold"
                                            />
                                        )}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>

                    <button
                        onClick={onOpenGame}
                        aria-label="Buka mini game rahasia"
                        className="justify-self-end text-lg text-gold/70 transition-transform hover:rotate-90 hover:scale-125 hover:text-gold-bright"
                    >
                        <SiStarship size={23} />
                    </button>
                </nav>
            </header>

            {/* Mobile: header atas */}
            <header className="fixed top-0 inset-x-0 z-40 flex items-center justify-between border-b border-void-border/60 bg-void/80 px-4 py-3 backdrop-blur-md md:hidden">
                <span className="font-display text-xs tracking-[0.2em] text-gold-bright">TRAILBLAZE LOG</span>
                <button onClick={onOpenGame} aria-label="Buka mini game rahasia" className="text-lg text-gold/70"><SiStarship size={19} /></button>
            </header>

            {/* Mobile: menu bawah */}
            <nav className="fixed bottom-0 inset-x-0 z-40 flex justify-around border-t border-void-border/60 bg-void/90 pb-safe pt-2 backdrop-blur-md md:hidden">
                {links.map((l) => {
                    const on = active === l.href;
                    return (
                        <a
                            key={l.href}
                            href={l.href}
                            aria-current={on ? "true" : undefined}
                            className={`relative flex flex-col items-center gap-0.5 px-2 pb-2 transition-colors ${on ? "text-gold-bright" : "text-ink-muted"}`}
                        >
                            {on && (
                                <motion.span
                                    layoutId="nav-dot"
                                    transition={{ type: "spring", stiffness: 380, damping: 34 }}
                                    className="absolute -top-2 left-1/2 h-px w-8 -translate-x-1/2 bg-gold"
                                />
                            )}
                            <span className="text-base">{l.icon}</span>
                            <span className="text-[10px]">{l.label}</span>
                        </a>
                    );
                })}
            </nav>
        </>
    );
}