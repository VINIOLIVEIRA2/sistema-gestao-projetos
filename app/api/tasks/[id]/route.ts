import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await getAuthUser();
    const { id } = await params;

    const result = await prisma.task.deleteMany({
      where: { id, userId },
    });

    if (result.count === 0) {
      return NextResponse.json({ error: "Tarefa não encontrada" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await getAuthUser();
    const { id } = await params;

    const body = await req.json();
    const { title, done, priority, dueDate, startDate, completedAt } = body;

    if (
      title === undefined &&
      done === undefined &&
      priority === undefined &&
      dueDate === undefined &&
      startDate === undefined &&
      completedAt === undefined
    ) {
      return NextResponse.json(
        { error: "Nada para atualizar" },
        { status: 400 }
      );
    }

    const result = await prisma.task.updateMany({
      where: { id, userId },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(done !== undefined ? { done } : {}),
        ...(priority !== undefined ? { priority } : {}),
        ...(dueDate !== undefined
          ? { dueDate: dueDate ? new Date(`${dueDate}T12:00:00.000Z`) : null }
          : {}),
        ...(startDate !== undefined
          ? { startDate: startDate ? new Date(`${startDate}T12:00:00.000Z`) : null }
          : {}),
        ...(completedAt !== undefined
          ? { completedAt: completedAt ? new Date(`${completedAt}T12:00:00.000Z`) : null }
          : {}),
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { error: "Tarefa não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
