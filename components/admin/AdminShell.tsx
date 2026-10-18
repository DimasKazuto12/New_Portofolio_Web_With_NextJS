"use client";

import { Children, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, LogOut } from "lucide-react";
import Starfield from "@/components/Starfield"; // hapus kalau Starfield sudah dipasang di layout

export type AdminTab = { id: string; label: string; icon: LucideIcon; badge?: number };

export default function AdminShell({
  tabs,
  active,
  onChange,
  onLogout,
  children,
}: {
  tabs: AdminTab[];
  active: string;
  onChange: (id: string) => void;
  onLogout: () => void;
  children: ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      <Starfield />

      <header className="sticky top-0 z-30 border-b border-void-border bg-void/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-6 py-4 sm:px-10 lg:px-16">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full border border-gold/40 text-gold-bright shadow-[0_0_20px_rgba(236,210,154,0.15)]">
              ✦
            </span>
            <div>
              <p className="hsr-eyebrow leading-none">Control Room</p>
              <h1 className="mt-1 font-display text-lg tracking-[0.2em] text-gold-bright">ADMIN PANEL</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a href="/" target="_blank" rel="noreferrer" className="btn-ghost">
              <ExternalLink size={14} /> <span className="hidden sm:inline">Lihat situs</span>
            </a>
            <button type="button" onClick={onLogout} className="btn-ghost">
              <LogOut size={14} /> Keluar
            </button>
          </div>
        </div>

        <nav aria-label="Menu admin" className="mx-auto max-w-[1440px] overflow-x-auto px-3 sm:px-8 lg:px-14">
          <ul className="flex min-w-max gap-1">
            {tabs.map((t) => {
              const on = t.id === active;
              const Icon = t.icon;
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => onChange(t.id)}
                    aria-current={on ? "page" : undefined}
                    className={`relative flex items-center gap-2 px-4 py-3 text-sm transition-colors ${
                      on ? "text-gold-bright" : "text-ink-muted hover:text-gold"
                    }`}
                  >
                    <Icon size={16} />
                    {t.label}
                    {!!t.badge && (
                      <span className="rounded-full bg-gold px-1.5 text-[10px] font-semibold text-void">{t.badge}</span>
                    )}
                    {on && (
                      <motion.span
                        layoutId="admin-tab"
                        transition={{ type: "spring", stiffness: 380, damping: 34 }}
                        className="absolute inset-x-2 -bottom-px h-0.5 bg-gradient-to-r from-gold-dim via-gold to-astral"
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>

      <main className="relative mx-auto max-w-[1440px] px-6 py-10 sm:px-10 md:py-12 lg:px-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

/** Dua kolom di desktop: form di kiri, daftar data di kanan. Di HP ditumpuk. */
export function AdminSection({
  eyebrow,
  title,
  description,
  form,
  listTitle,
  count,
  list,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  form: ReactNode;
  listTitle: string;
  count: number;
  list: ReactNode;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-8">
      <section className="hsr-panel p-6 md:p-8">
        <p className="hsr-eyebrow text-astral">{eyebrow}</p>
        <h2 className="mt-1 font-display text-2xl text-ink-primary md:text-3xl">{title}</h2>
        {description && <p className="mt-2 text-sm text-ink-muted">{description}</p>}
        <div className="mt-6">{form}</div>
      </section>

      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h3 className="font-display text-xl text-ink-primary">{listTitle}</h3>
          <span className="font-mono text-xs text-ink-muted">{count} item</span>
        </div>
        {list}
      </section>
    </div>
  );
}

/** Panel lebar tunggal, untuk tab seperti Info Profil */
export function AdminPanel({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return (
    <section className="hsr-panel mx-auto max-w-4xl p-6 md:p-10">
      <p className="hsr-eyebrow text-astral">{eyebrow}</p>
      <h2 className="mt-1 font-display text-2xl text-ink-primary md:text-3xl">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

/** Label di atas input, supaya tetap terbaca setelah kolom terisi */
export function Field({
  label,
  htmlFor,
  className = "",
  children,
}: {
  label: string;
  htmlFor?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="hsr-eyebrow mb-2 block">
        {label}
      </label>
      {children}
    </div>
  );
}

export function AdminList({ children, empty }: { children: ReactNode; empty: string }) {
  if (Children.count(children) === 0) {
    return (
      <div className="rounded-sm border border-dashed border-void-border px-6 py-12 text-center text-sm text-ink-muted">
        ✦ {empty}
      </div>
    );
  }
  return (
    <ul className="space-y-3">
      <AnimatePresence initial={false}>{children}</AnimatePresence>
    </ul>
  );
}

/** Pengganti tulisan "Memuat..." */
export function AdminSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8" aria-busy="true">
      <div className="hsr-panel h-96 animate-pulse" />
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="hsr-panel h-20 animate-pulse" />
        ))}
      </div>
    </div>
  );
}