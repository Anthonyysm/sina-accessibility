// app/api/agents/[agentType]/route.ts
import { executarAgenteTexto, agentsRegistry, AgentType } from "@/service/agents";
import { AppError, handleApiError } from "@/lib/errors";

export const maxDuration = 30;

export async function POST(
  req: Request,
  { params }: { params: Promise<{ agentType: string }> }
) {
  const { agentType } = await params;

  // 1. Tratamento robusto de JSON
  let body: any;
  try {
    body = await req.json();
  } catch (error) {
    console.error("[API Agents] Falha ao parsear JSON:", error);
    return handleApiError(
      new AppError("Corpo da requisição inválido. Certifique-se de enviar um JSON válido.", 400)
    );
  }

  try {
    const { texto } = body;

    // 2. Validação do agente
    if (!agentType || !(agentType in agentsRegistry)) {
      throw new AppError(`Agente '${agentType}' não configurado no catálogo.`, 404);
    }

    // 3. Validação e sanitização do texto
    if (!texto || typeof texto !== "string" || texto.trim() === "") {
      throw new AppError("O campo 'texto' é obrigatório e deve ser uma string válida.", 400);
    }

    // Limite de segurança (ex: 30k caracteres para evitar estouro de tokens/memória)
    if (texto.length > 30000) {
      throw new AppError("O texto enviado é muito longo. Limite sugerido: 30.000 caracteres.", 400);
    }

    // Sanitização de caracteres de controle que podem quebrar prompts ou APIs (exceto quebras de linha e tabs)
    // Isso ajuda a evitar que aspas "sujas" ou caracteres invisíveis causem erros 500 no upstream
    const textoSanitizado = texto
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, "")
      .trim();

    const resultado = await executarAgenteTexto({
      agentType: agentType as AgentType,
      entrada: textoSanitizado,
    });

    return Response.json({ resultado });

  } catch (error: any) {
    // Se o erro vier da SDK do Google/AI, ele pode não ser um AppError
    console.error(`[API Agents] Erro ao executar agente ${agentType}:`, error);
    
    if (error.message?.includes("fetch failed")) {
      return handleApiError(new AppError("Erro de conexão com o serviço de IA. Tente novamente em instantes.", 503));
    }

    return handleApiError(error);
  }
}