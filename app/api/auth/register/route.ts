import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { email, nome, role } = await request.json();

    if (!email || !role) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    const usuario = await prisma.usuario.upsert({
      where: { email },
      update: {
        nome: nome || email.split("@")[0],
        tipo_usuario: role,
      },
      create: {
        email,
        nome: nome || email.split("@")[0],
        senha: "", // Senha é gerenciada pelo Firebase, mas o campo é obrigatório no schema
        tipo_usuario: role,
      },
    });

    return NextResponse.json({ ok: true, role: usuario.tipo_usuario });
  } catch (error) {
    console.error("[POST /api/auth/register]", error);
    return NextResponse.json({ error: "Erro ao registrar usuário no banco." }, { status: 500 });
  }
}
