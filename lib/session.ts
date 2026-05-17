import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifySessionToken } from "./jwt";

export const SESSION_COOKIE = "sina_session";

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

const SESSION_MAX_AGE = 60 * 60 * 24 * 5;

export function setSessionCookie(response: NextResponse, signedToken: string) {
  response.cookies.set(SESSION_COOKIE, "", { ...COOKIE_OPTS, maxAge: 0 });
  response.cookies.set(SESSION_COOKIE, signedToken, { ...COOKIE_OPTS, maxAge: SESSION_MAX_AGE });
  return response;
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, "", { ...COOKIE_OPTS, maxAge: 0 });
  return response;
}

export async function getSecureSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
