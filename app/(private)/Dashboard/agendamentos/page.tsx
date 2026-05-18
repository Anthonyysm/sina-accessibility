"use client"

import { AgendamentoManager } from "@/components/agendamentos/AgendamentoManager"
import { useAuth } from "@/lib/useAuth"

export default function AgendamentosPage() {
  const { user } = useAuth()

  return <AgendamentoManager criadoPor={user?.id_usuario ?? 0} />
}
