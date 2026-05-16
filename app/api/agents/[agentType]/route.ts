// app/api/agents/[agentType]/route.ts
import { executarAgenteTexto, agentsRegistry, AgentType } from "@/service/agents";
import { AppError, handleApiError } from "@/lib/errors";

export const maxDuration = 30;

export async function POST(
  req: Request,
  { params }: { params: Promise<{ agentType: string }> }
) {
  const { agentType } = await params;

  // Parse isolado: erro de JSON inválido vira 400, não 500
  let body: { texto?: string };
  try {
    body = await req.json();
  } catch {
    return handleApiError(
      new AppError("Corpo da requisição inválido. Envie JSON com o campo 'texto'.", 400)
    );
  }

  try {
    const { texto } = body;

    if (!agentType || !(agentType in agentsRegistry)) {
      throw new AppError(`Agente '${agentType}' não configurado no catálogo.`, 404);
    }

    if (!texto || texto.trim() === "") {
      throw new AppError("O campo 'texto' é obrigatório no corpo da requisição.", 400);
    }

    const resultado = await executarAgenteTexto({
      agentType: agentType as AgentType,
      entrada: texto,
    });

    return Response.json({ resultado });

  } catch (error) {
    return handleApiError(error);
  }
}