"use client";

const links = [
    { href: "#beranda", label: "Beranda", icon: "◆" },
    { href: "#tentang", label: "Tentang", icon: "✦" },
    { href: "#beranda", label: "Beranda", icon: "★" },
    { href: "#beranda", label: "Beranda", icon: "▲" },
    { href: "#beranda", label: "Beranda", icon: "✉" },
];

export default function Navbar({ onOpenGame }: { onOpenGame: () => void }) {
    return (
        <>
            <header className="fixed top-0 inset-x-0 z-40 hidden border-b border-void-border/60 bg-void/70 backdrop-blur-md md:block">
                <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
                    <a href="#beranda" className="font-display text-sm tracking-[0.2em] text-gold-bright">TRAILBLAZE LOG</a>
                    <ul className="flex gap-8">
                        {links.map((l) => (

                            <li key={l.href}>
                                <a href={l.href} className="hsr-eyebrow text-ink-muted transition-colors hover:text-gold">{l.label}</a>
                            </li>
                        ))}
                    </ul>
                    <button onClick={onOpenGame} aria-label="Buka mini game rahasia" className="text-lg text-gold/70 transition-transform hover:scale-125 hover:text-gold-bright">✦</button>
                </nav>
            </header>

            <header className="fixed top-0 inset-x-0 z-40 flex items-center justify-between border-b border-void-border/60 bg-void/80 backdrop-blur-md px-4 py-3 md:hidden">
                <span className="font-display text-xs tracking-[0.2em] text-gold-bright">TRAILBLAZE LOG</span>
                <button onClick={onOpenGame} aria-label="Buka mini game rahasia" className="text-lg text-gold/70">✦</button>
            </header>

            <nav className="fixed bottom-0 inset-x-0 z-40 flex justify-around border-t border-void-border/60 bg-void/90 backdrop-blur-md pb-safe pt-2 md:hidden">

                {links.map((l) => (
                    <a key={l.href} href={l.href} className="flex flex-col items-center gap-0.5 px-2 pb-2 text-ink-muted transition-colors active:text-gold-bright">
                        <span className="text-base">{l.icon}</span>
                        <span className="text-[10px]">{l.label}</span>
                    </a>
                ))}
            </nav>
        </>
    )
}