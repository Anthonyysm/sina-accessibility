import { NextRequest, NextResponse } from "next/server";
import { setSessionCookie, clearSessionCookie } from "@/lib/session";
import { authDbService } from "@/service/server/auth";

export async function POST(request: NextRequest) {
  try {
    const { idToken, email } = await request.json();

    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json(
        { error: "idToken inválido ou ausente." },
        { status: 400 }
      );
    }

    const usuarioDb = await authDbService.obterUsuarioPorEmail(email);
    const role = usuarioDb?.tipo_usuario || "ESTUDANTE";
    const userId = usuarioDb?.id_usuario ? String(usuarioDb.id_usuario) : undefined;

    const response = NextResponse.json({ ok: true, role }, { status: 200 });
    setSessionCookie(response, idToken, role, userId);

    return response;
  } catch (error) {
    console.error("[POST /api/auth/session]", error);
    return NextResponse.json(
      { error: "Erro interno ao criar sessão." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true }, { status: 200 });
  clearSessionCookie(response);
  return response;
}
