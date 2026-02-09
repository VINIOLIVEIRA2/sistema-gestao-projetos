import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await getAuthUser();
    const { id: projectId } = await params;

    const tasks = await prisma.task.findMany({
      where: { projectId, userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tasks);
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await getAuthUser();
    const { id: projectId } = await params;

    const body = await req.json();
    const { title, dueDate, startDate } = body;

    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "Título é obrigatório" }, { status: 400 });
    }

    const ownsProject = await prisma.project.findFirst({
      where: { id: projectId, userId },
      select: { id: true },
    });

    if (!ownsProject) {
      return NextResponse.json({ error: "Projeto não encontrado" }, { status: 404 });
    }

    const task = await prisma.task.create({
      data: {
        title,
        dueDate: dueDate ? new Date(dueDate) : null,
        startDate: startDate ? new Date(startDate) : null,
        projectId,
        userId,
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
