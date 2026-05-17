import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const SESSION_COOKIE = "sina_session";

// Duração da sessão: 5 dias (em segundos)
const SESSION_MAX_AGE = 60 * 60 * 24 * 5;

/**
 * Define um único cookie assinado contendo userId + role.
 * Limpa o cookie existente antes para evitar dados stale.
 */
export function setSessionCookie(response: NextResponse, signedToken: string) {
  const clearOpts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 0,
    path: "/",
  };

  response.cookies.set(SESSION_COOKIE, "", clearOpts);

  const setOpts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: SESSION_MAX_AGE,
    path: "/",
  };

  response.cookies.set(SESSION_COOKIE, signedToken, setOpts);

  return response;
}

/**
 * Remove o cookie de sessão (logout).
 */
export function clearSessionCookie(response: NextResponse) {
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 0,
    path: "/",
  };

  response.cookies.set(SESSION_COOKIE, "", options);

  return response;
}

/**
 * Lê o cookie bruto (uso em Server Components).
 */
export async function getSessionCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value;
}

import { verifySessionToken } from "./jwt";

/**
 * Lê e verifica o token assinado.
 * Retorna { userId, role, idToken? } se válido, senão null.
 */
export async function getSecureSession() {
  const token = await getSessionCookie();
  if (!token) return null;
  return await verifySessionToken(token);
}
