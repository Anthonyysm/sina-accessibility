"use client";

import { useEffect, useState } from "react";
import { MdAdd, MdClose, MdEvent, MdDeleteOutline, MdEdit } from "react-icons/md";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Agendamento {
  id_agendamento: number;
  titulo: string;
  descricao: string | null;
  data: string;
  criado_em: string;
  criador: { nome: string };
  atividade: { id_atividade: number; titulo: string } | null;
}

interface Atividade {
  id_atividade: number;
  titulo: string;
}

interface AgendamentoManagerProps {
  criadoPor: number;
}

export function AgendamentoManager({ criadoPor }: AgendamentoManagerProps) {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("08:00");
  const [idAtividade, setIdAtividade] = useState("");
  const [saving, setSaving] = useState(false);

  function fetchAgendamentos() {
    setLoading(true);
    fetch(`/api/agendamentos?criado_por=${criadoPor}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAgendamentos(data);
      })
      .catch((err) => console.error("Erro ao buscar agendamentos:", err))
      .finally(() => setLoading(false));
  }

  function fetchAtividades() {
    fetch("/api/atividades")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAtividades(data);
      })
      .catch((err) => console.error("Erro ao buscar atividades:", err));
  }

  useEffect(() => { fetchAgendamentos(); }, []);

  function resetForm() {
    setTitulo("");
    setDescricao("");
    setData("");
    setHora("08:00");
    setIdAtividade("");
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!titulo.trim() || !data) return;
    setSaving(true);
    try {
      const dataCompleta = new Date(`${data}T${hora}:00`);
      const res = await fetch("/api/agendamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo,
          descricao,
          data: dataCompleta.toISOString(),
          id_atividade: idAtividade ? parseInt(idAtividade, 10) : null,
        }),
      });
      if (!res.ok) throw new Error("Erro ao criar agendamento");
      toast.success("Agendamento criado com sucesso");
      resetForm();
      setModalOpen(false);
      fetchAgendamentos();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao criar agendamento");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Tem certeza que deseja excluir este agendamento?")) return;
    try {
      const res = await fetch(`/api/agendamentos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao excluir agendamento");
      toast.success("Agendamento excluído com sucesso");
      fetchAgendamentos();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao excluir agendamento");
    }
  }

  function formatarData(dataStr: string) {
    const d = new Date(dataStr);
    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function isPassado(dataStr: string) {
    return new Date(dataStr) < new Date();
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-[#1e3a5f]">Agendamentos</h2>
          <p className="text-xs text-[#6b7fa3] mt-0.5">Gerencie seus agendamentos e prazos</p>
        </div>
        <Button
          onClick={() => { resetForm(); setModalOpen(true); }}
          className="rounded-full bg-[#1e3a5f] hover:bg-[#162d4a] text-white text-sm font-semibold gap-1.5 h-9 px-4"
        >
          <MdAdd className="text-base" />
          Novo Agendamento
        </Button>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="text-center py-8 text-slate-500 text-sm">Carregando agendamentos...</div>
      ) : agendamentos.length === 0 ? (
        <div className="text-center py-8 text-slate-400 text-sm italic">Nenhum agendamento cadastrado.</div>
      ) : (
        <div className="space-y-2">
          {agendamentos.map((a) => {
            const passado = isPassado(a.data);
            return (
              <div
                key={a.id_agendamento}
                className={`rounded-2xl bg-white shadow-[0_2px_12px_-4px_rgba(30,58,95,0.08)] p-4 flex items-start gap-4 ${passado ? "opacity-60" : ""}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${passado ? "bg-slate-100 text-slate-400" : "bg-blue-50 text-[#2b5784]"}`}>
                  <MdEvent className="text-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-[#1e3a5f]">{a.titulo}</h3>
                      {a.descricao && <p className="text-xs text-[#9aadca] mt-0.5">{a.descricao}</p>}
                      {a.atividade && (
                        <span className="inline-block mt-1 text-[10px] font-semibold bg-blue-50 text-blue-700 rounded-full px-2 py-0.5">
                          Vinculado: {a.atividade.titulo}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(a.id_agendamento)}
                      className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors shrink-0"
                    >
                      <MdDeleteOutline className="text-sm" />
                    </button>
                  </div>
                  <p className={`text-xs mt-2 ${passado ? "text-slate-400" : "text-[#6b7fa3]"}`}>
                    {passado ? "Encerrado" : "Agendado"}: {formatarData(a.data)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Novo Agendamento Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden rounded-2xl border-0 shadow-2xl [&>button:last-child]:hidden">
          <div className="bg-[#2b5784] px-6 pt-5 pb-4 relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />
            <DialogClose className="absolute right-4 top-4 z-20 rounded-lg p-1 text-white/70 transition-colors hover:bg-white/20 hover:text-white focus:outline-none" aria-label="Fechar">
              <MdClose className="text-xl" />
            </DialogClose>
            <DialogHeader className="relative z-10 pr-8">
              <div className="flex items-center gap-3 mb-1">
                <div className="bg-white/20 rounded-xl p-2">
                  <MdEvent className="text-white text-xl" />
                </div>
                <DialogTitle className="text-white font-bold text-lg">Novo Agendamento</DialogTitle>
              </div>
              <DialogDescription className="text-white/70 text-sm">Agende uma atividade ou evento</DialogDescription>
            </DialogHeader>
          </div>
          <form onSubmit={handleCreate} className="px-6 py-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Título</label>
              <input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex: Entrega da atividade X"
                maxLength={150}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-[#2b5784] focus:bg-white focus:ring-2 focus:ring-[#2b5784]/10"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Descrição (opcional)</label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Detalhes do agendamento..."
                rows={2}
                maxLength={500}
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-[#2b5784] focus:bg-white focus:ring-2 focus:ring-[#2b5784]/10"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Data</label>
                <input
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#2b5784] focus:bg-white focus:ring-2 focus:ring-[#2b5784]/10"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Hora</label>
                <input
                  type="time"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#2b5784] focus:bg-white focus:ring-2 focus:ring-[#2b5784]/10"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Vincular atividade (opcional)</label>
              <select
                value={idAtividade}
                onChange={(e) => setIdAtividade(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-[#2b5784]"
              >
                <option value="">Nenhuma atividade</option>
                {atividades.map((a) => (
                  <option key={a.id_atividade} value={a.id_atividade}>{a.titulo}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 px-5">
                Cancelar
              </Button>
              <Button type="submit" disabled={saving || !titulo.trim() || !data} className="rounded-xl bg-[#2b5784] hover:bg-[#1e3a5f] text-white font-semibold px-6 gap-2">
                {saving ? (
                  <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Criando...</>
                ) : (
                  <><MdAdd className="text-lg" />Agendar</>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
