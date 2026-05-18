"use client"

import { useEffect, useState } from "react"

interface Turma {
  id_turma: number
  nome: string
  alunos: {
    id_usuario: number
    usuario: { nome: string; email: string }
  }[]
}

export default function AlunosList({ criadoPor }: { criadoPor: number }) {
  const [turmas, setTurmas] = useState<Turma[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/turmas?criado_por=${criadoPor}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTurmas(data)
      })
      .catch(() => setTurmas([]))
      .finally(() => setLoading(false))
  }, [criadoPor])

  if (loading) {
    return <div className="text-center py-8 text-slate-500 text-sm">Carregando alunos...</div>
  }

  if (turmas.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400 text-sm italic">
        Crie uma turma primeiro para gerenciar alunos.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {turmas.map((turma) => (
        <div key={turma.id_turma} className="rounded-2xl bg-white shadow-[0_2px_12px_-4px_rgba(30,58,95,0.08)] p-5">
          <h3 className="text-sm font-bold text-[#1e3a5f] mb-3">{turma.nome}</h3>
          {turma.alunos && turma.alunos.length > 0 ? (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {turma.alunos.map((a) => (
                <div key={a.id_usuario} className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#3b5fa0] flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                    {a.usuario.nome.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#1e3a5f] truncate">{a.usuario.nome}</p>
                    <p className="text-[10px] text-slate-400 truncate">{a.usuario.email}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">Nenhum aluno nesta turma</p>
          )}
        </div>
      ))}
    </div>
  )
}
