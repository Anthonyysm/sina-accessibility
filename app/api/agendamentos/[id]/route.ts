import { NextResponse } from "next/server";
import { getSecureSession } from "@/lib/session";
import { agendamentoDbService } from "@/service/server/agendamentos";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSecureSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { titulo, descricao, data, id_atividade } = body;

    const agendamento = await agendamentoDbService.buscarPorId(parseInt(id, 10));
    if (!agendamento) {
      return NextResponse.json({ error: "Agendamento não encontrado" }, { status: 404 });
    }

    if (agendamento.criado_por !== parseInt(session.userId, 10)) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    const updated = await agendamentoDbService.atualizar(parseInt(id, 10), {
      titulo: titulo?.trim(),
      descricao: descricao?.trim(),
      data: data ? new Date(data) : undefined,
      id_atividade: id_atividade,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[API Agendamento PUT]", error);
    return NextResponse.json({ error: "Erro ao atualizar agendamento" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSecureSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const agendamento = await agendamentoDbService.buscarPorId(parseInt(id, 10));
    if (!agendamento) {
      return NextResponse.json({ error: "Agendamento não encontrado" }, { status: 404 });
    }

    if (agendamento.criado_por !== parseInt(session.userId, 10)) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    await agendamentoDbService.deletar(parseInt(id, 10));
    return NextResponse.json({ message: "Agendamento excluído com sucesso" });
  } catch (error) {
    console.error("[API Agendamento DELETE]", error);
    return NextResponse.json({ error: "Erro ao excluir agendamento" }, { status: 500 });
  }
}
