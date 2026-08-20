"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Particle = { x: number; y: number; r: number; vy: number };

export default function EasterEggGame({ open, onClose }: { open: boolean; onClose: () => void }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const wrapRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number>(0);
    const [score, setScore] = useState(0);
    const [best, setBest] = useState(0);
    const [prevOpen, setOpenRef] = useState(open);
    const [gameOver, setGameOver] = useState(false);
    const [started, setStarted] = useState(false);

    if (open !== prevOpen) {
        setOpenRef(open);
        if (open) {
            setBest(Number(localStorage.getItem("stardust-best") || 0));
        }
    }

    useEffect(() => {
        if (!open || !started) return;
        const canvas = canvasRef.current;
        const wrap = wrapRef.current;
        if (!canvas || !wrap) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const W = 300, H = 400;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        canvas.style.width = `${W}px`;
        canvas.style.height = `${H}px`;
        ctx.scale(dpr, dpr);

        const player = { x: W / 2, y: H - 40, w: 26, h: 26, speed: 5 };
        const keys = { left: false, right: false };
        let stardust: Particle[] = [];
        let debris: Particle[] = [];
        let frame = 0;
        let currentScore = 0;
        let alive = true;
        let speedMultiplier = 1;

        function spawn() {
            if (frame % 28 === 0) {
                stardust.push({ x: Math.random() * (W - 16) + 8, y: -10, r: 6, vy: 2 + Math.random() * 1.5 * speedMultiplier });
            }
            if (frame % 55 === 0) {
                debris.push({ x: Math.random() * (W - 20) + 10, y: -10, r: 10 + Math.random() * 6, vy: 2.4 + Math.random() * 2 * speedMultiplier });
            }
        }

        function update() {
            if (keys.left) player.x -= player.speed;
            if (keys.right) player.x += player.speed;
            player.x = Math.max(player.w / 2, Math.min(W - player.w / 2, player.x));

            stardust.forEach((s) => (s.y += s.vy));
            debris.forEach((d) => (d.y += d.vy));

            stardust = stardust.filter((s) => {
                const dist = Math.hypot(s.x - player.x, s.y - player.y);
                if (dist < s.r + player.w / 2) {
                    currentScore += 10;
                    setScore(currentScore);
                    return false;
                }
                return s.y < H + 20;
            });

            debris = debris.filter((d) => {
                const dist = Math.hypot(d.x - player.x, d.y - player.y);
                if (dist < d.r + player.w / 2 - 4) alive = false;
                return d.y < H + 20;
            });

            speedMultiplier = 1 + currentScore / 400;
            frame++;
        }

        function draw() {
            ctx!.clearRect(0, 0, W, H);
            const g = ctx!.createLinearGradient(0, 0, 0, H);
            g.addColorStop(0, "#0c0f1c");
            g.addColorStop(1, "#05060d");
            ctx!.fillStyle = g;
            ctx!.fillRect(0, 0, W, H);

            stardust.forEach((s) => {
                ctx!.beginPath();
                ctx!.fillStyle = "#e8c88a";
                ctx!.shadowColor = "#cda45e";
                ctx!.shadowBlur = 8;
                ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx!.fill();
                ctx!.shadowBlur = 0;
            });

            debris.forEach((d) => {
                ctx!.beginPath();
                ctx!.fillStyle = "#3a2f4d";
                ctx!.strokeStyle = "#8b7fd4";
                ctx!.lineWidth = 1.5;
                ctx!.arc(d.x, d.y, d.r, 0, Math.PI * 2);
                ctx!.fill();
                ctx!.stroke();
            });

            ctx!.beginPath();
            ctx!.fillStyle = "#cda45e";
            ctx!.moveTo(player.x, player.y - player.h / 2);
            ctx!.lineTo(player.x - player.w / 2, player.y + player.h / 2);
            ctx!.lineTo(player.x + player.w / 2, player.y + player.h / 2);
            ctx!.closePath();
            ctx!.fill();
        }

        function loop() {
            if (!alive) {
                setGameOver(true);
                setBest((prev) => {
                    const newBest = Math.max(prev, currentScore);
                    localStorage.setItem("stardust-best", String(newBest));
                    return newBest;
                });
                return;
            }
            spawn();
            update();
            draw();
            rafRef.current = requestAnimationFrame(loop);
        }

        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "ArrowLeft" || e.key === "a") keys.left = true;
            if (e.key === "ArrowRight" || e.key === "d") keys.right = true;
        }
        function handleKeyUp(e: KeyboardEvent) {
            if (e.key === "ArrowLeft" || e.key === "a") keys.left = false;
            if (e.key === "ArrowRight" || e.key === "d") keys.right = false;
        }
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        function handlePointerMove(e: PointerEvent | TouchEvent) {
            const rect = canvas!.getBoundingClientRect();
            const clientX = "touches" in e ? e.touches[0].clientX : (e as PointerEvent).clientX;
            player.x = ((clientX - rect.left) / rect.width) * W;
        }
        canvas.addEventListener("pointermove", handlePointerMove as EventListener);
        canvas.addEventListener("touchmove", handlePointerMove as EventListener, { passive: true });

        loop();

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
            canvas.removeEventListener("pointermove", handlePointerMove as EventListener);
            canvas.removeEventListener("touchmove", handlePointerMove as EventListener);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [open, started]);

    function handleStart() {
        setScore(0);
        setGameOver(false);
        setStarted(true);
    }
    function handleClose() {
        setStarted(false);
        setGameOver(false);
        onClose();
    }

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
                    onClick={handleClose}
                >
                    <motion.div
                        ref={wrapRef}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onClick={(e) => e.stopPropagation()}
                        className="hsr-panel w-full max-w-sm px-5 py-5 text-center sm:px-6 sm:py-6"
                    >
                        <p className="hsr-eyebrow text-astral">Simulated Universe · Easter Egg</p>
                        <h3 className="mt-1 font-display text-xl text-glow sm:text-2xl">Stardust Run</h3>
                        <p className="mt-2 text-xs text-ink-muted">
                            Gerakkan Trailblazer dengan ← → atau geser layar. Kumpulkan stardust, hindari Antimatter Legion.
                        </p>

                        <div className="mt-4 flex justify-center">
                            <canvas ref={canvasRef} className="max-w-full touch-none rounded-sm border border-void-border" />
                        </div>

                        <div className="mt-3 flex justify-between font-mono text-xs text-ink-muted">
                            <span>Skor: {score}</span>
                            <span>Terbaik: {best}</span>
                        </div>

                        {!started && !gameOver && (
                            <button onClick={handleStart} className="mt-4 w-full rounded-sm bg-gold px-6 py-2 text-sm font-medium text-void hover:bg-gold-bright">
                                Mulai
                            </button>
                        )}
                        {gameOver && (
                            <div className="mt-4 space-y-2">
                                <p className="text-sm text-gold-bright">Trailblaze berakhir!</p>
                                <button onClick={handleStart} className="w-full rounded-sm bg-gold px-6 py-2 text-sm font-medium text-void hover:bg-gold-bright">
                                    Main Lagi
                                </button>
                            </div>
                        )}
                        <button onClick={handleClose} className="mt-3 w-full rounded-sm border border-void-border px-6 py-2 text-sm text-ink-muted hover:text-gold">
                            Tutup
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}