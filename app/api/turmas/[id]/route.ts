import { NextResponse } from "next/server";
import { getSecureSession } from "@/lib/session";
import { turmaDbService } from "@/service/server/turmas";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const turma = await turmaDbService.buscarPorId(parseInt(id, 10));
    if (!turma) {
      return NextResponse.json({ error: "Turma não encontrada" }, { status: 404 });
    }
    return NextResponse.json(turma);
  } catch (error) {
    console.error("[API Turma GET]", error);
    return NextResponse.json({ error: "Erro ao buscar turma" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSecureSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { nome, descricao } = body;

    const turma = await turmaDbService.buscarPorId(parseInt(id, 10));
    if (!turma) {
      return NextResponse.json({ error: "Turma não encontrada" }, { status: 404 });
    }

    if (turma.criado_por !== parseInt(session.userId, 10)) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    const updated = await turmaDbService.atualizar(parseInt(id, 10), {
      nome: nome?.trim(),
      descricao: descricao?.trim(),
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[API Turma PUT]", error);
    return NextResponse.json({ error: "Erro ao atualizar turma" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSecureSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const turma = await turmaDbService.buscarPorId(parseInt(id, 10));
    if (!turma) {
      return NextResponse.json({ error: "Turma não encontrada" }, { status: 404 });
    }

    if (turma.criado_por !== parseInt(session.userId, 10)) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    await turmaDbService.deletar(parseInt(id, 10));
    return NextResponse.json({ message: "Turma excluída com sucesso" });
  } catch (error) {
    console.error("[API Turma DELETE]", error);
    return NextResponse.json({ error: "Erro ao excluir turma" }, { status: 500 });
  }
}
