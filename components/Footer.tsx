import type { SiteSettings } from "@/types";

export default function Footer({ settings }: { settings: SiteSettings | null }) {
    return (
        <footer className="relative border-t border-void-border/60 pb-20 md:pb-0">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

            <div className="mx-auto grid max-w-[1440px] items-center gap-3 px-6 py-8 text-center sm:px-10 md:grid-cols-[1fr_auto_1fr] lg:px-16 xl:px-20">
                <p className="font-mono text-xs text-ink-muted md:text-left">
                    © {new Date().getFullYear()} {settings?.name}
                </p>
                <p className="font-display text-sm text-gold/80">This journey leads us starward.</p>
                <a href="#beranda" className="text-xs text-ink-muted transition-colors hover:text-gold-bright md:justify-self-end">
                    Kembali ke atas ↑
                </a>
            </div>
        </footer>
    );
}