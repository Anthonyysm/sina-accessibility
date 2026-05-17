import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { atividadeDbService } from "@/service/server/atividades";
import { SESSION_COOKIE, USERID_COOKIE } from "@/lib/session";

const atividadeSchema = z.object({
  titulo: z.string().min(3).max(200),
  texto_original: z.string().min(5),
});

// GET /api/atividades
export async function GET() {
  try {
    const cookieStore = await cookies();
    if (!cookieStore.get(SESSION_COOKIE)?.value) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const atividades = await atividadeDbService.listar();
    return NextResponse.json(atividades);
  } catch (error) {
    console.error("[API Atividades GET]", error);
    return NextResponse.json(
      { error: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}

// POST /api/atividades
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(SESSION_COOKIE)?.value;
    const userId = cookieStore.get(USERID_COOKIE)?.value;

    if (!session || !userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    
    // Validação com Zod para evitar Mass Assignment e dados maliciosos
    const parsedData = atividadeSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsedData.error.errors },
        { status: 400 }
      );
    }

    const { titulo, texto_original } = parsedData.data;

    // Pega o ID seguro vindo do cookie de sessão, ignorando qualquer 'criado_por' malicioso no body
    const criado_por = parseInt(userId, 10);

    const atividade = await atividadeDbService.criar({
      titulo,
      texto_original,
      criado_por,
    });
    return NextResponse.json(atividade, { status: 201 });
  } catch (error) {
    console.error("[API Atividades POST]", error);
    return NextResponse.json(
      { error: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}