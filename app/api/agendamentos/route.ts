import { NextResponse } from "next/server";
import { getSecureSession } from "@/lib/session";
import { agendamentoDbService } from "@/service/server/agendamentos";

export async function GET(request: Request) {
  try {
    const session = await getSecureSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const url = new URL(request.url);
    const inicio = url.searchParams.get("inicio");
    const fim = url.searchParams.get("fim");
    const userId = parseInt(session.userId, 10);

    let agendamentos;
    if (inicio && fim) {
      agendamentos = await agendamentoDbService.listarPorPeriodo(userId, new Date(inicio), new Date(fim));
    } else {
      agendamentos = await agendamentoDbService.listar(userId);
    }

    return NextResponse.json(agendamentos);
  } catch (error) {
    console.error("[API Agendamentos GET]", error);
    return NextResponse.json({ error: "Erro ao buscar agendamentos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSecureSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { titulo, descricao, data, id_atividade } = body;

    if (!titulo || titulo.trim().length < 2) {
      return NextResponse.json({ error: "O título deve ter pelo menos 2 caracteres." }, { status: 400 });
    }

    if (!data) {
      return NextResponse.json({ error: "A data do agendamento é obrigatória." }, { status: 400 });
    }

    const agendamento = await agendamentoDbService.criar({
      titulo: titulo.trim(),
      descricao: descricao?.trim() || null,
      data: new Date(data),
      criado_por: parseInt(session.userId, 10),
      id_atividade: id_atividade || null,
    });

    return NextResponse.json(agendamento, { status: 201 });
  } catch (error) {
    console.error("[API Agendamentos POST]", error);
    return NextResponse.json({ error: "Erro ao criar agendamento" }, { status: 500 });
  }
}
