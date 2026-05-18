import { NextResponse } from "next/server";
import { getSecureSession } from "@/lib/session";
import { turmaDbService } from "@/service/server/turmas";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSecureSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { id_usuario } = body;

    if (!id_usuario) {
      return NextResponse.json({ error: "ID do aluno é obrigatório" }, { status: 400 });
    }

    const turma = await turmaDbService.buscarPorId(parseInt(id, 10));
    if (!turma) {
      return NextResponse.json({ error: "Turma não encontrada" }, { status: 404 });
    }

    if (turma.criado_por !== parseInt(session.userId, 10)) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    const existing = turma.alunos.find((a) => a.id_usuario === id_usuario);
    if (existing) {
      return NextResponse.json({ error: "Aluno já está nesta turma" }, { status: 409 });
    }

    const aluno = await turmaDbService.adicionarAluno(parseInt(id, 10), id_usuario);
    return NextResponse.json(aluno, { status: 201 });
  } catch (error) {
    console.error("[API Turma Alunos POST]", error);
    return NextResponse.json({ error: "Erro ao adicionar aluno" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSecureSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const url = new URL(request.url);
    const id_usuario = url.searchParams.get("id_usuario");

    if (!id_usuario) {
      return NextResponse.json({ error: "ID do aluno é obrigatório" }, { status: 400 });
    }

    const turma = await turmaDbService.buscarPorId(parseInt(id, 10));
    if (!turma) {
      return NextResponse.json({ error: "Turma não encontrada" }, { status: 404 });
    }

    if (turma.criado_por !== parseInt(session.userId, 10)) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    await turmaDbService.removerAluno(parseInt(id, 10), parseInt(id_usuario, 10));
    return NextResponse.json({ message: "Aluno removido com sucesso" });
  } catch (error) {
    console.error("[API Turma Alunos DELETE]", error);
    return NextResponse.json({ error: "Erro ao remover aluno" }, { status: 500 });
  }
}
