
export type SkillItem = { name: string; level: 1 | 2 | 3 | 4 | 5 };
export type SkillGroup = { title: string; note?: string; skills: SkillItem[] };

export type SkillRow = { name: string; category: string; level: number; sortOrder: number };

/** Mengelompokkan baris skill menjadi grup. Urutan grup mengikuti sortOrder terkecil di dalamnya. */
export function groupSkills(rows: SkillRow[]): SkillGroup[] {
  const map = new Map<string, { order: number; skills: SkillItem[] }>();

  for (const r of rows) {
    const g = map.get(r.category) ?? { order: r.sortOrder, skills: [] };
    g.order = Math.min(g.order, r.sortOrder);
    g.skills.push({ name: r.name, level: Math.min(5, Math.max(1, r.level)) as 1 | 2 | 3 | 4 | 5 });
    map.set(r.category, g);
  }

  return [...map.entries()]
    .sort((a, b) => a[1].order - b[1].order)
    .map(([title, g]) => ({ title, skills: g.skills }));
}

/** Validasi input dari admin. Mengembalikan null kalau tidak valid. */
export function parseSkillInput(body: unknown) {
  const b = (body ?? {}) as Record<string, unknown>;
  const name = String(b.name ?? "").trim();
  const category = String(b.category ?? "").trim();
  const level = Number(b.level);
  const sortOrder = Number(b.sortOrder ?? 0);

  if (!name || name.length > 60) return null;
  if (!category || category.length > 40) return null;
  if (!Number.isInteger(level) || level < 1 || level > 5) return null;
  if (!Number.isInteger(sortOrder)) return null;

  return { name, category, level, sortOrder };
}