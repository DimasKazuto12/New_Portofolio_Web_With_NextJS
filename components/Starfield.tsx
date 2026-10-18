"use client";

import { useEffect, useRef } from "react";

type Star = { x: number; y: number; r: number; baseAlpha: number; twinkleSpeed: number; phase: number };
type Dust = { x: number; y: number; r: number; vy: number; vx: number; hue: string; alpha: number };

export default function Starfield() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const c = ctx;

        let width = 0, height = 0, dpr = 1;
        let stars: Star[] = [];
        let dust: Dust[] = [];
        let rafId = 0;
        let scrollY = window.scrollY;
        // Cahaya lembut yang mengikuti kursor (hanya di perangkat dengan mouse)
        let mx = -1, my = -1, gx = -1, gy = -1;

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const fine = window.matchMedia("(pointer: fine)").matches;

        function size() {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = window.innerWidth;
            height = window.innerHeight;
            canvas!.width = width * dpr;
            canvas!.height = height * dpr;
            c.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        function seed() {
            const starCount = Math.min(160, Math.floor((width * height) / 9000));
            stars = Array.from({ length: starCount }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                r: Math.random() * 1.4 + 0.3,
                baseAlpha: Math.random() * 0.6 + 0.2,
                twinkleSpeed: Math.random() * 1 + 0.4, // radian per detik: kedipan pelan, tidak berkelip cepat
                phase: Math.random() * Math.PI * 2,
            }));
            const dustCount = Math.min(28, Math.floor(width / 60));
            dust = Array.from({ length: dustCount }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                r: Math.random() * 60 + 40,
                vy: -(Math.random() * 0.08 + 0.03),
                vx: Math.random() * 0.04 - 0.02,
                hue: Math.random() > 0.5 ? "236,210,154" : "179,168,255",
                alpha: Math.random() * 0.05 + 0.02,
            }));
        }

        function draw(t: number) {
            c.clearRect(0, 0, width, height);

            dust.forEach((d) => {
                const grad = c.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r);
                grad.addColorStop(0, `rgba(${d.hue},${d.alpha})`);
                grad.addColorStop(1, "rgba(0,0,0,0)");
                c.fillStyle = grad;
                c.beginPath();
                c.arc(d.x, d.y, d.r, 0, Math.PI * 2);
                c.fill();
                if (!reduced) {
                    d.x += d.vx;
                    d.y += d.vy;
                    if (d.y < -d.r) d.y = height + d.r;
                    if (d.x < -d.r) d.x = width + d.r;
                    if (d.x > width + d.r) d.x = -d.r;
                }
            });

            stars.forEach((s) => {
                const tw = reduced ? s.baseAlpha : s.baseAlpha + Math.sin((t / 1000) * s.twinkleSpeed + s.phase) * 0.25;
                // Parallax: bintang yang lebih besar (lebih dekat) bergeser sedikit lebih jauh saat scroll
                const off = reduced ? 0 : scrollY * 0.03 * s.r;
                const y = (((s.y - off) % height) + height) % height;
                c.fillStyle = `rgba(238,235,248,${Math.max(0, tw)})`;
                c.beginPath();
                c.arc(s.x, y, s.r, 0, Math.PI * 2);
                c.fill();
            });

            // Cahaya kursor
            if (fine && !reduced && mx >= 0) {
                gx += (mx - gx) * 0.08;
                gy += (my - gy) * 0.08;
                const g = c.createRadialGradient(gx, gy, 0, gx, gy, 260);
                g.addColorStop(0, "rgba(179,168,255,0.10)");
                g.addColorStop(1, "rgba(179,168,255,0)");
                c.fillStyle = g;
                c.fillRect(gx - 260, gy - 260, 520, 520);
            }

            if (!reduced) rafId = requestAnimationFrame(draw);
        }

        // Saat ukuran berubah sedikit (misalnya address bar HP naik-turun), bintang tidak diacak ulang
        function onResize() {
            const same = window.innerWidth === width && Math.abs(window.innerHeight - height) < 150;
            size();
            if (!same) seed();
            if (reduced) draw(0); // mode reduced motion tidak punya loop, jadi gambar ulang manual
        }
        function onScroll() {
            scrollY = window.scrollY;
        }
        function onMove(e: PointerEvent) {
            if (mx < 0) { gx = e.clientX; gy = e.clientY; }
            mx = e.clientX;
            my = e.clientY;
        }

        size();
        seed();
        draw(0);
        if (!reduced) rafId = requestAnimationFrame(draw);

        window.addEventListener("resize", onResize);
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("pointermove", onMove, { passive: true });

        return () => {
            window.removeEventListener("resize", onResize);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("pointermove", onMove);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, []);

    return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true" />;
}