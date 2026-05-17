import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { atividadeDbService } from "@/service/server/atividades";
import { getSecureSession } from "@/lib/session";

const atividadeSchema = z.object({
  titulo: z.string().min(3).max(200),
  texto_original: z.string().min(5),
});

// GET /api/atividades
export async function GET() {
  try {
    const session = await getSecureSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { userId, role } = session;

    const atividades = await atividadeDbService.listar();
    
    // Filtro contra IDOR na listagem
    const atividadesFiltradas = atividades.filter(a => a.criado_por === parseInt(String(userId), 10) || role === "ADMIN");

    return NextResponse.json(atividadesFiltradas);
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
    const session = await getSecureSession();

    if (!session || !session.userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    
    const userId = session.userId;

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