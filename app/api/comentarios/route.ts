import { NextResponse } from "next/server";
import { comentarioDbService } from "@/service/server/comentarios";

// POST /api/comentarios
export async function POST(request: Request) {
  try {
    const { id_atividade, id_usuario, comentario } = await request.json();

    const novo = await comentarioDbService.criar({
      id_atividade,
      id_usuario,
      comentario,
    });
    return NextResponse.json(novo, { status: 201 });
  } catch (error) {
    console.error("[API Comentarios POST]", error);
    return NextResponse.json(
      { error: "Erro ao criar comentário" },
      { status: 500 }
    );
  }
}