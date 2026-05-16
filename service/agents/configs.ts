// Mapeia qual arquivo de prompt pertence a qual agente

export const agentsRegistry = {
agentpl2: {
  promptFile: "prompt_pl2_adapter.txt",
  }

  // Colocar aqui os agentes futuros

} as const;

export type AgentType = keyof typeof agentsRegistry;