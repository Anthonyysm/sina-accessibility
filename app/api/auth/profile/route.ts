import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email não fornecido" }, { status: 400 });
  }

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { email },
      select: { tipo_usuario: true },
    });

    if (!usuario) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ role: usuario.tipo_usuario });
  } catch (error) {
    console.error("[GET /api/auth/profile]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
