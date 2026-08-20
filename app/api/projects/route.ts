import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { isAuthorized } from '@/lib/auth';

export async function GET() {
    const data = await prisma.project.findMany({
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({ data });
}

export async function POST(req: Request) {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session")?.value;
    if (!isAuthorized(session)) {
        return NextResponse.json({ error: "Unathorized" }, { status: 401 });
    }
    const body = await req.json();
    const data = await prisma.project.create({ data: body });
    return NextResponse.json({ data });
}