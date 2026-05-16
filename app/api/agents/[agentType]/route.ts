// app/api/agents/[agentType]/route.ts
import { executarAgenteTexto, agentsRegistry, AgentType } from "@/service/agents";
import { AppError, handleApiError } from "@/lib/errors";

export const maxDuration = 30;

export async function POST(
  req: Request,
  { params }: { params: Promise<{ agentType: string }> }
) {
  try {
    const { agentType } = await params;
    const { texto } = await req.json();

    if (!agentType || !(agentType in agentsRegistry)) {
      throw new AppError(`Agente '${agentType}' não configurado no catálogo.`, 404);
    }

    if (!texto) {
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