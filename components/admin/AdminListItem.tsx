"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion } from "framer-motion";
import { Check, Pencil, Trash2 } from "lucide-react";
import ImageLightbox from "@/components/ImageLightbox";

/** Tombol hapus dua langkah: klik pertama meminta konfirmasi, batal otomatis setelah 4 detik */
export function ConfirmDelete({ onConfirm, label }: { onConfirm: () => void | Promise<void>; label: string }) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!confirming) return;
    const t = setTimeout(() => setConfirming(false), 4000);
    return () => clearTimeout(t);
  }, [confirming]);

  async function run() {
    setBusy(true);
    try {
      await onConfirm();
    } finally {
      setBusy(false);
      setConfirming(false);
    }
  }

  return confirming ? (
    <button type="button" onClick={run} disabled={busy} className="btn-danger">
      <Check size={14} /> {busy ? "Menghapus..." : "Yakin?"}
    </button>
  ) : (
    <button type="button" onClick={() => setConfirming(true)} aria-label={`Hapus ${label}`} className="btn-danger">
      <Trash2 size={14} />
      <span className="hidden sm:inline">Hapus</span>
    </button>
  );
}

export default function AdminListItem({
  title,
  subtitle,
  imageUrl,
  thumb = true,
  onEdit,
  onDelete,
}: {
  title: string;
  subtitle?: string;
  imageUrl?: string | null;
  thumb?: boolean;
  onEdit: () => void;
  onDelete: () => void | Promise<void>;
}) {
  const [zoom, setZoom] = useState(false);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="hsr-panel flex items-center gap-4 p-3 pr-4"
    >
      {imageUrl ? (
        <button
          type="button"
          onClick={() => setZoom(true)}
          aria-label={`Perbesar foto ${title}`}
          className="group relative h-14 w-20 shrink-0 cursor-zoom-in overflow-hidden rounded-sm border border-void-border"
        >
          <Image src={imageUrl} alt={title} fill sizes="80px" className="object-cover transition-transform duration-300 group-hover:scale-110" />
        </button>
      ) : thumb ? (
        <div className="grid h-14 w-20 shrink-0 place-items-center rounded-sm border border-dashed border-void-border text-gold/30">✦</div>
      ) : null}

      <div className="min-w-0 flex-1 px-1">
        <p className="truncate font-display text-base text-ink-primary">{title}</p>
        {subtitle && <p className="truncate text-xs text-ink-muted">{subtitle}</p>}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button type="button" onClick={onEdit} aria-label={`Edit ${title}`} className="btn-ghost">
          <Pencil size={14} />
          <span className="hidden sm:inline">Edit</span>
        </button>
        <ConfirmDelete onConfirm={onDelete} label={title} />
      </div>

      {imageUrl && typeof document !== "undefined" &&
        createPortal(<ImageLightbox src={imageUrl} alt={title} open={zoom} onClose={() => setZoom(false)} />, document.body)}
    </motion.li>
  );
}