import { NextRequest, NextResponse } from "next/server";
import { authDbService } from "@/service/server/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, name, role } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email inválido ou ausente." },
        { status: 400 }
      );
    }

    const usuario = await authDbService.registrarOuLogarGoogle(email, name, role);

    return NextResponse.json(
      {
        ok: true,
        user: {
          id: usuario.id_usuario,
          email: usuario.email,
          nome: usuario.nome,
          role: usuario.tipo_usuario,
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
