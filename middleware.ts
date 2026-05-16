import { NextRequest, NextResponse } from "next/server";

// Rotas que exigem autenticação (prefixo do grupo de rotas privadas)
const PRIVATE_PREFIX = "/dashboard"; // ajuste conforme seus grupos ex: /dashboard, /app, etc.

// Rotas públicas que nunca devem ser protegidas
const PUBLIC_PATHS = ["/", "/login", "/cadastro"];

// Nome do cookie que armazena o session token do Firebase
const SESSION_COOKIE = "sina_session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignora arquivos estáticos e internos do Next.js
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE)?.value;
  const isPublicPath = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
  const isPrivatePath = pathname.startsWith(PRIVATE_PREFIX);

  // Rota privada sem sessão → redireciona para login
  if (isPrivatePath && !sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    // Guarda a URL de destino para redirecionar após o login
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Já autenticado tentando acessar login → redireciona para dashboard
  if (isPublicPath && sessionCookie && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Aplica o middleware em todas as rotas exceto as do Next.js internamente
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
