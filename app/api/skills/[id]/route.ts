import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma"; // SESUAIKAN
import { parseSkillInput } from "@/lib/skills";

type Ctx = { params: Promise<{ id: string }> }; // Next 14: ganti jadi { params: { id: string } }

export async function PUT(req: Request, ctx: Ctx) {
  // SESUAIKAN (WAJIB): cek admin, sama seperti di route paths/[id]

  const { id } = await ctx.params;
  const input = parseSkillInput(await req.json().catch(() => null));
  if (!input) return NextResponse.json({ error: "Data skill tidak valid." }, { status: 400 });

  try {
    const data = await prisma.techSkill.update({ where: { id }, data: input });
    revalidatePath("/");
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Skill tidak ditemukan." }, { status: 404 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  // SESUAIKAN (WAJIB): cek admin

  const { id } = await ctx.params;
  try {
    await prisma.techSkill.delete({ where: { id } });
    revalidatePath("/");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Skill tidak ditemukan." }, { status: 404 });
  }
}