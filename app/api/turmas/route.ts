import { NextResponse } from "next/server";
import { getSecureSession } from "@/lib/session";
import { turmaDbService } from "@/service/server/turmas";

export async function GET(request: Request) {
  try {
    const session = await getSecureSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const url = new URL(request.url);
    const criadoPor = url.searchParams.get("criado_por");
    const userId = criadoPor ? parseInt(criadoPor, 10) : parseInt(session.userId, 10);

    const turmas = await turmaDbService.listar(userId);
    return NextResponse.json(turmas);
  } catch (error) {
    console.error("[API Turmas GET]", error);
    return NextResponse.json({ error: "Erro ao buscar turmas" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSecureSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { nome, descricao } = body;

    if (!nome || nome.trim().length < 2) {
      return NextResponse.json({ error: "O nome da turma deve ter pelo menos 2 caracteres." }, { status: 400 });
    }

    const turma = await turmaDbService.criar({
      nome: nome.trim(),
      descricao: descricao?.trim() || null,
      criado_por: parseInt(session.userId, 10),
    });

    return NextResponse.json(turma, { status: 201 });
  } catch (error) {
    console.error("[API Turmas POST]", error);
    return NextResponse.json({ error: "Erro ao criar turma" }, { status: 500 });
  }
}
