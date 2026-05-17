import { NextRequest, NextResponse } from "next/server";
import { setSessionCookie } from "@/lib/session";
import { authDbService } from "@/service/server/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios." },
        { status: 400 }
      );
    }

    const usuario = await authDbService.autenticarUsuario(email, password);

    if (!usuario) {
      return NextResponse.json(
        { error: "Email ou senha inválidos." },
        { status: 401 }
      );
    }

    const response = NextResponse.json(
      {
        ok: true,
        user: {
          id: usuario.id_usuario,
          email: usuario.email,
          role: usuario.tipo_usuario,
        },
      },
      { status: 200 }
    );

    setSessionCookie(
      response,
      String(usuario.id_usuario),
      usuario.tipo_usuario,
      String(usuario.id_usuario)
    );

    return response;
  } catch (error) {
    console.error("[POST /api/auth/login]", error);
    return NextResponse.json(
      { error: "Erro interno ao autenticar usuário." },
      { status: 500 }
    );
  }
}
