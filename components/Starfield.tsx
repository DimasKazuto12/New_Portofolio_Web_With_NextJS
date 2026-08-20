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

        let width = 0, height = 0;
        let stars: Star[] = [];
        let dust: Dust[] = [];
        let rafId = 0;
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        function resize() {
            width = canvas!.width = window.innerWidth;
            height = canvas!.height = window.innerHeight;
            const starCount = Math.min(160, Math.floor((width * height) / 9000));
            stars = Array.from({ length: starCount }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                r: Math.random() * 1.4 + 0.3,
                baseAlpha: Math.random() * 0.6 + 0.2,
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                phase: Math.random() * Math.PI * 2,
            }));
            const dustCount = Math.min(28, Math.floor(width / 60));
            dust = Array.from({ length: dustCount }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                r: Math.random() * 60 + 40,
                vy: -(Math.random() * 0.08 + 0.03),
                vx: Math.random() * 0.04 - 0.02,
                hue: Math.random() > 0.5 ? "205,164,94" : "139,127,212",
                alpha: Math.random() * 0.05 + 0.02,
            }));
        }

        function draw(t: number) {
            ctx!.clearRect(0, 0, width, height);

            dust.forEach((d) => {
                const grad = ctx!.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r);
                grad.addColorStop(0, `rgba(${d.hue},${d.alpha})`);
                grad.addColorStop(1, "rgba(0,0,0,0)");
                ctx!.fillStyle = grad;
                ctx!.beginPath();
                ctx!.arc(d.x, d.y, d.r, 0, Math.PI * 2);
                ctx!.fill();
                if (!prefersReducedMotion) {
                    d.x += d.vx;
                    d.y += d.vy;
                    if (d.y < -d.r) d.y = height + d.r;
                    if (d.x < -d.r) d.x = width + d.r;
                    if (d.x > width + d.r) d.x = -d.r;
                }
            });

            stars.forEach((s) => {
                const tw = prefersReducedMotion ? s.baseAlpha : s.baseAlpha + Math.sin(t * s.twinkleSpeed + s.phase) * 0.25;
                ctx!.fillStyle = `rgba(234,231,245,${Math.max(0, tw)})`;
                ctx!.beginPath();
                ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx!.fill();
            });

            if (!prefersReducedMotion) rafId = requestAnimationFrame(draw);
        }

        resize();
        window.addEventListener("resize", resize);
        draw(0);

        return () => {
            window.removeEventListener("resize", resize);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, []);

    return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true" />;
}