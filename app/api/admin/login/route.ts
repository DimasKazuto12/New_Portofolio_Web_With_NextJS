import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { hashPassword } from '@/lib/auth';
import { error } from 'console';

export async function POST(req: Request) {
    const { password } = await req.json();
    if (!password || password !== process.env.ADMIN_PASSWORD) {
        return NextResponse.json({ error: "Password salah" }, { status: 401 });
    }
    const token = hashPassword(password);
    const cookieStore = await cookies();
    cookieStore.set("admin_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
    });
    return NextResponse.json({ ok: true });
}