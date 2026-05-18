import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { atividadeDbService } from "@/service/server/atividades";
import { getSecureSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

const atividadeSchema = z.object({
  titulo: z.string().min(3).max(200),
  texto_original: z.string().min(5),
  data_entrega: z.string().optional(),
  id_turma: z.number().optional(),
});

// GET /api/atividades
export async function GET(request: Request) {
  try {
    const session = await getSecureSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { userId, role } = session;
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const turma = url.searchParams.get("turma");
    const busca = url.searchParams.get("busca");
    const estudante = url.searchParams.get("estudante");

    let atividades = await atividadeDbService.listar();
    
    const uid = parseInt(String(userId), 10);

    // Modo estudante: filtrar apenas atividades das turmas do aluno
    if (estudante === "true") {
      const turmasDoAluno = await prisma.turmaAluno.findMany({
        where: { id_usuario: uid },
        select: { id_turma: true },
      });
      const turmaIds = new Set(turmasDoAluno.map((t) => t.id_turma));
      atividades = atividades.filter((a) => a.id_turma && turmaIds.has(a.id_turma));
      return NextResponse.json(atividades);
    }

    // Modo professor: filtrar por criador ou ADMIN
    let atividadesFiltradas = atividades.filter(a => a.criado_por === uid || role === "ADMIN");

    // Filtro por status
    if (status && status !== "todos") {
      atividadesFiltradas = atividadesFiltradas.filter(a => a.status === status);
    }

    // Filtro por turma
    if (turma) {
      atividadesFiltradas = atividadesFiltradas.filter(a => a.id_turma === parseInt(turma, 10));
    }

    // Filtro por busca no título
    if (busca) {
      const termo = busca.toLowerCase();
      atividadesFiltradas = atividadesFiltradas.filter(a => a.titulo.toLowerCase().includes(termo));
    }

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
        { error: "Dados inválidos", details: parsedData.error.issues },
        { status: 400 }
      );
    }

    const { titulo, texto_original, data_entrega, id_turma } = parsedData.data;

    const criado_por = parseInt(userId, 10);

    const atividade = await atividadeDbService.criar({
      titulo,
      texto_original,
      criado_por,
      data_entrega: data_entrega ? new Date(data_entrega) : null,
      id_turma: id_turma || null,
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