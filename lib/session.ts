import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const SESSION_COOKIE = "sina_session";
export const ROLE_COOKIE = "sina_role";

// Duração da sessão: 5 dias (em segundos)
const SESSION_MAX_AGE = 60 * 60 * 24 * 5;

/**
 * Salva o token de sessão Firebase em um cookie httpOnly seguro.
 * Chame isso após o login bem-sucedido na API Route.
 */
export function setSessionCookie(response: NextResponse, token: string, role?: string) {
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,          // não acessível via JS no cliente
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });

  if (role) {
    response.cookies.set(ROLE_COOKIE, role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE,
      path: "/",
    });
  }

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
  response.cookies.set(ROLE_COOKIE, "", options);
  
  return response;
}

/**
 * Lê o token de sessão a partir dos cookies (uso em Server Components).
 */
export async function getSessionToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value;
}
