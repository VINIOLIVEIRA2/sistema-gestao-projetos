import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getAuthUser } from "../../_utils/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await getAuthUser();
    const { id } = await params;
    const { title, service, status, requesterName } = await req.json();

    const project = await prisma.project.update({
      where: { id, userId },
      data: { title, service, status, requesterName },
    });

    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await getAuthUser();
    const { id } = await params;

    const result = await prisma.project.deleteMany({
      where: { id, userId },
    });

    if (result.count === 0) {
      return NextResponse.json({ error: "Projeto não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await getAuthUser();
    const { id } = await params;

    const body = await req.json();
    const { title, service, status, requesterName } = body;

    const result = await prisma.project.updateMany({
      where: { id, userId },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(service !== undefined ? { service } : {}),
        ...(status !== undefined ? { status } : {}),
        ...(requesterName !== undefined ? { requesterName } : {}),
      },
    });

    if (result.count === 0) {
      return NextResponse.json({ error: "Projeto não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
