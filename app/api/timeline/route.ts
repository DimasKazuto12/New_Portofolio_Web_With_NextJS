import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma"; // SESUAIKAN: path client Prisma-mu
import { parseTimelineInput } from "@/lib/timeline";

export async function GET() {
  const data = await prisma.timelineEntry.findMany({
    orderBy: [{ startYear: "desc" }, { createdAt: "desc" }],
  });
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  // SESUAIKAN (WAJIB): salin pengecekan admin dari app/api/paths/route.ts di sini.
  // Tanpa ini, siapa pun bisa menambah data lewat API.

  const input = parseTimelineInput(await req.json().catch(() => null));
  if (!input) return NextResponse.json({ error: "Data riwayat tidak valid. Periksa tahun dan kolom wajib." }, { status: 400 });

  const data = await prisma.timelineEntry.create({ data: input });
  revalidatePath("/");
  return NextResponse.json({ data }, { status: 201 });
}