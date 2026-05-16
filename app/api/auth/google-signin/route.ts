import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email inválido ou ausente." },
        { status: 400 }
      );
    }

    const trimmedName =
      typeof name === "string" && name.trim().length > 0
        ? name.trim().slice(0, 100)
        : email.split("@")[0].slice(0, 100);

    const usuario = await prisma.usuario.upsert({
      where: { email },
      update: {
        nome: trimmedName,
        senha: "",
      },
      create: {
        email,
        nome: trimmedName,
        senha: "",
        tipo_usuario: false,
      },
    });

    return NextResponse.json(
      {
        ok: true,
        user: {
          id: usuario.id,
          email: usuario.email,
          nome: usuario.nome,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[POST /api/auth/google-signin]", error);
    return NextResponse.json(
      { error: "Erro interno ao salvar usuário Google." },
      { status: 500 }
    );
  }
}
