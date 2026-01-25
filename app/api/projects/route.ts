import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

async function getUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) throw new Error("UNAUTHORIZED");

  const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
  return payload.userId;
}

export async function GET() {
  try {
    const userId = await getUserId();

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
    const userId = await getUserId();
    const { title, service, status, requesterName } = await req.json();

    if (!title || !service || !status) {
      return NextResponse.json({ error: "Preencha tudo" }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: { title, service, status, requesterName, userId },
    });

    return NextResponse.json(project, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
}
