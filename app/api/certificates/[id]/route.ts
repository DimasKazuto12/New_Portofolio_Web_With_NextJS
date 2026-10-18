import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { isAuthorized } from '@/lib/auth';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session")?.value;
    if (!isAuthorized(session)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { skills, ...rest } = body;
    const skillArray: string[] = Array.isArray(skills) ? skills : [];

    const current = await prisma.certificate.findUnique({
        where: { id },
        include: { skills: true },
    });

    const currentNames = current?.skills.map((s) => s.name) ?? [];
    const toDisconnect = currentNames.filter((n) => !skillArray.includes(n));
    const data = await prisma.certificate.update({
        where: { id },
        data: {
            ...rest,
            skills: skills
                ? {
                    disconnect: toDisconnect.map((name) => ({ name })),
                    connectOrCreate: skills.map((name: string) => ({
                        where: { name },
                        create: { name },
                    })),
                }
                : undefined,
        },
        include: { skills: true }
    });
    return NextResponse.json({ data });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session")?.value;
    if (!isAuthorized(session)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await prisma.certificate.delete({ where: { id } });
    return NextResponse.json({ ok: true });
}