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

    const { skills, ...rest } = await req.json();
    const data = await prisma.certificate.update({
        where: { id },
        data: {
            ...rest,
            skills: skills
                ? {
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