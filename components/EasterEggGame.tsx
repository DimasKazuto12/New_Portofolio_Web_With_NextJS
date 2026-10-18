"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const W = 360;
const H = 480;

type Status = "idle" | "play" | "over";
type Item = { x: number; y: number; ph: number; dead?: boolean };
type Spark = { x: number; y: number; vx: number; vy: number; life: number; max: number; c: string; s: number };

function readBest() {
    try {
        return Number(localStorage.getItem("stardust-best") || 0);
    } catch {
        return 0;
    }
}
function saveBest(v: number) {
    try {
        localStorage.setItem("stardust-best", String(v));
    } catch {
        /* localStorage bisa diblokir, abaikan */
    }
}

export default function EasterEggGame({ open, onClose }: { open: boolean; onClose: () => void }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const bestRef = useRef(0);
    const reduce = useReducedMotion();

    const [status, setStatus] = useState<Status>("idle");
    const [score, setScore] = useState(0);
    const [best, setBest] = useState(0);
    const [lives, setLives] = useState(3);
    const [mult, setMult] = useState(1);
    const [record, setRecord] = useState(false);
    const [prevOpen, setPrevOpen] = useState(open);

    // Ambil skor terbaik setiap kali jendela dibuka
    if (open !== prevOpen) {
        setPrevOpen(open);
        if (open) setBest(readBest());
    }
    useEffect(() => {
        bestRef.current = best;
    }, [best]);

    // Esc menutup jendela
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setStatus("idle");
                onClose();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    // Mesin game. Saat status bukan "play", canvas hanya menampilkan latar bintang yang bergerak pelan
    useEffect(() => {
        if (!open) return;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;
        const c = ctx;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = W * dpr;
        canvas.height = H * dpr;

        const playing = status === "play";
        const py = H - 70;
        const keys = { left: false, right: false };
        const bg = Array.from({ length: 60 }, () => ({
            x: Math.random() * W,
            y: Math.random() * H,
            z: 0.3 + Math.random() * 0.9,
        }));

        let stars: Item[] = [];
        let orbs: Item[] = [];
        let sparks: Spark[] = [];
        let px = W / 2;
        let tx = W / 2;
        let t = 0;
        let vt = 0;
        let spawnStar = 0;
        let spawnOrb = 1;
        let gScore = 0;
        let gLives = 3;
        let gCombo = 0;
        let gMult = 1;
        let inv = 0;
        let shake = 0;
        let running = true;
        let raf = 0;
        let last = performance.now();

        const burst = (x: number, y: number, col: string, n: number, max: number) => {
            for (let i = 0; i < n; i++) {
                const a = Math.random() * Math.PI * 2;
                const v = 30 + Math.random() * (max - 30);
                sparks.push({
                    x, y,
                    vx: Math.cos(a) * v,
                    vy: Math.sin(a) * v,
                    life: 0.4 + Math.random() * 0.5,
                    max: 0.9,
                    c: col,
                    s: 1.5 + Math.random() * 2,
                });
            }
        };

        const finish = () => {
            running = false;
            const rec = gScore > bestRef.current;
            if (rec) {
                saveBest(gScore);
                setBest(gScore);
            }
            setRecord(rec);
            setStatus("over");
        };

        const step = (dt: number, sp: number) => {
            for (const p of sparks) {
                p.x += p.vx * dt;
                p.y += p.vy * dt;
                p.life -= dt;
            }
            sparks = sparks.filter((p) => p.life > 0);
            for (const b of bg) {
                b.y += sp * b.z * dt * 0.6;
                if (b.y > H) {
                    b.y = -10;
                    b.x = Math.random() * W;
                }
            }
        };

        const update = (dt: number) => {
            t += dt;
            // Makin lama makin cepat, dibatasi supaya tetap adil
            const sp = Math.min(150 + t * 7, 380);

            if ((spawnStar -= dt) <= 0) {
                spawnStar = Math.max(0.4, 0.8 - t * 0.004);
                stars.push({ x: 20 + Math.random() * (W - 40), y: -20, ph: Math.random() * 6 });
            }
            if ((spawnOrb -= dt) <= 0) {
                spawnOrb = Math.max(0.45, 1.2 - t * 0.01);
                orbs.push({ x: 24 + Math.random() * (W - 48), y: -30, ph: Math.random() * 6 });
            }

            if (keys.left) tx -= 420 * dt;
            if (keys.right) tx += 420 * dt;
            tx = Math.max(22, Math.min(W - 22, tx));
            px += (tx - px) * Math.min(1, dt * 14);
            inv = Math.max(0, inv - dt);
            shake = Math.max(0, shake - dt * 40);

            for (const s of stars) {
                s.y += sp * dt;
                s.ph += dt * 3;
                if (!s.dead && Math.hypot(s.x - px, s.y - py) < 24) {
                    s.dead = true;
                    gCombo++;
                    const m = Math.min(5, 1 + (gCombo >> 2));
                    if (m !== gMult) {
                        gMult = m;
                        setMult(m);
                    }
                    gScore += 10 * gMult;
                    setScore(gScore);
                    burst(s.x, s.y, "#ecd29a", 12, 140);
                } else if (!s.dead && s.y > H + 20) {
                    s.dead = true;
                    if (gCombo > 0) {
                        gCombo = 0;
                        gMult = 1;
                        setMult(1);
                    }
                }
            }

            for (const o of orbs) {
                o.y += sp * 0.9 * dt;
                o.ph += dt * 3;
                o.x += Math.sin(o.ph) * 40 * dt;
                if (!o.dead && inv <= 0 && Math.hypot(o.x - px, o.y - py) < 24) {
                    o.dead = true;
                    gLives--;
                    setLives(Math.max(0, gLives));
                    inv = 1.4;
                    shake = reduce ? 0 : 14;
                    gCombo = 0;
                    gMult = 1;
                    setMult(1);
                    burst(px, py, "#9b8cff", 30, 220);
                    if (gLives <= 0) finish();
                } else if (o.y > H + 40) {
                    o.dead = true;
                }
            }

            stars = stars.filter((s) => !s.dead);
            orbs = orbs.filter((o) => !o.dead);

            // Jejak mesin kapal
            sparks.push({ x: px + (Math.random() - 0.5) * 8, y: py + 20, vx: (Math.random() - 0.5) * 24, vy: 60 + Math.random() * 60, life: 0.35, max: 0.35, c: "#e8c88a", s: 2 });
            step(dt, sp);
        };

        const starPath = (x: number, y: number, r: number, rot: number) => {
            c.beginPath();
            for (let i = 0; i < 8; i++) {
                const a = rot + (i * Math.PI) / 4;
                const rr = i % 2 ? r * 0.38 : r;
                c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
            }
            c.closePath();
        };

        const draw = () => {
            c.setTransform(dpr, 0, 0, dpr, 0, 0);
            const g = c.createLinearGradient(0, 0, 0, H);
            g.addColorStop(0, "#0b0d22");
            g.addColorStop(1, "#15123a");
            c.fillStyle = g;
            c.fillRect(0, 0, W, H);
            if (shake > 0) c.translate((Math.random() - 0.5) * shake * 0.6, (Math.random() - 0.5) * shake * 0.6);

            // Latar bintang: memanjang jadi garis saat game berjalan
            for (const b of bg) {
                c.fillStyle = `rgba(255,255,255,${0.25 + b.z * 0.4})`;
                c.fillRect(b.x, b.y, 1.3, playing ? b.z * 6 : 1.3);
            }

            // Stardust
            c.shadowColor = "#ecd29a";
            c.shadowBlur = 14;
            c.fillStyle = "#ecd29a";
            for (const s of stars) {
                starPath(s.x, s.y, 12, s.ph);
                c.fill();
            }
            c.shadowBlur = 0;

            // Antimatter Legion: bola ungu dengan cincin putus-putus berputar
            for (const o of orbs) {
                const r = 22;
                const gr = c.createRadialGradient(o.x, o.y, 2, o.x, o.y, r);
                gr.addColorStop(0, "#2a1f5e");
                gr.addColorStop(0.7, "#6a55e0");
                gr.addColorStop(1, "rgba(155,140,255,0)");
                c.fillStyle = gr;
                c.beginPath();
                c.arc(o.x, o.y, r, 0, Math.PI * 2);
                c.fill();
                c.strokeStyle = "rgba(179,168,255,0.85)";
                c.setLineDash([5, 5]);
                c.lineDashOffset = -vt * 25;
                c.beginPath();
                c.arc(o.x, o.y, r - 3, 0, Math.PI * 2);
                c.stroke();
                c.setLineDash([]);
            }

            // Percikan partikel
            for (const p of sparks) {
                c.globalAlpha = Math.max(0, p.life / p.max);
                c.fillStyle = p.c;
                c.fillRect(p.x, p.y, p.s, p.s);
            }
            c.globalAlpha = 1;

            // Kapal Trailblazer (berkedip saat kebal sesaat setelah kena)
            const blink = inv > 0 && Math.floor(inv * 12) % 2 === 1;
            if (status !== "over" && !blink) {
                c.shadowColor = "#ecd29a";
                c.shadowBlur = 22;
                c.fillStyle = "#ecd29a";
                c.beginPath();
                c.moveTo(px, py - 24);
                c.lineTo(px + 16, py + 18);
                c.lineTo(px, py + 9);
                c.lineTo(px - 16, py + 18);
                c.closePath();
                c.fill();
                c.shadowBlur = 0;
                c.fillStyle = "#0a0c18";
                c.beginPath();
                c.moveTo(px, py - 8);
                c.lineTo(px + 4, py + 6);
                c.lineTo(px - 4, py + 6);
                c.closePath();
                c.fill();
            }
        };

        const loop = (now: number) => {
            if (!running) return;
            raf = requestAnimationFrame(loop);
            const dt = Math.min(0.05, (now - last) / 1000);
            last = now;
            vt += dt;
            if (playing) update(dt);
            else step(dt, 60);
            draw();
        };
        raf = requestAnimationFrame(loop);

        const aim = (e: PointerEvent) => {
            const r = canvas.getBoundingClientRect();
            tx = ((e.clientX - r.left) / r.width) * W;
        };
        const down = (e: KeyboardEvent) => {
            const k = e.key.toLowerCase();
            if (k === "arrowleft" || k === "a") { keys.left = true; e.preventDefault(); }
            if (k === "arrowright" || k === "d") { keys.right = true; e.preventDefault(); }
        };
        const up = (e: KeyboardEvent) => {
            const k = e.key.toLowerCase();
            if (k === "arrowleft" || k === "a") keys.left = false;
            if (k === "arrowright" || k === "d") keys.right = false;
        };
        canvas.addEventListener("pointermove", aim);
        canvas.addEventListener("pointerdown", aim);
        window.addEventListener("keydown", down);
        window.addEventListener("keyup", up);

        return () => {
            running = false;
            cancelAnimationFrame(raf);
            canvas.removeEventListener("pointermove", aim);
            canvas.removeEventListener("pointerdown", aim);
            window.removeEventListener("keydown", down);
            window.removeEventListener("keyup", up);
        };
    }, [open, status, reduce]);

    function handleStart() {
        setScore(0);
        setLives(3);
        setMult(1);
        setRecord(false);
        setStatus("play");
    }
    function handleClose() {
        setStatus("idle");
        onClose();
    }

    const hearts = "◆".repeat(Math.max(0, lives)) + "◇".repeat(3 - Math.max(0, lives));

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Stardust Run"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        onClick={(e) => e.stopPropagation()}
                        className="max-h-[95vh] hsr-panel w-full max-w-md px-5 py-5 text-center sm:px-6 sm:py-6"
                    >
                        <p className="hsr-eyebrow text-astral">Simulated Universe · Easter Egg</p>
                        <h3 className="mt-1 font-display text-xl text-glow sm:text-2xl">Stardust Run</h3>

                        {/* HUD */}
                        <div className="mt-4 grid grid-cols-4 gap-2 font-mono text-[11px] text-ink-muted sm:text-xs">
                            <span>Skor <b className="block text-sm text-gold-bright">{score}</b></span>
                            <span>Kombo <b className="block text-sm text-gold-bright">x{mult}</b></span>
                            <span>Nyawa <b className="block text-sm text-gold-bright">{hearts}</b></span>
                            <span>Terbaik <b className="block text-sm text-gold-bright">{best}</b></span>
                        </div>

                        <div className="relative mt-3 overflow-hidden rounded-sm border border-void-border bg-void">
                            <canvas
                                ref={canvasRef}
                                className="block w-full touch-none max-h-[62vh]"
                                style={{ aspectRatio: `${W} / ${H}` }}
                            />

                            {status !== "play" && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute inset-0 grid content-center justify-items-center gap-3 bg-void/75 p-6 backdrop-blur-[2px]"
                                >
                                    <h4 className="font-display text-2xl text-gold-bright">
                                        {status === "over" ? "Misi Gagal" : "Siap, Trailblazer?"}
                                    </h4>
                                    {status === "over" ? (
                                        <p className="text-sm text-ink-muted">
                                            Skor akhir <b className="text-gold-bright">{score}</b>
                                            {record && <span className="mt-1 block">✦ Rekor baru!</span>}
                                        </p>
                                    ) : (
                                        <p className="text-sm text-ink-muted">
                                            Gerakkan kapal dengan ← → atau geser layar. Kumpulkan stardust, hindari Antimatter Legion.
                                        </p>
                                    )}
                                    <button
                                        onClick={handleStart}
                                        autoFocus
                                        className="rounded-sm bg-gold px-8 py-2 text-sm font-medium text-void transition-all hover:bg-gold-bright hover:shadow-[0_0_26px_rgba(236,210,154,0.45)]"
                                    >
                                        {status === "over" ? "Coba Lagi" : "Mulai"}
                                    </button>
                                </motion.div>
                            )}
                        </div>

                        <button
                            onClick={handleClose}
                            className="mt-3 w-full rounded-sm border border-void-border px-6 py-2 text-sm text-ink-muted transition-colors hover:text-gold"
                        >
                            Tutup
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}