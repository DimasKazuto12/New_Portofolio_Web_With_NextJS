"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "./About";
import { splitLines, type TimelineRow } from "@/lib/timeline";
import Band from "./Band";

type Kind = "pendidikan" | "pengalaman";

const SECTIONS: { kind: Kind; id: string; eyebrow: string; title: string }[] = [
    { kind: "pendidikan", id: "pendidikan", eyebrow: "Education", title: "Riwayat Pendidikan" },
    { kind: "pengalaman", id: "pengalaman", eyebrow: "Experience", title: "Pengalaman Kerja" },
];

export default function Timeline({ items }: { items: TimelineRow[] }) {
    const groups = SECTIONS.map((s) => ({ ...s, rows: items.filter((i) => i.kind === s.kind) })).filter(
        (g) => g.rows.length > 0
    );
    if (groups.length === 0) return null;

    return (
        <div id="riwayat">
            {groups.map((g, i) => (
                <Band key={g.kind} tone={i % 2 === 0 ? "gold" : "astral"}>
                    <section
                        id={g.id}
                        className="relative mx-auto max-w-[1440px] px-6 py-20 sm:px-10 md:py-28 lg:px-16 xl:px-20"
                    >
                        <SectionHeading eyebrow={g.eyebrow} title={g.title} />
                        <TimelineList rows={g.rows} kind={g.kind} />
                    </section>
                </Band>
            ))}
        </div>
    );
}

function TimelineList({ rows, kind }: { rows: TimelineRow[]; kind: Kind }) {
    const solo = rows.length < 2;

    return (
        <ol className={`relative mx-auto mt-10 space-y-8 md:mt-14 lg:space-y-10 ${solo ? "max-w-3xl" : "max-w-6xl"}`}>
            {/* Garis emas: di kiri (HP), di tengah (desktop dengan 2 entri atau lebih) */}
            <span aria-hidden className={`absolute bottom-0 left-3 top-0 w-px bg-gold/30 ${solo ? "" : "lg:left-1/2"}`} />

            {rows.map((r, i) => (
                <motion.li
                    key={r.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.05, ease: "easeOut" } }}
                    viewport={{ once: true, margin: "-60px" }}
                    className={`relative pl-10 ${solo ? "" : "lg:grid lg:grid-cols-2 lg:gap-16 lg:pl-0"}`}
                >
                    <span
                        aria-hidden
                        className={`absolute left-3 top-7 grid h-4 w-4 -translate-x-1/2 place-items-center bg-void text-[10px] text-gold-bright ${solo ? "" : "lg:left-1/2"
                            }`}
                    >
                        ◆
                    </span>

                    <div className={!solo && i % 2 === 1 ? "lg:col-start-2" : "lg:col-start-1"}>
                        <EntryCard r={r} kind={kind} />
                    </div>
                </motion.li>
            ))}
        </ol>
    );
}

function EntryCard({ r, kind }: { r: TimelineRow; kind: Kind }) {
    const ongoing = r.endYear === null;
    const work = kind === "pengalaman";
    const points = splitLines(r.highlights);
    const sub = r.subtitle.trim();
    const hasSub = sub !== "" && sub !== "-" && sub !== "–";

    return (
        <div className="hsr-panel p-5 md:p-7">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <time className="font-mono text-xs text-gold-dim">
                    {r.startYear} – {ongoing ? "Sekarang" : r.endYear}
                </time>
                {ongoing && (
                    <span className="rounded-full border border-stardust/40 bg-stardust/10 px-2 py-0.5 text-[10px] text-stardust">
                        Sedang berjalan
                    </span>
                )}
            </div>

            <h3 className="mt-2 font-display text-xl text-ink-primary md:text-2xl">{r.title}</h3>

            {/* Pengalaman: posisi ditonjolkan sebagai lencana. Pendidikan: jurusan sebagai teks */}

            {hasSub &&
                (work ? (
                    <p className="mt-2">
                        <span className="inline-block rounded-full border border-astral/50 px-3 py-0.5 font-mono text-xs text-astral">
                            {r.subtitle}
                        </span>
                    </p>
                ) : (
                    <p className="mt-1 text-sm text-astral">{r.subtitle}</p>
                ))}

            {r.description && <p className="mt-4 text-sm leading-relaxed text-ink-muted">{r.description}</p>}

            {points.length > 0 && (
                <div className="mt-5">
                    <p className="hsr-eyebrow mb-2">{work ? "Yang saya kerjakan" : "Pencapaian"}</p>
                    <ul className="space-y-1.5">
                        {points.map((t, idx) => (
                            <li key={idx} className="flex gap-2 text-sm leading-relaxed text-ink-muted">
                                <span aria-hidden className="mt-1 text-[10px] text-gold">✦</span>
                                <span>{t}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {r.learned && (
                <div className="mt-5 border-l-2 border-astral/50 pl-4">
                    <p className="hsr-eyebrow mb-1 text-astral">Yang saya pelajari</p>
                    <p className="whitespace-pre-line text-sm leading-relaxed text-ink-muted">{r.learned}</p>
                </div>
            )}
        </div>
    );
}