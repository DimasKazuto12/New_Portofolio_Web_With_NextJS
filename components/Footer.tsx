import type { SiteSettings } from '@/types';

export default function Footer({ settings }: { settings: SiteSettings | null}) {
    return (
        <footer className="border-t border-void-border/60 px-4 py-8 text-center pb-24 md:pb-8">
            <p className="font-mono text-xs text-ink-faint">
                © {new Date().getFullYear()} {settings?.name} · This my lead us Starward
            </p>
        </footer>
    )
}