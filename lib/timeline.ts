export const KINDS = ["pendidikan", "pengalaman"] as const;
export type Kind = (typeof KINDS)[number];

export type TimelineRow = {
    id: string;
    kind: string;
    title: string;
    subtitle: string;
    startYear: number;
    endYear: number | null;
    description: string | null;
    highlights: string | null;
    learned: string | null;
};

/** Memecah teks "satu poin per baris" menjadi daftar, sambil membuang tanda - atau • di depan */
export function splitLines(text: string | null | undefined): string[] {
    if (!text) return [];
    return text
        .split("\n")
        .map((s) => s.replace(/^[-•*]\s*/, "").trim())
        .filter(Boolean);
}

/** Validasi input dari admin. Mengembalikan null kalau tidak valid. */
export function parseTimelineInput(body: unknown) {
    const b = (body ?? {}) as Record<string, unknown>;
    const thisYear = new Date().getFullYear();

    const kind = String(b.kind ?? "");
    const title = String(b.title ?? "").trim();
    const subtitle = String(b.subtitle ?? "").trim();
    const startYear = Number(b.startYear);
    const endYear = b.endYear == null || b.endYear === "" ? null : Number(b.endYear);
    const description = String(b.description ?? "").trim() || null;
    const highlights = String(b.highlights ?? "").trim() || null;
    const learned = String(b.learned ?? "").trim() || null;

    if (!KINDS.includes(kind as Kind)) return null;
    if (!title || title.length > 100) return null;
    if (subtitle.length > 100) return null;
    if (kind === "pengalaman" && !subtitle) return null; // pengalaman wajib punya posisi
    if (!Number.isInteger(startYear) || startYear < 1990 || startYear > thisYear + 8) return null;
    if (endYear !== null && (!Number.isInteger(endYear) || endYear < startYear || endYear > thisYear + 8)) return null;
    if (description && description.length > 600) return null;
    if (learned && learned.length > 2000) return null;
    if (highlights) {
        const lines = splitLines(highlights);
        if (highlights.length > 1500 || lines.length > 12 || lines.some((l) => l.length > 200)) return null;
    }

    return { kind, title, subtitle, startYear, endYear, description, highlights, learned };
}