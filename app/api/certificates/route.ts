import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { isAuthorized } from '@/lib/auth';

export async function GET() {
    const data = await prisma.certificate.findMany({
        orderBy: [{sortOrder: "asc"}, {createdAt: "desc"}],
        include: {skills: true}
    });
    return NextResponse.json({data});
}

export async function POST(req: Request) {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session")?.value;
    if (!isAuthorized(session)) {
        return NextResponse.json({ error: "Unathorized" }, { status: 401 });
    }
    const { skills, ...rest } = await req.json();
    const data = await prisma.certificate.create({
        data: {
            ...rest,
            skills: skills?.length
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