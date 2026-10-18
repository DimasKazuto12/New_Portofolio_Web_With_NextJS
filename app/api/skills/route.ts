import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma"; // SESUAIKAN: path client Prisma-mu
import { parseSkillInput } from "@/lib/skills";

export async function GET() {
  const data = await prisma.techSkill.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  // SESUAIKAN (WAJIB): salin pengecekan admin dari app/api/paths/route.ts di sini.
  // Tanpa ini, siapa pun bisa menambah skill lewat API.

  const input = parseSkillInput(await req.json().catch(() => null));
  if (!input) return NextResponse.json({ error: "Data skill tidak valid." }, { status: 400 });

  const data = await prisma.techSkill.create({ data: input });
  revalidatePath("/");
  return NextResponse.json({ data }, { status: 201 });
}