"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AlertCircle, ImagePlus, Loader2, Maximize2, RefreshCw, Trash2 } from "lucide-react";
import ImageLightbox from "@/components/ImageLightbox";

type Props = {
  label: string;
  value: string; // URL foto yang tersimpan
  onChange: (url: string) => void;
  aspect?: string; // rasio tampilan di situs, mis. "16/10"
  round?: boolean; // pratinjau lingkaran untuk foto profil
  maxMB?: number;
};

// === SESUAIKAN: logika upload. Kalau endpoint atau bentuk responsmu berbeda,
//     salin fetch dari ImageUploader lama ke sini. Fungsi ini harus mengembalikan URL foto. ===
async function uploadFile(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.url) throw new Error(data.error || "Upload gagal.");
  return data.url as string;
}

const fmtSize = (b: number) => (b >= 1048576 ? (b / 1048576).toFixed(2) + " MB" : Math.round(b / 1024) + " KB");
const ratioOf = (a: string) => {
  const [w, h] = a.split("/").map(Number);
  return w / h;
};

export default function ImageUploader({ label, value, onChange, aspect = "16/10", round = false, maxMB = 5 }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [local, setLocal] = useState<{ url: string; name: string; size: number } | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dims, setDims] = useState<{ src: string; w: number; h: number } | null>(null);
  const [fit, setFit] = useState<"cover" | "contain">("cover");
  const [drag, setDrag] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [prevValue, setPrevValue] = useState(value);

  // Bersihkan URL sementara
  useEffect(() => () => { if (local) URL.revokeObjectURL(local.url); }, [local]);

  // Form di-reset (value kosong) -> buang pratinjau lokal

  if (value !== prevValue) {
    setPrevValue(value);
    if (!value && !uploading) {
      setLocal(null);
    }
  }

  const src = (uploading && local?.url) || value || local?.url || "";
  const justUploaded = !!local && !!value && value === uploadedUrl;
  const d = dims && dims.src === src ? dims : null;
  const offRatio = !round && d && Math.abs(d.w / d.h / ratioOf(aspect) - 1) > 0.2;

  async function pick(list: FileList | null) {
    const f = list?.[0];
    if (!f || uploading) return;
    if (!f.type.startsWith("image/")) return setError("File harus berupa gambar (JPG, PNG, atau WebP).");
    if (f.size > maxMB * 1048576) return setError(`Ukuran file ${fmtSize(f.size)} melebihi batas ${maxMB} MB.`);

    setError("");
    setFit("cover");
    setLocal({ url: URL.createObjectURL(f), name: f.name, size: f.size });
    setUploading(true);
    try {
      const url = await uploadFile(f);
      setUploadedUrl(url);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload gagal.");
      setLocal(null);
    } finally {
      setUploading(false);
    }
  }

  function remove() {
    setLocal(null);
    setUploadedUrl("");
    setError("");
    onChange("");
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files); }}
    >
      <p className="hsr-eyebrow mb-2">{label}</p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => { pick(e.target.files); e.target.value = ""; }}
      />

      {!src ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`flex w-full flex-col items-center justify-center gap-2 rounded-sm border border-dashed px-4 py-10 text-center transition-colors ${drag ? "border-gold bg-gold/10" : "border-void-border hover:border-gold/60 hover:bg-gold/5"
            }`}
        >
          <ImagePlus size={28} className="text-gold" />
          <span className="text-sm text-ink-primary">Klik atau seret foto ke sini</span>
          <span className="text-xs text-ink-muted">JPG, PNG, atau WebP · maks {maxMB} MB</span>
        </button>
      ) : (
        <div className={`space-y-3 rounded-sm ${drag ? "ring-1 ring-gold" : ""}`}>
          <div className={round ? "mx-auto w-48" : ""}>
            <button
              type="button"
              onClick={() => setZoom(true)}
              aria-label="Perbesar foto untuk memeriksa"
              className={`group relative block w-full cursor-zoom-in overflow-hidden border border-void-border bg-void ${round ? "rounded-full" : "rounded-sm"}`}
              style={{ aspectRatio: round ? "1 / 1" : aspect }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={label}
                onLoad={(e) => setDims({ src, w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })}
                className={`absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-105 ${fit === "cover" || round ? "object-cover" : "object-contain"
                  }`}
              />
              {uploading ? (
                <span className="absolute inset-0 grid place-items-center bg-void/70">
                  <Loader2 className="animate-spin text-gold" />
                </span>
              ) : (
                <span className="absolute inset-0 flex items-end justify-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-2.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="text-[11px] font-semibold tracking-widest text-gold-bright">PERBESAR ⤢</span>
                </span>
              )}
            </button>
          </div>

          {/* Info file: untuk memastikan yang diunggah benar */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-ink-muted">
            {uploading ? (
              <span className="text-gold-bright">Mengunggah...</span>
            ) : justUploaded ? (
              <span className="text-stardust">✓ Terunggah</span>
            ) : (
              <span>Foto tersimpan</span>
            )}
            {local && justUploaded && <span className="max-w-[16rem] truncate">{local.name}</span>}
            {local && justUploaded && <span>{fmtSize(local.size)}</span>}
            {d && <span>{d.w}×{d.h} px</span>}
          </div>

          {offRatio && fit === "cover" && d && (
            <p className="flex items-start gap-2 text-xs text-amber-300">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              Rasio foto ({(d.w / d.h).toFixed(2)}) berbeda dari tampilan kartu ({aspect.replace("/", ":")}), jadi sisinya akan terpotong. Pilih
              “Gambar utuh” untuk melihat seluruhnya.
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => setZoom(true)} className="btn-ghost">
              <Maximize2 size={14} /> Perbesar
            </button>
            <button type="button" disabled={uploading} onClick={() => inputRef.current?.click()} className="btn-ghost">
              <RefreshCw size={14} /> Ganti
            </button>
            <button type="button" disabled={uploading} onClick={remove} className="btn-danger">
              <Trash2 size={14} /> Hapus
            </button>

            {!round && (
              <div role="group" aria-label="Mode pratinjau" className="ml-auto inline-flex overflow-hidden rounded-sm border border-void-border text-xs">
                {(["cover", "contain"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    aria-pressed={fit === m}
                    onClick={() => setFit(m)}
                    className={`px-3 py-1.5 transition-colors ${fit === m ? "bg-gold/15 text-gold-bright" : "text-ink-muted hover:text-gold"}`}
                  >
                    {m === "cover" ? "Tampilan kartu" : "Gambar utuh"}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-2 flex items-center gap-1.5 text-sm text-red-400">
          <AlertCircle size={14} /> {error}
        </p>
      )}

      {src && typeof document !== "undefined" &&
        createPortal(<ImageLightbox src={src} alt={label} open={zoom} onClose={() => setZoom(false)} />, document.body)}
    </div>
  );
}