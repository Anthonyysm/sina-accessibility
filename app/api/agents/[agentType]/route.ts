// app/api/agents/[agentType]/route.ts
import { NextResponse } from 'next/server';
import { executarAgenteTexto } from '@/service/agents/executor'; // Certifique-se se é 'service' ou 'services'
import { agentsRegistry, AgentType } from '@/service/agents/configs';

export const maxDuration = 30; 

export async function POST(
  req: Request,
  // Correção aqui: params agora precisa ser tratado como um objeto que contém uma Promise ou ser resolvido de forma estrita
  { params }: { params: Promise<{ agentType: string }> } | any
) {
  try {
    // Resolve os parâmetros da URL para garantir que não venha 'undefined'
    const resolvedParams = await params;
    const agentType = resolvedParams?.agentType;

    const { texto } = await req.json();

    // Validação de segurança
    if (!agentType || !(agentType in agentsRegistry)) {
      return NextResponse.json(
        { error: `Agente '${agentType}' não configurado no catálogo.` },
        { status: 404 }
      );
    }

    if (!texto) {
      return NextResponse.json(
        { error: "O campo 'texto' é obrigatório no corpo da requisição." },
        { status: 400 }
      );
    }

    // Executa o motor passando os parâmetros recebidos
    const respostaDoGemini = await executarAgenteTexto({
      agentType: agentType as AgentType,
      entrada: texto,
    });

    return NextResponse.json({ resultado: respostaDoGemini });

  } catch (error: any) {
    console.error("Erro na rota do agente:", error);
    return NextResponse.json({ error: error.message || "Erro interno" }, { status: 500 });
  }
}