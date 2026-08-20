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
    const data = await prisma.project.update({ where: { id }, data: body });
    return NextResponse.json({ data });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session")?.value;
    if (!isAuthorized(session)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ ok: true });
}