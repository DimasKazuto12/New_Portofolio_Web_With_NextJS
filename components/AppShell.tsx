"use client";

import { useCallback, useState } from "react";
import { MotionConfig } from "framer-motion";
import Navbar from "@/components/Navbar";
import EasterEggGame from "@/components/EasterEggGame";

export default function AppShell({ children }: { children: React.ReactNode }) {
    const [gameOpen, setGameOpen] = useState(false);

    const openGame = useCallback(() => setGameOpen(true), []);
    const closeGame = useCallback(() => setGameOpen(false), []);

    return (
        // reducedMotion="user": semua animasi framer-motion otomatis dikurangi
        // bagi pengunjung yang mengaktifkan "kurangi gerakan" di perangkatnya
        <MotionConfig reducedMotion="user">
            <a
                href="#konten"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-sm focus:bg-gold focus:px-4 focus:py-2 focus:text-sm focus:text-void"
            >
                Lewati ke konten
            </a>

            <div
                aria-hidden
                className="pointer-events-none fixed inset-0 -z-[9] bg-[linear-gradient(rgba(236,210,154,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(236,210,154,0.035)_1px,transparent_1px)] bg-[size:56px_56px] [-webkit-mask-image:radial-gradient(ellipse_85%_75%_at_50%_30%,black,transparent)] [mask-image:radial-gradient(ellipse_85%_75%_at_50%_30%,black,transparent)]"
            />
            <Navbar onOpenGame={openGame} />
            <main id="konten" className="pb-20 md:pb-0">{children}</main>
            <EasterEggGame open={gameOpen} onClose={closeGame} />
        </MotionConfig>
    );
}