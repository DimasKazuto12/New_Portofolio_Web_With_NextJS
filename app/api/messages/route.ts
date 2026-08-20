import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { isAuthorized } from '@/lib/auth';

export async function GET() {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session")?.value;
    if (!isAuthorized(session)) {
        return NextResponse.json({ error: "Unathorized" }, { status: 401 });
    }
    const data = await prisma.message.findMany({ orderBy: {createdAt: "desc"}});
    return NextResponse.json({ data });
}