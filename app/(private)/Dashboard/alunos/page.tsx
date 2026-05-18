"use client"

import AlunosList from "@/components/dashboard/AlunosList"
import { useAuth } from "@/lib/useAuth"

export default function AlunosPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-bold text-[#1e3a5f]">Lista de Alunos Vinculados</h2>
        <p className="text-xs text-[#6b7fa3] mt-0.5">Estudantes vinculados às suas turmas</p>
      </div>
      <AlunosList criadoPor={user?.id_usuario ?? 0} />
    </div>
  )
}
