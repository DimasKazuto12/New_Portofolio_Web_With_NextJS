"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Award, FolderKanban, Mail, MailOpen, Reply, Route, User, Layers } from "lucide-react";
import type { CertificateWithSkills, SiteSettings, Project, Skill, PathSkill, TechSkill } from "@/types";
import ImageUploader from "@/components/admin/ImageUploader";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminShell, {
  AdminSection,
  AdminPanel,
  AdminList,
  AdminSkeleton,
  Field,
  type AdminTab,
} from "@/components/admin/AdminShell";
import AdminListItem, { ConfirmDelete } from "@/components/admin/AdminListItem";

const JSON_HEADERS = { "Content-Type": "application/json" };

/** Kirim request JSON, lempar error kalau gagal supaya bisa ditampilkan ke admin */
async function send(url: string, method: string, body?: unknown) {
  const res = await fetch(url, {
    method,
    headers: JSON_HEADERS,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) {
    const d = await res.json().catch(() => ({}));
    throw new Error(d.error || "Permintaan gagal.");
  }
}

/** Memuat daftar dari API */
function useList<T>(url: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    try {
      const res = await fetch(url);
      const d = await res.json();
      setItems(d.data || []);
    } finally {
      setLoading(false);
    }
  }, [url]);
  useEffect(() => {
    load();
  }, [load]);
  return { items, loading, load };
}

type FlashMsg = { ok: boolean; text: string } | null;

/** Pesan sukses/gagal singkat yang hilang sendiri */
function useFlash() {
  const [flash, setFlash] = useState<FlashMsg>(null);
  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 3500);
    return () => clearTimeout(t);
  }, [flash]);
  return [flash, setFlash] as const;
}

function FormActions({
  editing,
  addLabel,
  saving,
  flash,
  onCancel,
}: {
  editing: boolean;
  addLabel: string;
  saving: boolean;
  flash: FlashMsg;
  onCancel: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
      <button type="submit" disabled={saving} className="btn-gold">
        {saving ? "Menyimpan..." : editing ? "Simpan Perubahan" : addLabel}
      </button>
      {editing && (
        <button type="button" onClick={onCancel} className="btn-ghost py-2.5">
          Batal
        </button>
      )}
      <div role="status" aria-live="polite">
        <AnimatePresence>
          {flash && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`text-sm ${flash.ok ? "text-stardust" : "text-red-400"}`}
            >
              {flash.ok ? "✓" : "⚠"} {flash.text}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const errText = (e: unknown) => (e instanceof Error ? e.message : "Terjadi kesalahan.");
const toTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

type TabId = "certificates" | "projects" | "paths"| "skills" | "messages" | "settings";

export default function AdminPage() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState<TabId>("certificates");
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    fetch("/api/admin/check")
      .then((r) => r.json())
      .then((d) => setAuthorized(d.authorized))
      .catch(() => setAuthorized(false));
  }, []);

  // Jumlah pesan belum dibaca untuk lencana di tab
  useEffect(() => {
    if (!authorized) return;
    fetch("/api/messages")
      .then((r) => r.json())
      .then((d) => setUnread((d.data || []).filter((m: { isRead: boolean }) => !m.isRead).length))
      .catch(() => {});
  }, [authorized]);

  async function handleLogin(password: string) {
    setLoginError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: JSON_HEADERS,
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setAuthorized(true);
        return true;
      }
      const d = await res.json().catch(() => ({}));
      setLoginError(d.error || "Password salah.");
    } catch {
      setLoginError("Tidak bisa terhubung ke server.");
    }
    return false; // memicu getaran kartu login
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthorized(false);
  }

  if (authorized === null) {
    return (
      <div aria-busy="true" className="grid min-h-screen animate-pulse place-items-center text-5xl text-gold/60">
        ✦
      </div>
    );
  }

  if (!authorized) return <AdminLogin onSubmit={handleLogin} error={loginError} />;

  const tabs: AdminTab[] = [
    { id: "certificates", label: "Sertifikat", icon: Award },
    { id: "projects", label: "Proyek", icon: FolderKanban },
    { id: "paths", label: "Peran", icon: Route },
    { id: "skills", label: "Skill", icon: Layers },
    { id: "messages", label: "Pesan Masuk", icon: Mail, badge: unread },
    { id: "settings", label: "Info Profil", icon: User },
  ];

  return (
    <AdminShell tabs={tabs} active={tab} onChange={(id) => setTab(id as TabId)} onLogout={handleLogout}>
      {tab === "certificates" && <CertificatesTab />}
      {tab === "projects" && <ProjectsTab />}
      {tab === "paths" && <PathsTab />}
      {tab === "skills" && <SkillsTab />}
      {tab === "messages" && <MessagesTab onUnread={setUnread} />}
      {tab === "settings" && <SettingsTab />}
    </AdminShell>
  );
}

/* ===================== SERTIFIKAT ===================== */

type CertForm = {
  title: string;
  issuer: string;
  date: string;
  rarity: number;
  description: string;
  link: string;
  sortOrder: number;
  skills: string;
  imageUrl: string;
};

const emptyCert: CertForm = {
  title: "", issuer: "", date: "", rarity: 4, description: "", link: "", sortOrder: 0, skills: "", imageUrl: "",
};

function CertificatesTab() {
  const { items, loading, load } = useList<CertificateWithSkills>("/api/certificates");
  const [form, setForm] = useState<CertForm>(emptyCert);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useFlash();

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === "rarity" || name === "sortOrder" ? Number(value) : value }));
  }

  function startEdit(item: CertificateWithSkills) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      issuer: item.issuer,
      date: item.date,
      rarity: item.rarity,
      description: item.description || "",
      link: item.link || "",
      sortOrder: item.sortOrder,
      skills: item.skills.map((s: Skill) => s.name).join(", "),
      imageUrl: item.imageUrl || "",
    });
    toTop();
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyCert);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean) };
    const wasEditing = !!editingId;
    try {
      if (editingId) await send(`/api/certificates/${editingId}`, "PUT", payload);
      else await send("/api/certificates", "POST", payload);
      setFlash({ ok: true, text: wasEditing ? "Perubahan disimpan." : "Sertifikat ditambahkan." });
      cancelEdit();
      await load();
    } catch (err) {
      setFlash({ ok: false, text: errText(err) });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await send(`/api/certificates/${id}`, "DELETE");
      if (editingId === id) cancelEdit();
      await load();
    } catch (err) {
      setFlash({ ok: false, text: errText(err) });
    }
  }

  if (loading) return <AdminSkeleton />;

  return (
    <AdminSection
      eyebrow="Relic Cache"
      title={editingId ? "Edit Sertifikat" : "Tambah Sertifikat"}
      listTitle="Daftar Sertifikat"
      count={items.length}
      form={
        <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <ImageUploader
              label="Foto Sertifikat (opsional)"
              value={form.imageUrl}
              aspect="16/10"
              onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
            />
          </div>
          <Field label="Judul sertifikat" htmlFor="c-title">
            <input id="c-title" name="title" value={form.title} onChange={handleChange} required className="input" />
          </Field>
          <Field label="Penerbit" htmlFor="c-issuer">
            <input id="c-issuer" name="issuer" value={form.issuer} onChange={handleChange} required className="input" />
          </Field>
          <Field label="Tahun" htmlFor="c-date">
            <input id="c-date" name="date" value={form.date} onChange={handleChange} placeholder="mis. 2025" required className="input" />
          </Field>
          <Field label="Rarity" htmlFor="c-rarity">
            <select id="c-rarity" name="rarity" value={form.rarity} onChange={handleChange} className="input">
              {[3, 4, 5].map((r) => (
                <option key={r} value={r}>{r} bintang</option>
              ))}
            </select>
          </Field>
          <Field label="Link (opsional)" htmlFor="c-link">
            <input id="c-link" name="link" value={form.link} onChange={handleChange} className="input" />
          </Field>
          <Field label="Urutan tampil" htmlFor="c-sort">
            <input id="c-sort" name="sortOrder" type="number" value={form.sortOrder} onChange={handleChange} className="input" />
          </Field>
          <Field label="Skill" htmlFor="c-skills" className="sm:col-span-2">
            <input id="c-skills" name="skills" value={form.skills} onChange={handleChange} placeholder="Pisahkan dengan koma, mis. React, Next.js" className="input" />
          </Field>
          <Field label="Deskripsi singkat" htmlFor="c-desc" className="sm:col-span-2">
            <textarea id="c-desc" name="description" value={form.description} onChange={handleChange} rows={3} className="input" />
          </Field>
          <FormActions editing={!!editingId} addLabel="Tambah Sertifikat" saving={saving} flash={flash} onCancel={cancelEdit} />
        </form>
      }
      list={
        <AdminList empty="Belum ada sertifikat.">
          {items.map((item) => (
            <AdminListItem
              key={item.id}
              title={item.title}
              subtitle={`${item.issuer} · ${item.date} · ${item.rarity}★`}
              imageUrl={item.imageUrl}
              onEdit={() => startEdit(item)}
              onDelete={() => handleDelete(item.id)}
            />
          ))}
        </AdminList>
      }
    />
  );
}

/* ===================== PROYEK ===================== */

type ProjectForm = {
  code: string;
  title: string;
  description: string;
  stack: string;
  link: string;
  sortOrder: number;
  imageUrl: string;
};

const emptyProject: ProjectForm = { code: "", title: "", description: "", stack: "", link: "", sortOrder: 0, imageUrl: "" };

function ProjectsTab() {
  const { items, loading, load } = useList<Project>("/api/projects");
  const [form, setForm] = useState<ProjectForm>(emptyProject);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useFlash();

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === "sortOrder" ? Number(value) : value }));
  }

  function startEdit(item: Project) {
    setEditingId(item.id);
    setForm({
      code: item.code,
      title: item.title,
      description: item.description,
      stack: item.stack.join(", "),
      link: item.link || "",
      sortOrder: item.sortOrder,
      imageUrl: item.imageUrl || "",
    });
    toTop();
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyProject);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, stack: form.stack.split(",").map((s) => s.trim()).filter(Boolean) };
    const wasEditing = !!editingId;
    try {
      if (editingId) await send(`/api/projects/${editingId}`, "PUT", payload);
      else await send("/api/projects", "POST", payload);
      setFlash({ ok: true, text: wasEditing ? "Perubahan disimpan." : "Proyek ditambahkan." });
      cancelEdit();
      await load();
    } catch (err) {
      setFlash({ ok: false, text: errText(err) });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await send(`/api/projects/${id}`, "DELETE");
      if (editingId === id) cancelEdit();
      await load();
    } catch (err) {
      setFlash({ ok: false, text: errText(err) });
    }
  }

  if (loading) return <AdminSkeleton />;

  return (
    <AdminSection
      eyebrow="Mission Records"
      title={editingId ? "Edit Proyek" : "Tambah Proyek"}
      listTitle="Daftar Proyek"
      count={items.length}
      form={
        <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <ImageUploader
              label="Foto proyek (opsional)"
              value={form.imageUrl}
              aspect="16/10"
              onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
            />
          </div>
          <Field label="Kode misi" htmlFor="p-code">
            <input id="p-code" name="code" value={form.code} onChange={handleChange} placeholder="mis. MISSION 01" required className="input" />
          </Field>
          <Field label="Judul proyek" htmlFor="p-title">
            <input id="p-title" name="title" value={form.title} onChange={handleChange} required className="input" />
          </Field>
          <Field label="Link (opsional)" htmlFor="p-link">
            <input id="p-link" name="link" value={form.link} onChange={handleChange} className="input" />
          </Field>
          <Field label="Urutan tampil" htmlFor="p-sort">
            <input id="p-sort" name="sortOrder" type="number" value={form.sortOrder} onChange={handleChange} className="input" />
          </Field>
          <Field label="Tech stack" htmlFor="p-stack" className="sm:col-span-2">
            <input id="p-stack" name="stack" value={form.stack} onChange={handleChange} placeholder="Pisahkan dengan koma, mis. Next.js, Prisma" className="input" />
          </Field>
          <Field label="Deskripsi proyek" htmlFor="p-desc" className="sm:col-span-2">
            <textarea id="p-desc" name="description" value={form.description} onChange={handleChange} rows={4} required className="input" />
          </Field>
          <FormActions editing={!!editingId} addLabel="Tambah Proyek" saving={saving} flash={flash} onCancel={cancelEdit} />
        </form>
      }
      list={
        <AdminList empty="Belum ada proyek.">
          {items.map((item) => (
            <AdminListItem
              key={item.id}
              title={item.title}
              subtitle={`${item.code} · ${item.stack.join(", ")}`}
              imageUrl={item.imageUrl}
              onEdit={() => startEdit(item)}
              onDelete={() => handleDelete(item.id)}
            />
          ))}
        </AdminList>
      }
    />
  );
}

/* ===================== PATH / SKILL ===================== */

type PathForm = { pathName: string; skill: string; detail: string; sortOrder: number };
const emptyPath: PathForm = { pathName: "", skill: "", detail: "", sortOrder: 0 };

function PathsTab() {
  const { items, loading, load } = useList<PathSkill>("/api/paths");
  const [form, setForm] = useState<PathForm>(emptyPath);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useFlash();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === "sortOrder" ? Number(value) : value }));
  }

  function startEdit(item: PathSkill) {
    setEditingId(item.id);
    setForm({ pathName: item.pathName, skill: item.skill, detail: item.detail, sortOrder: item.sortOrder });
    toTop();
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyPath);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const wasEditing = !!editingId;
    try {
      if (editingId) await send(`/api/paths/${editingId}`, "PUT", form);
      else await send("/api/paths", "POST", form);
      setFlash({ ok: true, text: wasEditing ? "Perubahan disimpan." : "Path ditambahkan." });
      cancelEdit();
      await load();
    } catch (err) {
      setFlash({ ok: false, text: errText(err) });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await send(`/api/paths/${id}`, "DELETE");
      if (editingId === id) cancelEdit();
      await load();
    } catch (err) {
      setFlash({ ok: false, text: errText(err) });
    }
  }

  if (loading) return <AdminSkeleton />;

  return (
    <AdminSection
      eyebrow="Peran"
      title={editingId ? "Edit Peran" : "Tambah Peran"}
      listTitle="Daftar Path"
      count={items.length}
      form={
        <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
          <Field label="Julukan Path" htmlFor="pa-name">
            <input id="pa-name" name="pathName" value={form.pathName} onChange={handleChange} placeholder="mis. Destruction" required className="input" />
          </Field>
          <Field label="Peran" htmlFor="pa-skill">
            <input id="pa-skill" name="skill" value={form.skill} onChange={handleChange} placeholder="mis. Frontend Development" required className="input" />
          </Field>
          <Field label="Detail" htmlFor="pa-detail" className="sm:col-span-2">
            <input id="pa-detail" name="detail" value={form.detail} onChange={handleChange} placeholder="mis. React, Next.js, Tailwind" required className="input" />
          </Field>
          <FormActions editing={!!editingId} addLabel="Tambah Path" saving={saving} flash={flash} onCancel={cancelEdit} />
        </form>
      }
      list={
        <AdminList empty="Belum ada peran">
          {items.map((item) => (
            <AdminListItem
              key={item.id}
              thumb={false}
              title={`${item.pathName} — ${item.skill}`}
              subtitle={item.detail}
              onEdit={() => startEdit(item)}
              onDelete={() => handleDelete(item.id)}
            />
          ))}
        </AdminList>
      }
    />
  );
}

/* ===================== SKILL (keahlian) ===================== */

type SkillForm = { name: string; category: string; level: number; sortOrder: number };
const emptySkill: SkillForm = { name: "", category: "", level: 3, sortOrder: 0 };
const LEVELS = ["Dasar", "Cukup", "Menengah", "Baik", "Mahir"]; // indeks = level - 1

function SkillsTab() {
  const { items, loading, load } = useList<TechSkill>("/api/skills");
  const [form, setForm] = useState<SkillForm>(emptySkill);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useFlash();

  const categories = Array.from(new Set(items.map((i) => i.category)));

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === "sortOrder" ? Number(value) : value }));
  }

  function startEdit(item: TechSkill) {
    setEditingId(item.id);
    setForm({ name: item.name, category: item.category, level: item.level, sortOrder: item.sortOrder });
    toTop();
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptySkill);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const wasEditing = !!editingId;
    const keepCategory = form.category;
    try {
      if (editingId) await send(`/api/skills/${editingId}`, "PUT", form);
      else await send("/api/skills", "POST", form);
      setFlash({ ok: true, text: wasEditing ? "Perubahan disimpan." : "Skill ditambahkan." });
      cancelEdit();
      // Saat menambah beberapa skill berturut-turut, kategori dipertahankan agar cepat
      if (!wasEditing) setForm({ ...emptySkill, category: keepCategory });
      await load();
    } catch (err) {
      setFlash({ ok: false, text: errText(err) });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await send(`/api/skills/${id}`, "DELETE");
      if (editingId === id) cancelEdit();
      await load();
    } catch (err) {
      setFlash({ ok: false, text: errText(err) });
    }
  }

  if (loading) return <AdminSkeleton />;

  return (
    <AdminSection
      eyebrow="Skill Tree"
      title={editingId ? "Edit Skill" : "Tambah Skill"}
      description="Skill dikelompokkan otomatis berdasarkan kategori. Ketik kategori baru untuk membuat grup baru."
      listTitle="Daftar Skill"
      count={items.length}
      form={
        <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
          <Field label="Nama skill" htmlFor="sk-name">
            <input id="sk-name" name="name" value={form.name} onChange={handleChange} placeholder="mis. Next.js" required maxLength={60} className="input" />
          </Field>
          <Field label="Kategori / grup" htmlFor="sk-cat">
            <input
              id="sk-cat"
              name="category"
              list="skill-categories"
              value={form.category}
              onChange={handleChange}
              placeholder="mis. Frontend"
              required
              maxLength={40}
              className="input"
            />
            <datalist id="skill-categories">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </Field>

          <Field label="Tingkat kemahiran" className="sm:col-span-2">
            <div role="radiogroup" aria-label="Tingkat kemahiran" className="flex gap-2">
              {LEVELS.map((label, idx) => {
                const n = idx + 1;
                const on = form.level === n;
                return (
                  <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setForm((f) => ({ ...f, level: n }))}
                    className={`flex-1 rounded-sm border px-2 py-2.5 text-xs transition-colors ${
                      on ? "border-gold bg-gold/15 text-gold-bright" : "border-void-border text-ink-muted hover:border-gold/60"
                    }`}
                  >
                    <span className="block text-[10px] tracking-widest">{"◆".repeat(n)}</span>
                    {label}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-ink-muted">Pilih sesuai kemampuan yang sebenarnya. Skill yang tertulis biasanya diuji saat wawancara.</p>
          </Field>

          <Field label="Urutan tampil" htmlFor="sk-sort">
            <input id="sk-sort" name="sortOrder" type="number" value={form.sortOrder} onChange={handleChange} className="input" />
          </Field>

          <FormActions editing={!!editingId} addLabel="Tambah Skill" saving={saving} flash={flash} onCancel={cancelEdit} />
        </form>
      }
      list={
        <AdminList empty="Belum ada skill.">
          {items.map((item) => (
            <AdminListItem
              key={item.id}
              thumb={false}
              title={item.name}
              subtitle={`${item.category} · ${LEVELS[item.level - 1] ?? "-"} · ${"◆".repeat(item.level)}${"◇".repeat(5 - item.level)}`}
              onEdit={() => startEdit(item)}
              onDelete={() => handleDelete(item.id)}
            />
          ))}
        </AdminList>
      }
    />
  );
}

/* ===================== PESAN MASUK ===================== */

type MessageItem = {
  id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

function MessagesTab({ onUnread }: { onUnread: (n: number) => void }) {
  const { items, loading, load } = useList<MessageItem>("/api/messages");
  const [flash, setFlash] = useFlash();

  useEffect(() => {
    onUnread(items.filter((m) => !m.isRead).length);
  }, [items, onUnread]);

  async function markRead(id: string, isRead: boolean) {
    try {
      await send(`/api/messages/${id}`, "PATCH", { isRead: !isRead });
      await load();
    } catch (err) {
      setFlash({ ok: false, text: errText(err) });
    }
  }

  async function handleDelete(id: string) {
    try {
      await send(`/api/messages/${id}`, "DELETE");
      await load();
    } catch (err) {
      setFlash({ ok: false, text: errText(err) });
    }
  }

  if (loading) return <AdminSkeleton />;

  const unread = items.filter((m) => !m.isRead).length;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <p className="hsr-eyebrow text-astral">Incoming Transmission</p>
        <h2 className="mt-1 font-display text-2xl text-ink-primary md:text-3xl">Pesan Masuk</h2>
        <p className="mt-1 text-sm text-ink-muted">
          {items.length} pesan{unread > 0 && ` · ${unread} belum dibaca`}
        </p>
        {flash && <p className="mt-2 text-sm text-red-400">⚠ {flash.text}</p>}
      </div>

      <AdminList empty="Belum ada pesan masuk.">
        {items.map((m) => (
          <li key={m.id} className={`hsr-panel p-5 transition-opacity ${m.isRead ? "opacity-60 hover:opacity-100" : ""}`}>
            <div className="flex gap-4">
              <div className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/40 font-display text-gold-bright">
                {m.name.charAt(0).toUpperCase()}
                {!m.isRead && (
                  <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-gold shadow-[0_0_8px_rgba(236,210,154,0.8)]" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <p className="font-display text-ink-primary">{m.name}</p>
                  <time className="font-mono text-xs text-ink-muted">{new Date(m.createdAt).toLocaleString("id-ID")}</time>
                </div>
                <a href={`mailto:${m.email}`} className="break-all font-mono text-xs text-astral transition-colors hover:text-gold-bright">
                  {m.email}
                </a>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink-muted">{m.message}</p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <a
                    href={`mailto:${m.email}?subject=${encodeURIComponent("Re: pesan dari portofolio")}`}
                    className="btn-ghost"
                  >
                    <Reply size={14} /> Balas
                  </a>
                  <button type="button" onClick={() => markRead(m.id, m.isRead)} className="btn-ghost">
                    <MailOpen size={14} /> {m.isRead ? "Tandai belum dibaca" : "Tandai dibaca"}
                  </button>
                  <ConfirmDelete onConfirm={() => handleDelete(m.id)} label={`pesan dari ${m.name}`} />
                </div>
              </div>
            </div>
          </li>
        ))}
      </AdminList>
    </div>
  );
}

/* ===================== INFO PROFIL ===================== */

function SettingsTab() {
  const [form, setForm] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useFlash();

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then((d) => setForm(d.data));
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((f) => (f ? { ...f, [e.target.name]: e.target.value } : f));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await send("/api/settings", "PUT", form);
      setFlash({ ok: true, text: "Tersimpan!" });
    } catch (err) {
      setFlash({ ok: false, text: errText(err) });
    } finally {
      setSaving(false);
    }
  }

  if (!form) return <AdminSkeleton />;

  type EditableField = Exclude<keyof SiteSettings, "id" | symbol>;

  // [nama field, label, lebar penuh?]
  const fields: [EditableField, string, boolean][] = [
    ["name", "Nama", false],
    ["role", "Peran / Jabatan", false],
    ["tagline", "Tagline", true],
    ["about", "Tentang Saya", true],
    ["location", "Lokasi", false],
    ["email", "Email", false],
    ["github", "Link GitHub", false],
    ["linkedin", "Link LinkedIn", false],
    ["instagram", "Link Instagram", true],
  ];

  return (
    <AdminPanel eyebrow="Character Profile" title="Info Profil">
      <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <ImageUploader
            label="Foto Profil"
            round
            aspect="1/1"
            value={form.photoUrl || ""}
            onChange={(url) => setForm((f) => (f ? { ...f, photoUrl: url } : f))}
          />
        </div>

        {fields.map(([name, label, wide]) => (
          <Field key={name} label={label} htmlFor={`s-${name}`} className={wide ? "sm:col-span-2" : ""}>
            {name === "about" ? (
              <textarea id={`s-${name}`} name={name} value={form[name] || ""} onChange={handleChange} rows={5} className="input" />
            ) : (
              <input id={`s-${name}`} name={name} value={form[name] || ""} onChange={handleChange} className="input" />
            )}
          </Field>
        ))}

        <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
          <button type="submit" disabled={saving} className="btn-gold">
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
          <div role="status" aria-live="polite">
            {flash && <p className={`text-sm ${flash.ok ? "text-stardust" : "text-red-400"}`}>{flash.ok ? "✓" : "⚠"} {flash.text}</p>}
          </div>
        </div>
      </form>
    </AdminPanel>
  );
}