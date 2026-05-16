// O motor que lê o arquivo e chama o Gemini 
// LEMBRAR QUE NO FUTURO ANTES DE PASSAR UM ARQUIVO PDF OU IMAGEM BRUTA
// DIRETO COMO BUFFER PARA O METODO .toString() ELE VAI TRANSFORMAR TUDO EM
// CARACTER CORROMPIDO. ENTÃO O IDEAL É USAR UM OCR OU BIBLIOTECA PRA EXTRAIR
// O TEXTO ANTES (biblioteca pdf-parse, OCR tesseract.js, etc)
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import fs from 'fs';
import path from 'path';
import { agentsRegistry, AgentType } from './configs';

interface ExecutarAgenteParams {
  agentType: AgentType;
  entrada: string | Buffer; //texto ou arquivo(buffer)
}

export async function executarAgenteTexto(params: ExecutarAgenteParams): Promise<string> {
  const { agentType, entrada } = params;

  const configAgent = agentsRegistry[agentType];

  if (!configAgent) {
    throw new Error(`Agente do tipo ${agentType} não encontrado.`);
  }

  try {
    const caminhoPrompt = path.join(process.cwd(), 'service', 'agents', 'prompts', configAgent.promptFile);
    const systemPrompt = fs.readFileSync(caminhoPrompt, 'utf-8');
    const promptFinal = typeof entrada === 'string' ? entrada : entrada.toString('utf-8');
    const { text } = await generateText({
      model: google('gemini-2.5-flash'),
      system: systemPrompt,
      prompt: promptFinal,
    });

    return text;
  } catch (error) {
    console.error(`Falha no agente ${agentType}:`, error);
    throw new Error("Erro na execução interna do motor.");
  }
}
