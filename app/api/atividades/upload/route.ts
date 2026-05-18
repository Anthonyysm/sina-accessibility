import { NextResponse } from "next/server";
import { getSecureSession } from "@/lib/session";
import { atividadeDbService } from "@/service/server/atividades";
import { saveUploadedFile } from "@/service/storage";
import { extractTextFromPdf } from "@/service/pdf";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["application/pdf"];

export async function POST(request: Request) {
  try {
    const session = await getSecureSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const titulo = formData.get("titulo") as string | null;
    const data_entrega = formData.get("data_entrega") as string | null;
    const id_turma = formData.get("id_turma") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado." },
        { status: 400 }
      );
    }

    if (!titulo || titulo.trim().length < 3) {
      return NextResponse.json(
        { error: "O título deve ter pelo menos 3 caracteres." },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Apenas arquivos PDF são aceitos." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "O PDF deve ter no máximo 10MB." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const extracted = await extractTextFromPdf(buffer);

    if (extracted.text.length < 5) {
      return NextResponse.json(
        {
          error:
            "O texto extraído do PDF é muito curto. Verifique se o arquivo contém texto selecionável.",
        },
        { status: 400 }
      );
    }

    const storedFile = await saveUploadedFile(file, "atividade");

    const criado_por = parseInt(session.userId, 10);

    const atividade = await atividadeDbService.criar({
      titulo: titulo.trim(),
      texto_original: extracted.text,
      criado_por,
      arquivo_url: storedFile.url,
      arquivo_nome: storedFile.name,
      arquivo_tipo: storedFile.type,
      data_entrega: data_entrega ? new Date(data_entrega) : null,
      id_turma: id_turma ? parseInt(id_turma, 10) : null,
    });

    return NextResponse.json(
      {
        atividade,
        extractedText: extracted.text,
        pages: extracted.pages,
        fileUrl: storedFile.url,
        fileName: storedFile.name,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("[API Upload PDF]", error);

    const message = error instanceof Error ? error.message : "";

    if (message.includes("excede o tamanho")) {
      return NextResponse.json({ error: message }, { status: 400 });
    }

    if (message.includes("Não foi possível extrair")) {
      return NextResponse.json({ error: message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Erro ao processar o PDF. Tente novamente." },
      { status: 500 }
    );
  }
}
