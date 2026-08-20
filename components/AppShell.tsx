"use client";

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import EasterEggGame from '@/components/EasterEggGame';

export default function AppShell({ children }: { children: React.ReactNode }) {
    const [gameOpen, setGameOpen] = useState(false);

    return (
        <>
            <Navbar onOpenGame={() => setGameOpen(true)} />
            <main className='pb-20 md:pb-0'>{children}</main>
            <EasterEggGame open={gameOpen} onClose={() => setGameOpen(false)} />
        </>
    );
}