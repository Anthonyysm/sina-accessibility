import { NextResponse } from "next/server";
import { atividadeDbService } from "@/service/server/atividades";

// GET /api/atividades
export async function GET() {
  try {
    const atividades = await atividadeDbService.listar();
    return NextResponse.json(atividades);
  } catch (error) {
    console.error("[API Atividades GET]", error);
    return NextResponse.json(
      { error: "Erro ao buscar atividades" },
      { status: 500 }
    );
  }
}

// POST /api/atividades
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { titulo, texto_original, criado_por } = body;

    const atividade = await atividadeDbService.criar({
      titulo,
      texto_original,
      criado_por,
    });
    return NextResponse.json(atividade, { status: 201 });
  } catch (error) {
    console.error("[API Atividades POST]", error);
    return NextResponse.json(
      { error: "Erro ao criar atividade" },
      { status: 500 }
    );
  }
}