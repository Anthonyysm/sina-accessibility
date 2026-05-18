"use client"

import { TurmaManager } from "@/components/turmas/TurmaManager"
import { useAuth } from "@/lib/useAuth"

export default function TurmasPage() {
  const { user } = useAuth()

  return (
    <TurmaManager
      criadoPor={user?.id_usuario ?? 0}
      onSuccess={() => window.dispatchEvent(new CustomEvent("nova-atividade"))}
    />
  )
}
