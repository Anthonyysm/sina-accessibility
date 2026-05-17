import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { email, name, role } = await request.json();

    if (!email || !role) {
      return NextResponse.json(
        { error: "Email e cargo são obrigatórios." },
        { status: 400 }
      );
    }

    // Mapeia o cargo para os valores do banco (INTERPRETE ou ESTUDANTE)
    const tipoUsuario = role === "interprete" ? "INTERPRETE" : "ESTUDANTE";

    const usuario = await prisma.usuario.upsert({
      where: { email },
      update: {
        nome: name,
        tipo_usuario: tipoUsuario,
      },
      create: {
        email,
        nome: name,
        senha: "", // Gerenciado pelo Firebase
        tipo_usuario: tipoUsuario,
      },
    });

    return NextResponse.json(
      {
        ok: true,
        user: {
          id: usuario.id_usuario,
          email: usuario.email,
          role: usuario.tipo_usuario,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/auth/register]", error);
    return NextResponse.json(
      { error: "Erro interno ao registrar usuário." },
      { status: 500 }
    );
  }
}
