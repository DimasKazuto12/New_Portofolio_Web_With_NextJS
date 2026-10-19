"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

const GLOW = {
  astral: "bg-[radial-gradient(ellipse_55%_100%_at_50%_0%,rgba(179,168,255,0.10),transparent)]",
  gold: "bg-[radial-gradient(ellipse_55%_100%_at_50%_0%,rgba(236,210,154,0.08),transparent)]",
};

export default function Band({ tone = "astral", children }: { tone?: "astral" | "gold"; children: ReactNode }) {
  return (
    <div className="relative">
      {/* Cahaya lembut di tepi atas section, bergantian ungu dan emas */}
      <div aria-hidden className={`pointer-events-none absolute inset-x-0 top-0 h-[460px] ${GLOW[tone]}`} />

      {/* Pemisah ornamen tepat di batas antar section */}
      <div aria-hidden className="absolute inset-x-0 top-0 z-10 -translate-y-1/2 px-6 sm:px-10 lg:px-16 xl:px-20">
        <motion.div
          initial={{ opacity: 0, scaleX: 0.6 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mx-auto flex max-w-[1440px] items-center gap-4"
        >
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/25 to-gold/40" />
          <span className="flex items-center gap-2 text-[10px] text-gold/70">
            <span>◆</span>
            <span className="text-sm text-gold-bright">✦</span>
            <span>◆</span>
          </span>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent via-gold/25 to-gold/40" />
        </motion.div>
      </div>

      {children}
    </div>
  );
}