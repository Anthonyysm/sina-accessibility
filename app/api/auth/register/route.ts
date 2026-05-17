import { NextRequest, NextResponse } from "next/server";
import { authDbService } from "@/service/server/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, name, role, password } = await request.json();

    if (!email || !role) {
      return NextResponse.json(
        { error: "Email e cargo são obrigatórios." },
        { status: 400 }
      );
    }

    const usuario = await authDbService.registrarUsuario(email, name, role, password);

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
