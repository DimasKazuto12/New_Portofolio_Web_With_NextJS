"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ZoomOut } from "lucide-react";

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

  function handleClose() {
    setZoom(1);
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative flex max-h-[90vh] max-w-4xl items-center justify-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-[80vh] w-[90vw] max-w-3xl overflow-auto">
              <div
                className="relative mx-auto transition-transform duration-200"
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: "center center",
                  width: "100%",
                  height: "100%",
                }}
              >
                <Image src={src} alt={alt} fill sizes="900px" className="object-contain" />
              </div>
            </div>

            {/* Kontrol zoom & tutup */}
            <div className="absolute top-3 right-3 flex gap-2">
              <button
                onClick={() => setZoom((z) => Math.min(z + 0.5, 3))}
                aria-label="Perbesar"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-void-border bg-void/80 text-ink-primary hover:border-gold hover:text-gold-bright"
              >
                <ZoomIn size={16} />
              </button>
              <button
                onClick={() => setZoom((z) => Math.max(z - 0.5, 1))}
                aria-label="Perkecil"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-void-border bg-void/80 text-ink-primary hover:border-gold hover:text-gold-bright"
              >
                <ZoomOut size={16} />
              </button>
              <button
                onClick={handleClose}
                aria-label="Tutup"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-void-border bg-void/80 text-ink-primary hover:border-gold hover:text-gold-bright"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}