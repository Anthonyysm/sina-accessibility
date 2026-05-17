import { NextResponse } from "next/server";
import { atividadeDbService } from "@/service/server/atividades";

type Params = { params: Promise<{ id: string }> };

// GET /api/atividades/:id
export async function GET(_: Request, { params }: Params) {
  try {
    const { id } = await params;
    const numId = Number(id);
    const atividade = await atividadeDbService.buscarPorId(numId);

    if (!atividade) {
      return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    }

    return NextResponse.json(atividade);
  } catch (error) {
    console.error("[API Atividades ID GET]", error);
    return NextResponse.json(
      { error: "Erro ao buscar atividade" },
      { status: 500 }
    );
  }
}

// PUT /api/atividades/:id
export async function PUT(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const numId = Number(id);
    const body = await req.json();
    const updated = await atividadeDbService.atualizar(numId, body);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("[API Atividades ID PUT]", error);
    return NextResponse.json(
      { error: "Erro ao atualizar atividade" },
      { status: 500 }
    );
  }
}

// DELETE /api/atividades/:id
export async function DELETE(_: Request, { params }: Params) {
  try {
    const { id } = await params;
    const numId = Number(id);
    await atividadeDbService.deletar(numId);
    return NextResponse.json({ message: "Deletado com sucesso" });
  } catch (error) {
    console.error("[API Atividades ID DELETE]", error);
    return NextResponse.json(
      { error: "Erro ao deletar atividade" },
      { status: 500 }
    );
  }
}