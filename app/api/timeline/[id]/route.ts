import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma"; // SESUAIKAN
import { parseTimelineInput } from "@/lib/timeline";

type Ctx = { params: Promise<{ id: string }> }; // Next 14: ganti jadi { params: { id: string } }

export async function PUT(req: Request, ctx: Ctx) {
  // SESUAIKAN (WAJIB): cek admin, sama seperti di route paths/[id]

  const { id } = await ctx.params;
  const input = parseTimelineInput(await req.json().catch(() => null));
  if (!input) return NextResponse.json({ error: "Data riwayat tidak valid. Periksa tahun dan kolom wajib." }, { status: 400 });

  try {
    const data = await prisma.timelineEntry.update({ where: { id }, data: input });
    revalidatePath("/");
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Data tidak ditemukan." }, { status: 404 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  // SESUAIKAN (WAJIB): cek admin

  const { id } = await ctx.params;
  try {
    await prisma.timelineEntry.delete({ where: { id } });
    revalidatePath("/");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Data tidak ditemukan." }, { status: 404 });
  }
}