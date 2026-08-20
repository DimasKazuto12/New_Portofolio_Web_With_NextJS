"use client";

import { useEffect, useState } from "react";
import type { CertificateWithSkills, SiteSettings, Project } from "@/types";

type CertForm = {
    title: string;
    issuer: string;
    date: string;
    rarity: number;
    description: string;
    link: string;
    sortOrder: number;
    skills: string;
};

const emptyCert: CertForm = {
    title: "", issuer: "", date: "", rarity: 4, description: "", link: "", sortOrder: 0, skills: "",
};

export default function AdminPage() {
    const [authorized, setAuthorized] = useState<boolean | null>(null);
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const [tab, setTab] = useState<"certificates" | "projects" | "messages" | "settings">("certificates");

    useEffect(() => {
        fetch("/api/admin/check")
            .then((r) => r.json())
            .then((d) => setAuthorized(d.authorized))
            .catch(() => setAuthorized(false));
    }, []);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoginError("");
        const res = await fetch("/api/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password }),
        });
        if (res.ok) setAuthorized(true);
        else {
            const d = await res.json();
            setLoginError(d.error || "Password salah.");
        }
    }

    async function handleLogout() {
        await fetch("/api/admin/logout", { method: "POST" });
        setAuthorized(false);
    }

    if (authorized === null) {
        return <div className="min-h-screen bg-void text-ink-primary flex items-center justify-center">Memuat...</div>;
    }

    if (!authorized) {
        return (
            <div className="min-h-screen bg-void text-ink-primary flex items-center justify-center px-5">
                <form onSubmit={handleLogin} className="hsr-panel w-full max-w-sm px-8 py-8">
                    <p className="hsr-eyebrow mb-2">Admin Access</p>
                    <h1 className="font-display text-2xl mb-6">Masuk ke Admin</h1>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password admin"
                        className="input mb-4"
                    />
                    {loginError && <p className="text-red-400 text-sm mb-4">{loginError}</p>}
                    <button className="w-full rounded-sm bg-gold px-6 py-3 text-sm font-medium text-void hover:bg-gold-bright">
                        Masuk
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-void text-ink-primary px-4 py-8 sm:px-5 md:py-10">
            <div className="mx-auto max-w-4xl">
                <div className="flex items-center justify-between mb-6 md:mb-8">
                    <h1 className="font-display text-xl md:text-2xl">Admin Panel</h1>
                    <button onClick={handleLogout} className="text-sm text-ink-muted hover:text-gold">Keluar</button>
                </div>

                <div className="flex gap-4 mb-6 border-b border-void-border overflow-x-auto md:mb-8">
                    {[
                        { id: "certificates" as const, label: "Sertifikat" },
                        { id: "projects" as const, label: "Proyek" },
                        { id: "messages" as const, label: "Pesan Masuk" },
                        { id: "settings" as const, label: "Info Profil" },
                    ].map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={`whitespace-nowrap pb-3 text-sm ${tab === t.id ? "border-b-2 border-gold text-gold-bright" : "text-ink-muted"}`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {tab === "certificates" && <CertificatesTab />}
                {tab === "projects" && <ProjectsTab />}
                {tab === "messages" && <MessagesTab />}
                {tab === "settings" && <SettingsTab />}
            </div>
        </div>
    );
}

function CertificatesTab() {
    const [items, setItems] = useState<CertificateWithSkills[]>([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState<CertForm>(emptyCert);
    const [editingId, setEditingId] = useState<string | null>(null);

    function load() {
        return fetch("/api/certificates")
            .then((res) => res.json())
            .then((d) => {
                setItems(d.data || []);
                setLoading(false);
            });
    }

    useEffect(() => { load(); }, []);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setForm((f) => ({
            ...f,
            [name]: name === "rarity" || name === "sortOrder" ? Number(value) : value,
        }));
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
            skills: item.skills.map((s) => s.name).join(", "),
        });
    }

    function cancelEdit() {
        setEditingId(null);
        setForm(emptyCert);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const payload = {
            ...form,
            skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
        };
        if (editingId) {
            await fetch(`/api/certificates/${editingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
        } else {
            await fetch("/api/certificates", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
        }
        cancelEdit();
        load();
    }

    async function handleDelete(id: string) {
        if (!confirm("Hapus sertifikat ini?")) return;
        await fetch(`/api/certificates/${id}`, { method: "DELETE" });
        load();
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="hsr-panel px-5 py-5 mb-8 grid gap-4 sm:grid-cols-2 sm:px-6 sm:py-6">
                <input name="title" value={form.title} onChange={handleChange} placeholder="Judul sertifikat" required className="input" />
                <input name="issuer" value={form.issuer} onChange={handleChange} placeholder="Penerbit" required className="input" />
                <input name="date" value={form.date} onChange={handleChange} placeholder="Tahun (mis. 2025)" required className="input" />
                <select name="rarity" value={form.rarity} onChange={handleChange} className="input">
                    {[3, 4, 5].map((r) => <option key={r} value={r}>{r} bintang</option>)}
                </select>
                <input name="link" value={form.link} onChange={handleChange} placeholder="Link (opsional)" className="input" />
                <input name="sortOrder" type="number" value={form.sortOrder} onChange={handleChange} placeholder="Urutan tampil" className="input" />
                <input
                    name="skills"
                    value={form.skills}
                    onChange={handleChange}
                    placeholder="Skill, pisahkan koma (mis. React, Next.js)"
                    className="input sm:col-span-2"
                />
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Deskripsi singkat"
                    rows={2}
                    className="input sm:col-span-2"
                />
                <div className="sm:col-span-2 flex gap-3">
                    <button type="submit" className="rounded-sm bg-gold px-6 py-2 text-sm font-medium text-void hover:bg-gold-bright">
                        {editingId ? "Simpan Perubahan" : "Tambah Sertifikat"}
                    </button>
                    {editingId && (
                        <button type="button" onClick={cancelEdit} className="rounded-sm border border-void-border px-6 py-2 text-sm text-ink-muted hover:text-gold">
                            Batal
                        </button>
                    )}
                </div>
            </form>

            {loading ? (
                <p className="text-ink-muted text-sm">Memuat...</p>
            ) : (
                <div className="space-y-3">
                    {items.map((item) => (
                        <div key={item.id} className="hsr-panel px-5 py-4 flex items-center justify-between gap-4">
                            <div>
                                <p className="font-display">{item.title}</p>
                                <p className="text-xs text-ink-muted">{item.issuer} · {item.date} · {item.rarity}★</p>
                            </div>
                            <div className="flex gap-2 shrink-0">
                                <button onClick={() => startEdit(item)} className="text-xs text-astral hover:text-gold-bright">Edit</button>
                                <button onClick={() => handleDelete(item.id)} className="text-xs text-red-400 hover:text-red-300">Hapus</button>
                            </div>
                        </div>
                    ))}
                    {items.length === 0 && <p className="text-ink-muted text-sm">Belum ada sertifikat.</p>}
                </div>
            )}
        </div>
    );
}

type ProjectForm = {
    code: string;
    title: string;
    description: string;
    stack: string;
    link: string;
    sortOrder: number;
}

const emptyProject: ProjectForm = {
    code: "", title: "", description: "", stack: "", link: "", sortOrder: 0,
}

function ProjectsTab() {
    const [items, setItems] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState<ProjectForm>(emptyProject);
    const [editingId, setEditingId] = useState<string | null>(null);

     function load() {
        return fetch("/api/projects")
            .then((res) => res.json())
            .then((d) => {
                setItems(d.data || []);
                setLoading(false);
            });
    }

    useEffect(() => { load(); }, []);

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
        });
    }

    function cancelEdit() {
        setEditingId(null);
        setForm(emptyProject);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const payload = {
            ...form,
            stack: form.stack.split(",").map((s) => s.trim()).filter(Boolean),
        };
        if (editingId) {
            await fetch(`/api/projects/${editingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
        } else {
            await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
        }
        cancelEdit();
        load();
    }

    async function handleDelete(id: string) {
        if (!confirm("Hapus proyek ini?")) return;
        await fetch(`/api/projects/${id}`, { method: "DELETE" });
        load();
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="hsr-panel px-5 py-5 mb-8 grid gap-4 sm:grid-cols-2 sm:px-6 sm:py-6">
                <input name="code" value={form.code} onChange={handleChange} placeholder="Kode misi (mis. MISSION 01)" required className="input" />
                <input name="title" value={form.title} onChange={handleChange} placeholder="Judul proyek" required className="input" />
                <input name="link" value={form.link} onChange={handleChange} placeholder="Link (opsional)" className="input" />
                <input name="sortOrder" type="number" value={form.sortOrder} onChange={handleChange} placeholder="Urutan tampil" className="input" />
                <input
                    name="stack"
                    value={form.stack}
                    onChange={handleChange}
                    placeholder="Tech stack, pisahkan koma (mis. Next.js, Prisma)"
                    className="input sm:col-span-2"
                />
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Deskripsi proyek"
                    rows={3}
                    required
                    className="input sm:col-span-2"
                />
                <div className="sm:col-span-2 flex gap-3">
                    <button type="submit" className="rounded-sm bg-gold px-6 py-2 text-sm font-medium text-void hover:bg-gold-bright">
                        {editingId ? "Simpan Perubahan" : "Tambah Proyek"}
                    </button>
                    {editingId && (
                        <button type="button" onClick={cancelEdit} className="rounded-sm border border-void-border px-6 py-2 text-sm text-ink-muted hover:text-gold">
                            Batal
                        </button>
                    )}
                </div>
            </form>

            {loading ? (
                <p className="text-ink-muted text-sm">Memuat...</p>
            ) : (
                <div className="space-y-3">
                    {items.map((item) => (
                        <div key={item.id} className="hsr-panel px-5 py-4 flex items-center justify-between gap-4">
                            <div>
                                <p className="font-display">{item.title}</p>
                                <p className="text-xs text-ink-muted">{item.code} · {item.stack.join(", ")}</p>
                            </div>
                            <div className="flex gap-2 shrink-0">
                                <button onClick={() => startEdit(item)} className="text-xs text-astral hover:text-gold-bright">Edit</button>
                                <button onClick={() => handleDelete(item.id)} className="text-xs text-red-400 hover:text-red-300">Hapus</button>
                            </div>
                        </div>
                    ))}
                    {items.length === 0 && <p className="text-ink-muted text-sm">Belum ada proyek.</p>}
                </div>
            )}
        </div>
    );
}

type MessageItem = {
    id: string;
    name: string;
    email: string;
    message: string;
    isRead: boolean;
    createdAt: string;
};

function MessagesTab() {
    const [items, setItems] = useState<MessageItem[]>([]);
    const [loading, setLoading] = useState(true);

    function load() {
        return fetch("/api/messages")
            .then((res) => res.json())
            .then((d) => {
                setItems(d.data || []);
                setLoading(false);
            })
    }

    useEffect(() => { load(); }, []);

    async function markRead(id: string, isRead: boolean) {
        await fetch(`/api/messages/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isRead: !isRead }),
        });
        load();
    }

    async function handleDelete(id: string) {
        if (!confirm("Hapus pesan ini?")) return;
        await fetch(`/api/messages/${id}`, { method: "DELETE" });
        load();
    }

    if (loading) return <p className="text-ink-muted text-sm">Memuat...</p>;

    return (
        <div className="space-y-3">
            {items.map((m) => (
                <div key={m.id} className={`hsr-panel px-5 py-4 ${m.isRead ? "opacity-60" : ""}`}>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <p className="font-display">{m.name} <span className="text-xs text-ink-faint font-mono">&lt;{m.email}&gt;</span></p>
                            <p className="mt-2 text-sm text-ink-muted whitespace-pre-wrap">{m.message}</p>
                            <p className="mt-2 text-xs text-ink-faint">{new Date(m.createdAt).toLocaleString("id-ID")}</p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                            <button onClick={() => markRead(m.id, m.isRead)} className="text-xs text-astral hover:text-gold-bright">
                                {m.isRead ? "Tandai belum dibaca" : "Tandai dibaca"}
                            </button>
                            <button onClick={() => handleDelete(m.id)} className="text-xs text-red-400 hover:text-red-300">Hapus</button>
                        </div>
                    </div>
                </div>
            ))}
            {items.length === 0 && <p className="text-ink-muted text-sm">Belum ada pesan masuk.</p>}
        </div>
    );
}

function SettingsTab() {
    const [form, setForm] = useState<SiteSettings | null>(null);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        fetch("/api/settings").then((r) => r.json()).then((d) => setForm(d.data));
    }, []);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setForm((f) => (f ? { ...f, [e.target.name]: e.target.value } : f));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        await fetch("/api/settings", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    }

    if (!form) return <p className="text-ink-muted text-sm">Memuat...</p>;

    const fields: [keyof SiteSettings, string][] = [
        ["name", "Nama"], ["role", "Peran / Jabatan"], ["tagline", "Tagline"],
        ["about", "Tentang Saya"], ["location", "Lokasi"], ["email", "Email"],
        ["github", "Link GitHub"], ["linkedin", "Link LinkedIn"], ["instagram", "Link Instagram"],
    ];

    return (
        <form onSubmit={handleSubmit} className="hsr-panel px-5 py-5 grid gap-4 sm:px-6 sm:py-6">
            {fields.map(([name, label]) =>
                name === "about" ? (
                    <div key={name}>
                        <label className="hsr-eyebrow mb-2 block">{label}</label>
                        <textarea name={name} value={form[name] || ""} onChange={handleChange} rows={4} className="input" />
                    </div>
                ) : (
                    <div key={name}>
                        <label className="hsr-eyebrow mb-2 block">{label}</label>
                        <input name={name} value={form[name] || ""} onChange={handleChange} className="input" />
                    </div>
                )
            )}
            <button className="rounded-sm bg-gold px-6 py-2 text-sm font-medium text-void hover:bg-gold-bright w-fit">
                Simpan
            </button>
            {saved && <p className="text-stardust text-sm">Tersimpan!</p>}
        </form>
    );
}