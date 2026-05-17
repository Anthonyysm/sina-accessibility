import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { atividadeDbService } from "@/service/server/atividades";
import { getSecureSession } from "@/lib/session";

const atualizarAtividadeSchema = z.object({
  titulo: z.string().min(3).max(200).optional(),
  texto_original: z.string().min(5).optional(),
  texto_adaptado: z.string().optional(),
  status: z.string().optional(),
});

type Params = { params: Promise<{ id: string }> };

// GET /api/atividades/:id
export async function GET(_: Request, { params }: Params) {
  try {
    const session = await getSecureSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    const { userId, role } = session;

    const { id } = await params;
    const numId = Number(id);
    const atividade = await atividadeDbService.buscarPorId(numId);

    if (!atividade) {
      return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    }

    if (atividade.criado_por !== parseInt(String(userId), 10) && role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso Negado (Ownership)" }, { status: 403 });
    }

    return NextResponse.json(atividade);
  } catch (error) {
    console.error("[API Atividades ID GET]", error);
    return NextResponse.json(
      { error: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}

// PUT /api/atividades/:id
export async function PUT(req: Request, { params }: Params) {
  try {
    const sessionData = await getSecureSession();

    if (!sessionData || !sessionData.userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    
    const userId = sessionData.userId;
    const role = sessionData.role;

    const { id } = await params;
    const numId = Number(id);
    
    // Validar se atividade existe e se pertence a quem está editando
    const atividade = await atividadeDbService.buscarPorId(numId);
    if (!atividade) {
      return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    }
    if (atividade.criado_por !== parseInt(String(userId), 10) && role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso Negado (Ownership)" }, { status: 403 });
    }

    const body = await req.json();
    
    // Validação de Input
    const parsedData = atualizarAtividadeSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsedData.error.issues },
        { status: 400 }
      );
    }

    const updated = await atividadeDbService.atualizar(numId, parsedData.data);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("[API Atividades ID PUT]", error);
    return NextResponse.json(
      { error: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}

// DELETE /api/atividades/:id
export async function DELETE(_: Request, { params }: Params) {
  try {
    const sessionData = await getSecureSession();

    if (!sessionData || !sessionData.userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    
    const userId = sessionData.userId;
    const role = sessionData.role;

    const { id } = await params;
    const numId = Number(id);

    // Validar se atividade existe e se pertence a quem está deletando
    const atividade = await atividadeDbService.buscarPorId(numId);
    if (!atividade) {
      return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    }
    if (atividade.criado_por !== parseInt(String(userId), 10) && role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso Negado (Ownership)" }, { status: 403 });
    }

    await atividadeDbService.deletar(numId);
    return NextResponse.json({ message: "Deletado com sucesso" });
  } catch (error) {
    console.error("[API Atividades ID DELETE]", error);
    return NextResponse.json(
      { error: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}