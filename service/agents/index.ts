// service/agents/index.ts
// Ponto único de importação para o módulo de agentes.
// Qualquer arquivo externo deve importar daqui, nunca direto dos arquivos internos.

export { executarAgenteTexto } from "./agent.service";
export { agentsRegistry } from "./agent.configs";
export type { AgentType } from "./agent.configs";
