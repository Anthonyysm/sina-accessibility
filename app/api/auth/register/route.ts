import { NextRequest, NextResponse } from "next/server";
import { authDbService } from "@/service/server/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, name, role } = await request.json();

    if (!email || !name || !role) {
      return NextResponse.json(
        { error: "Email, nome e cargo são obrigatórios." },
        { status: 400 }
      );
    }

    const usuario = await authDbService.registrarUsuario(email, name, role);

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
  } catch (error: any) {
    console.error("[POST /api/auth/register]", error);
    if (error?.code === "P2002" || error?.message?.includes("Unique constraint failed")) {
      return NextResponse.json(
        { error: "Email já cadastrado." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Erro interno ao registrar usuário." },
      { status: 500 }
    );
  }
}
