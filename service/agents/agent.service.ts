// service/agents/agent.service.ts
// Motor de execução dos agentes de IA.
// Responsabilidade: ler o prompt do arquivo e chamar o modelo Gemini.
//
// ATENÇÃO: Antes de passar PDFs ou imagens como buffer diretamente,
// use OCR ou biblioteca de extração (pdf-parse, tesseract.js, etc.)
// O .toString() em buffers binários gera caracteres corrompidos.

import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import fs from "fs";
import path from "path";
import { agentsRegistry, AgentType } from "./agent.configs";
import { AppError } from "@/lib/errors";

interface ExecutarAgenteParams {
  agentType: AgentType;
  entrada: string | Buffer; // texto puro ou arquivo (buffer)
}

export async function executarAgenteTexto(
  params: ExecutarAgenteParams
): Promise<string> {
  const { agentType, entrada } = params;

  const configAgent = agentsRegistry[agentType];

  if (!configAgent) {
    throw new AppError(`Agente do tipo '${agentType}' não encontrado.`, 404);
  }

  const caminhoPrompt = path.join(
    process.cwd(),
    "service",
    "agents",
    "prompts",
    configAgent.promptFile
  );

  const systemPrompt = fs.readFileSync(caminhoPrompt, "utf-8");
  const promptFinal =
    typeof entrada === "string" ? entrada : entrada.toString("utf-8");

  const { text } = await generateText({
    model: google("gemini-2.5-flash"),
    system: systemPrompt,
    prompt: promptFinal,
  });

  return text;
}
