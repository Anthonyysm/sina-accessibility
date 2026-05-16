import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const SESSION_COOKIE = "sina_session";

// Duração da sessão: 5 dias (em segundos)
const SESSION_MAX_AGE = 60 * 60 * 24 * 5;

/**
 * Salva o token de sessão Firebase em um cookie httpOnly seguro.
 * Chame isso após o login bem-sucedido na API Route.
 */
export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,          // não acessível via JS no cliente
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
  return response;
}

/**
 * Remove o cookie de sessão (logout).
 */
export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}

/**
 * Lê o token de sessão a partir dos cookies (uso em Server Components).
 */
export async function getSessionToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value;
}
