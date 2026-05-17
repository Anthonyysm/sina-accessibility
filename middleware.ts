import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "sina_session";

// Rotas que só podem ser acessadas por usuários NÃO autenticados.
// Se já tiver sessão, redireciona para o Dashboard.
const GUEST_ONLY_PATHS = ["/Login"];

// Prefixos de rotas privadas — qualquer rota dentro de /(private)
// que o Next.js expõe sem o parêntese no pathname.
// Ex: app/(private)/Dashboard → pathname "/Dashboard"
const PRIVATE_PREFIXES = ["/Dashboard","/StudentDashboard"];

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
  const role = request.cookies.get("sina_role")?.value;

  const isPrivate = PRIVATE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  );

  const isGuestOnly = GUEST_ONLY_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  // 1. Rota privada sem sessão → redireciona para login
  if (isPrivate && !session) {
    return NextResponse.redirect(new URL("/Login", request.url));
  }

  // 2. Com sessão, bloqueios por cargo:
  if (session) {
    // Se o Estudante tenta acessar o Dashboard do Professor
    if (pathname.startsWith("/Dashboard") && role !== "INTERPRETE") {
      return NextResponse.redirect(new URL("/StudentDashboard", request.url));
    }
    
    // Se o Professor tenta acessar o Dashboard do Estudante
    if (pathname.startsWith("/StudentDashboard") && role === "INTERPRETE") {
      return NextResponse.redirect(new URL("/Dashboard", request.url));
    }

    // Se tenta acessar rota de convidado (ex: /Login) ou raiz (Landing Page)
    if (isGuestOnly || pathname === "/") {
      if (role === "INTERPRETE") {
        return NextResponse.redirect(new URL("/Dashboard", request.url));
      } else {
        return NextResponse.redirect(new URL("/StudentDashboard", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
