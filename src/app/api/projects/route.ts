import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  try {
    const { userId } = getAuthUser();

    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(projects);
  } catch {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = getAuthUser();
    const { title, service, status } = await req.json();

    if (!title || !service || !status) {
      return NextResponse.json({ error: "Preencha tudo" }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: { title, service, status, userId },
    });

    return NextResponse.json(project, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
}
