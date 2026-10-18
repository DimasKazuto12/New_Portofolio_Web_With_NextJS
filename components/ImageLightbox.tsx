"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ZoomOut } from "lucide-react";

const MIN = 1;
const MAX = 3;
const STEP = 0.5;

export default function ImageLightbox({
  src,
  alt,
  open,
  onClose,
}: {
  src: string;
  alt: string;
  open: boolean;
  onClose: () => void;
}) {
  const [zoom, setZoom] = useState(1);

  const close = useCallback(() => {
    setZoom(1);
    onClose();
  }, [onClose]);

  const zoomIn = () => setZoom((z) => Math.min(z + STEP, MAX));
  const zoomOut = () => setZoom((z) => Math.max(z - STEP, MIN));

  // Esc menutup, +/- memperbesar/memperkecil, dan halaman di belakang tidak ikut bergulir
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(z + STEP, MAX));
      if (e.key === "-") setZoom((z) => Math.max(z - STEP, MIN));
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const btn =
    "flex h-9 w-9 items-center justify-center rounded-full border border-void-border bg-void/80 text-ink-primary transition-colors hover:border-gold hover:text-gold-bright disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex w-full max-w-5xl flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full">
              {/* Area gulir. Zoom mengubah ukuran gambar (bukan transform), jadi semua sisi bisa digulir */}
              <div className="h-[78vh] w-full overflow-auto rounded-sm border border-void-border bg-void/60">
                <div
                  className="relative transition-[width,height] duration-200"
                  style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%` }}
                  onDoubleClick={() => setZoom((z) => (z > 1 ? 1 : 2))}
                >
                  <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes={`(min-width: 1024px) ${Math.round(1024 * zoom)}px, ${Math.round(92 * zoom)}vw`}
                    className="select-none object-contain"
                    draggable={false}
                  />
                </div>
              </div>

              {/* Kontrol di luar area gulir, jadi tetap di pojok saat gambar digeser */}
              <div className="absolute right-3 top-3 flex items-center gap-2">
                <span className="mr-1 font-mono text-xs text-ink-muted">{Math.round(zoom * 100)}%</span>
                <button onClick={zoomIn} disabled={zoom >= MAX} aria-label="Perbesar" className={btn}>
                  <ZoomIn size={16} />
                </button>
                <button onClick={zoomOut} disabled={zoom <= MIN} aria-label="Perkecil" className={btn}>
                  <ZoomOut size={16} />
                </button>
                <button onClick={close} autoFocus aria-label="Tutup" className={btn}>
                  <X size={16} />
                </button>
              </div>
            </div>

            <p className="font-display text-sm text-gold-bright md:text-base">{alt}</p>
            <p className="hidden text-xs text-ink-muted md:block">Klik dua kali untuk memperbesar · Esc untuk menutup</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}