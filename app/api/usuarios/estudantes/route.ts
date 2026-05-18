import { NextResponse } from "next/server";
import { getSecureSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSecureSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const estudantes = await prisma.usuario.findMany({
      where: { tipo_usuario: "ESTUDANTE", ativado: true },
      select: {
        id_usuario: true,
        nome: true,
        email: true,
        criado_em: true,
      },
      orderBy: { nome: "asc" },
    });

    return NextResponse.json(estudantes);
  } catch (error) {
    console.error("[API Estudantes GET]", error);
    return NextResponse.json({ error: "Erro ao buscar estudantes" }, { status: 500 });
  }
}
