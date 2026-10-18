"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { AlertCircle, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import Starfield from "@/components/Starfield"; // hapus kalau Starfield sudah dipasang di layout
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
  /** Kembalikan false kalau password salah, supaya kartu bergetar */
  onSubmit: (password: string) => Promise<boolean | void> | boolean | void;
  error?: string;
};

export default function AdminLogin({ onSubmit, error = "" }: Props) {
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [caps, setCaps] = useState(false);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const shake = useAnimationControls();
  const router = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!pw || busy) return;
    setBusy(true);
    try {
      const ok = await onSubmit(pw);
      if (ok === false) {
        shake.start({ x: [0, -10, 10, -8, 8, -4, 4, 0], transition: { duration: 0.5 } });
        inputRef.current?.select();
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative grid min-h-screen place-items-center px-4 py-12">
      <Starfield />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_420px_at_50%_35%,rgba(179,168,255,0.14),transparent_70%)]"
      />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        <motion.div animate={shake}>
          <form onSubmit={submit} className="hsr-panel px-6 py-9 sm:px-10 sm:py-11">
            {/* Lambang: bintang dengan cincin orbit berputar pelan */}
            <div className="relative mx-auto mb-6 grid h-24 w-24 place-items-center">
              <motion.span
                aria-hidden
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-dashed border-gold/40"
              />
              <span className="grid h-14 w-14 place-items-center rounded-full border border-gold-dim bg-void-panel text-2xl text-gold-bright shadow-[0_0_30px_rgba(236,210,154,0.25)]">
                ✦
              </span>
            </div>

            <div className="text-center">
              <p className="hsr-eyebrow">Admin Access</p>
              <h1 className="mt-2 font-display text-3xl text-glow">Masuk ke Admin</h1>
              <p className="mx-auto mt-3 max-w-xs text-sm text-ink-muted">
                Area khusus Trailblazer. Masukkan password untuk melanjutkan.
              </p>
            </div>

            <div className="mt-8">
              <label htmlFor="admin-password" className="hsr-eyebrow mb-2 block">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gold-dim" />
                <input
                  id="admin-password"
                  ref={inputRef}
                  type={show ? "text" : "password"}
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  onKeyUp={(e) => setCaps(e.getModifierState("CapsLock"))}
                  autoComplete="current-password"
                  placeholder="Password admin"
                  className="input pl-10 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  aria-label={show ? "Sembunyikan password" : "Tampilkan password"}
                  className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-sm text-ink-muted transition-colors hover:text-gold-bright"
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {caps && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-gold-bright">
                  <AlertCircle size={13} /> Caps Lock sedang aktif
                </p>
              )}

              <AnimatePresence>
                {error && (
                  <motion.p
                    role="alert"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-3 flex items-center gap-1.5 text-sm text-red-400"
                  >
                    <AlertCircle size={14} /> {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <button type="submit" disabled={!pw || busy} className="btn-gold mt-7 w-full py-3">
              {busy ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Memeriksa...
                </>
              ) : (
                "Masuk"
              )}
            </button>

            <Link href="/" onClick={() => router.refresh()} className="mt-6 block text-center text-xs text-ink-muted transition-colors hover:text-gold-bright">
              ← Kembali ke beranda
            </Link>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}