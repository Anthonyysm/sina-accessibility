// service/agents/agent.configs.ts
// Catálogo de agentes disponíveis: mapeia o tipo do agente ao seu arquivo de prompt.
// Para adicionar um novo agente, basta inserir uma nova entrada aqui.

export const agentsRegistry = {
  agentglosa: {
    promptFile: "prompt_glosa_adapter.txt",
  },

  // Adicione novos agentes abaixo:
  // agentSummarizer: {
  //   promptFile: "prompt_summarizer.txt",
  // },
} as const

export type AgentType = keyof typeof agentsRegistry
