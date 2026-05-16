import { NextRequest, NextResponse } from "next/server";
import { setSessionCookie, clearSessionCookie } from "@/lib/session";

/**
 * POST /api/auth/session
 *
 * Recebe o idToken do Firebase (obtido no cliente após login)
 * e cria um cookie de sessão httpOnly seguro.
 *
 * Body: { idToken: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json(
        { error: "idToken inválido ou ausente." },
        { status: 400 }
      );
    }

    // ── Opcional: validar o idToken com Firebase Admin SDK ──────────────────
    // Se você tiver o firebase-admin instalado, descomente e use:
    //
    // import { getAuth } from "firebase-admin/auth";
    // import { initAdminApp } from "@/lib/firebase-admin";
    //
    // initAdminApp();
    // const decoded = await getAuth().verifyIdToken(idToken);
    // const sessionCookie = await getAuth().createSessionCookie(idToken, {
    //   expiresIn: 1000 * 60 * 60 * 24 * 5, // 5 dias em ms
    // });
    // → use `sessionCookie` no lugar de `idToken` abaixo
    // ────────────────────────────────────────────────────────────────────────

    // Sem Admin SDK: armazena o próprio idToken como sessão.
    // O middleware valida apenas a presença do cookie; para validação
    // criptográfica adicione o firebase-admin conforme comentário acima.
    const response = NextResponse.json({ ok: true }, { status: 200 });
    setSessionCookie(response, idToken);

    return response;
  } catch (error) {
    console.error("[POST /api/auth/session]", error);
    return NextResponse.json(
      { error: "Erro interno ao criar sessão." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/auth/session
 *
 * Remove o cookie de sessão (logout).
 */
export async function DELETE() {
  const response = NextResponse.json({ ok: true }, { status: 200 });
  clearSessionCookie(response);
  return response;
}
