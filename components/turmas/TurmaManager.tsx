"use client";

import { useState, useEffect } from "react";
import { MdAdd, MdClose, MdGroups, MdDeleteOutline, MdPersonAdd, MdCheck, MdCheckCircle } from "react-icons/md";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { ModalHeader } from "@/components/ui/ModalHeader";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useApiFetch } from "@/lib/useApiFetch";

interface Turma {
  id_turma: number;
  nome: string;
  descricao: string | null;
  criado_em: string;
  id_criador: number;
  alunos: { id_usuario: number; nome: string; email: string }[];
}

interface Estudante {
  id_usuario: number;
  nome: string;
  email: string;
}

interface TurmaManagerProps {
  criadoPor: number;
  onSuccess?: () => void;
}

export function TurmaManager({ criadoPor, onSuccess }: TurmaManagerProps) {
  const { data: turmasData, loading, refetch: refetchTurmas } = useApiFetch<Turma[]>(
    `/api/turmas?criado_por=${criadoPor}`
  );
  const turmas = turmasData ?? [];
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [alunosModalOpen, setAlunosModalOpen] = useState(false);
  const [selectedTurma, setSelectedTurma] = useState<Turma | null>(null);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [saving, setSaving] = useState(false);
  const [estudantes, setEstudantes] = useState<Estudante[]>([]);
  const [selectedAlunos, setSelectedAlunos] = useState<Set<number>>(new Set());
  const [addingBulk, setAddingBulk] = useState(false);

  function fetchEstudantes() {
    fetch("/api/usuarios/estudantes")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setEstudantes(data);
      })
      .catch((err) => console.error("Erro ao buscar estudantes:", err));
  }

  useEffect(() => { fetchEstudantes(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/turmas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, descricao }),
      });
      if (!res.ok) throw new Error("Erro ao criar turma");
      toast.success("Turma criada com sucesso");
      setNome("");
      setDescricao("");
      setModalOpen(false);
      refetchTurmas();
      onSuccess?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao criar turma");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Tem certeza que deseja excluir esta turma?")) return;
    try {
      const res = await fetch(`/api/turmas/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao excluir turma");
      toast.success("Turma excluída com sucesso");
      refetchTurmas();
      onSuccess?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao excluir turma");
    }
  }

  async function handleAddAlunosBulk() {
    if (!selectedTurma || selectedAlunos.size === 0) return;
    setAddingBulk(true);
    const ids = Array.from(selectedAlunos);
    let successCount = 0;
    let errorCount = 0;

    for (const id of ids) {
      try {
        const res = await fetch(`/api/turmas/${selectedTurma.id_turma}/alunos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_usuario: id }),
        });
        if (res.ok) successCount++;
        else errorCount++;
      } catch {
        errorCount++;
      }
    }

    if (successCount > 0) toast.success(`${successCount} aluno(s) adicionado(s)`);
    if (errorCount > 0) toast.error(`${errorCount} erro(s) ao adicionar`);
    setSelectedAlunos(new Set());
    refetchTurmas();
    setAddingBulk(false);
  }

  function toggleAluno(id: number) {
    setSelectedAlunos((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAll() {
    const available = estudantes
      .filter((est) => !selectedTurma?.alunos.some((a) => a.id_usuario === est.id_usuario))
      .map((est) => est.id_usuario);
    const allSelected = available.every((id) => selectedAlunos.has(id));
    if (allSelected) {
      setSelectedAlunos(new Set());
    } else {
      setSelectedAlunos(new Set(available));
    }
  }

  async function handleRemoveAluno(id_usuario: number) {
    if (!selectedTurma) return;
    try {
      const res = await fetch(`/api/turmas/${selectedTurma.id_turma}/alunos?id_usuario=${id_usuario}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erro ao remover aluno");
      toast.success("Aluno removido com sucesso");
      refetchTurmas();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao remover aluno");
    }
  }

  function openAlunosModal(turma: Turma) {
    setSelectedTurma(turma);
    setAlunosModalOpen(true);
    fetchEstudantes();
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-[#1e3a5f]">Lista de Turmas</h2>
          <p className="text-xs text-[#6b7fa3] mt-0.5">Gerencie suas turmas e alunos</p>
        </div>
        <Button
          onClick={() => setModalOpen(true)}
          className="rounded-full bg-[#1e3a5f] hover:bg-[#162d4a] text-white text-sm font-semibold gap-1.5 h-9 px-4"
        >
          <MdAdd className="text-base" />
          Nova Turma
        </Button>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="text-center py-8 text-slate-500 text-sm">Carregando turmas...</div>
      ) : turmas.length === 0 ? (
        <div className="text-center py-8 text-slate-400 text-sm italic">Nenhuma turma cadastrada ainda.</div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {turmas.map((t) => (
            <div
              key={t.id_turma}
              className="rounded-2xl bg-white shadow-[0_2px_12px_-4px_rgba(30,58,95,0.08)] p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-bold text-[#1e3a5f] truncate flex-1">{t.nome}</h3>
                <div className="flex gap-1 shrink-0 ml-2">
                  <TooltipProvider delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => openAlunosModal(t)}
                          className="p-1.5 rounded-lg text-[#6b7fa3] hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                          <MdPersonAdd className="text-sm" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs">Gerenciar alunos</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleDelete(t.id_turma)}
                          className="p-1.5 rounded-lg text-[#6b7fa3] hover:bg-red-50 hover:text-red-500 transition-colors"
                        >
                          <MdDeleteOutline className="text-sm" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs">Excluir turma</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              {t.descricao && (
                <p className="text-xs text-[#9aadca] mb-3 line-clamp-2">{t.descricao}</p>
              )}
              <div className="flex items-center gap-3 text-xs text-[#6b7fa3]">
                <span className="flex items-center gap-1">
                  <MdGroups className="text-sm" />
                  {t._count?.alunos ?? t.alunos?.length ?? 0} alunos
                </span>
                <span>{t._count?.atividades ?? 0} atividades</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Nova Turma Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden rounded-2xl border-0 shadow-2xl [&>button:last-child]:hidden">
          <ModalHeader
            icon={<MdGroups className="text-white text-xl" />}
            title="Nova Turma"
            description="Crie uma nova turma para organizar seus alunos"
          />
          <form onSubmit={handleCreate} className="px-6 py-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Nome da Turma</label>
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: 7º Ano A"
                maxLength={100}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-[#2b5784] focus:bg-white focus:ring-2 focus:ring-[#2b5784]/10"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Descrição (opcional)</label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descrição da turma..."
                rows={3}
                maxLength={500}
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-[#2b5784] focus:bg-white focus:ring-2 focus:ring-[#2b5784]/10"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 px-5">
                Cancelar
              </Button>
              <Button type="submit" disabled={saving || !nome.trim()} className="rounded-xl bg-[#2b5784] hover:bg-[#1e3a5f] text-white font-semibold px-6 gap-2">
                {saving ? (
                  <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Criando...</>
                ) : (
                  <><MdAdd className="text-lg" />Criar Turma</>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Gerenciar Alunos Modal */}
      <Dialog open={alunosModalOpen} onOpenChange={setAlunosModalOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-2xl border-0 shadow-2xl [&>button:last-child]:hidden max-h-[80vh] flex flex-col">
          <ModalHeader
            icon={<MdPersonAdd className="text-white text-xl" />}
            title={`Alunos — ${selectedTurma?.nome}`}
            description="Adicione ou remova alunos da turma"
          />
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {/* Bulk add */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-600">Adicionar alunos</p>
                <div className="flex gap-2">
                  <button
                    onClick={selectAll}
                    className="text-[10px] text-[#2b5784] hover:underline font-medium"
                  >
                    {estudantes.filter((est) => !selectedTurma?.alunos.some((a) => a.id_usuario === est.id_usuario)).every((est) => selectedAlunos.has(est.id_usuario))
                      ? "Desmarcar todos"
                      : "Selecionar todos"}
                  </button>
                  <Button
                    onClick={handleAddAlunosBulk}
                    disabled={selectedAlunos.size === 0 || addingBulk}
                    className="rounded-xl bg-[#2b5784] hover:bg-[#1e3a5f] h-8 px-3 text-xs font-semibold gap-1.5"
                  >
                    {addingBulk ? (
                      <><span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />Adicionando...</>
                    ) : (
                      <><MdCheck className="text-sm" />Adicionar ({selectedAlunos.size})</>
                    )}
                  </Button>
                </div>
              </div>
              <div className="max-h-40 overflow-y-auto space-y-1 rounded-xl border border-slate-200 bg-slate-50 p-2">
                {estudantes
                  .filter((est) => !selectedTurma?.alunos.some((a) => a.id_usuario === est.id_usuario))
                  .map((est) => {
                    const checked = selectedAlunos.has(est.id_usuario);
                    return (
                      <label
                        key={est.id_usuario}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer transition-colors ${
                          checked ? "bg-blue-50" : "hover:bg-slate-100"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleAluno(est.id_usuario)}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                          checked ? "bg-[#2b5784] border-[#2b5784]" : "border-slate-300 bg-white"
                        }`}>
                          {checked && <MdCheck className="text-white text-xs" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-slate-800 truncate">{est.nome}</p>
                          <p className="text-[10px] text-slate-400 truncate">{est.email}</p>
                        </div>
                      </label>
                    );
                  })}
                {estudantes.filter((est) => !selectedTurma?.alunos.some((a) => a.id_usuario === est.id_usuario)).length === 0 && (
                  <p className="text-xs text-slate-400 italic text-center py-3">Todos os estudantes já estão nesta turma</p>
                )}
              </div>
            </div>

            {/* Lista de alunos */}
            {selectedTurma && selectedTurma.alunos.length === 0 ? (
              <p className="text-center text-sm text-slate-400 italic py-4">Nenhum aluno nesta turma</p>
            ) : (
              <div className="space-y-2">
                {selectedTurma?.alunos.map((a) => (
                  <div key={a.id_usuario} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <MdCheckCircle className="text-green-500 text-sm shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-slate-800">{a.usuario.nome}</p>
                        <p className="text-xs text-slate-400">{a.usuario.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveAluno(a.id_usuario)}
                      className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      <MdDeleteOutline className="text-sm" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
