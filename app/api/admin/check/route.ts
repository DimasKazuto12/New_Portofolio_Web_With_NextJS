import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isAuthorized } from '@/lib/auth';

export async function GET() {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session")?.value;
    return NextResponse.json({ authorized: isAuthorized(session) });
}