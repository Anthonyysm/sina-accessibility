import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "sina_session";

// Rotas que só podem ser acessadas por usuários NÃO autenticados.
// Se já tiver sessão, redireciona para o Dashboard.
const GUEST_ONLY_PATHS = ["/Login"];

// Prefixos de rotas privadas — qualquer rota dentro de /(private)
// que o Next.js expõe sem o parêntese no pathname.
// Ex: app/(private)/Dashboard → pathname "/Dashboard"
const PRIVATE_PREFIXES = ["/Dashboard"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignora arquivos estáticos e rotas internas do Next.js
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const session = request.cookies.get(SESSION_COOKIE)?.value;

  const isPrivate = PRIVATE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  );

  const isGuestOnly = GUEST_ONLY_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  // ── Rota privada sem sessão → /NotLogged ──────────────────────────────────
  if (isPrivate && !session) {
    return NextResponse.redirect(new URL("/NotLogged", request.url));
  }

  // ── Rota guest-only com sessão → /Dashboard ───────────────────────────────
  if (isGuestOnly && session) {
    return NextResponse.redirect(new URL("/Dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
