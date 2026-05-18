"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { ModalHeader } from "@/components/ui/ModalHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  MdVisibility,
  MdEdit,
  MdClose,
  MdContentCopy,
  MdCheck,
  MdArticle,
  MdAttachFile,
  MdPictureAsPdf,
  MdRefresh,
} from "react-icons/md";
import { PdfViewerModal } from "@/components/StudentDashboard/PdfViewerModal/PdfViewerModal";

type Status = "pending" | "done" | string; // Baseado no schema

interface Atividade {
  id_atividade: number;
  titulo: string;
  texto_original: string;
  texto_adaptado: string | null;
  status: string;
  criado_em: string;
  data_entrega: string | null;
  arquivo_url: string | null;
  arquivo_nome: string | null;
  id_turma: number | null;
  turma: { nome: string } | null;
  usuario: {
    nome: string;
  };
}

import { getInitials, getAvatarColor } from "@/lib/profile-constants";


function StatusBadge({ status }: { status: string }) {
  const isDone = status.toLowerCase() === "feito" || status.toLowerCase() === "done";
  
  const label = isDone ? "Feito" : "Não feito";
  const styles = isDone 
    ? "p-1 bg-green-50 text-green-700 border-green-200 hover:bg-green-50"
    : "p-1 bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50";

  return (
    <Badge
      variant="outline"
      className={`rounded-full text-xs font-semibold ${styles}`}
    >
      {label}
    </Badge>
  );
}

function UserAvatar({
  initials,
  color,
  name,
}: {
  initials: string;
  color: string;
  name: string;
}) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 cursor-default select-none"
            style={{ backgroundColor: color }}
          >
            {initials}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          {name}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default function TableContent({ refreshKey = 0 }: { refreshKey?: number }) {
  const [materiais, setMateriais] = useState<Atividade[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("todos");
  const [busca, setBusca] = useState("");
  const [turmaFilter, setTurmaFilter] = useState("");
  const [turmas, setTurmas] = useState<{ id_turma: number; nome: string }[]>([]);
  const [lastRefresh, setLastRefresh] = useState<string>("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // Estados do Modal de Visualização
  const [selectedAtividade, setSelectedAtividade] = useState<Atividade | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);

  const handleOpenVisualizar = (atividade: Atividade) => {
    setSelectedAtividade(atividade);
    setModalOpen(true);
  };

  const handleCopy = () => {
    if (selectedAtividade?.texto_original) {
      navigator.clipboard.writeText(selectedAtividade.texto_original);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const fetchMateriais = useCallback(() => {
    const params = new URLSearchParams();
    if (statusFilter !== "todos") params.set("status", statusFilter);
    if (busca.trim()) params.set("busca", busca.trim());
    if (turmaFilter) params.set("turma", turmaFilter);

    fetch(`/api/atividades?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMateriais(data);
          setLastRefresh(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
        }
      })
      .catch((err) => console.error("Erro ao buscar atividades:", err))
      .finally(() => setLoading(false));
  }, [statusFilter, busca, turmaFilter]);

  useEffect(() => {
    fetch("/api/turmas")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTurmas(data.map((t: any) => ({ id_turma: t.id_turma, nome: t.nome })));
      })
      .catch(() => setTurmas([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchMateriais();
  }, [refreshKey, fetchMateriais]);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(fetchMateriais, 15000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchMateriais]);

  useEffect(() => {
    const handler = () => {
      setLoading(true);
      fetchMateriais();
    };
    window.addEventListener("nova-atividade", handler);
    return () => window.removeEventListener("nova-atividade", handler);
  }, [fetchMateriais]);

  return (
    <Card className="rounded-2xl border-0 shadow-none bg-white overflow-hidden">
      <CardHeader className="px-4 md:px-6 flex flex-row items-start justify-between space-y-0 border-b border-[#f0f4f9]">
        <div>
          <CardTitle className="text-base font-bold text-[#1e3a5f]">
            Materiais recentes
          </CardTitle>
          <CardDescription className="text-xs text-[#6b7fa3] mt-0.5 flex items-center gap-1.5">
            Últimas adaptações e revisões da sua equipe
            {lastRefresh && (
              <span className="text-[10px] text-slate-400">· Atualizado às {lastRefresh}</span>
            )}
          </CardDescription>
        </div>
        <button
          onClick={() => { setLoading(true); fetchMateriais(); }}
          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-[#2b5784] transition-colors"
          title="Atualizar lista"
        >
          <MdRefresh className={`text-base ${loading ? "animate-spin" : ""}`} />
        </button>
      </CardHeader>

      {/* Filtros */}
      <div className="px-4 md:px-6 py-3 border-b border-[#f0f4f9] flex flex-wrap gap-2 items-center">
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por título..."
          className="flex-1 min-w-[150px] rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none transition focus:border-[#2b5784] focus:bg-white"
        />
        <div className="flex gap-1">
          {[
            { value: "todos", label: "Todos" },
            { value: "pending", label: "Pendentes" },
            { value: "feito", label: "Feitos" },
            { value: "done", label: "Concluídos" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                statusFilter === f.value
                  ? "bg-[#2b5784] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        {turmas.length > 0 && (
          <select
            value={turmaFilter}
            onChange={(e) => setTurmaFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none transition focus:border-[#2b5784]"
          >
            <option value="">Todas as turmas</option>
            {turmas.map((t) => (
              <option key={t.id_turma} value={t.id_turma}>{t.nome}</option>
            ))}
          </select>
        )}
      </div>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[#f0f4f9] hover:bg-transparent">
              <TableHead className="px-4 md:px-6 py-3 text-[10px] font-bold tracking-widest uppercase text-[#9aadca] w-[38%] min-w-[200px]">
                Título
              </TableHead>
              <TableHead className="py-3 text-[10px] font-bold tracking-widest uppercase text-[#9aadca]">
                Status
              </TableHead>
              <TableHead className="py-3 text-[10px] font-bold tracking-widest uppercase text-[#9aadca]">
                Data
              </TableHead>
              <TableHead className="py-3 text-[10px] font-bold tracking-widest uppercase text-[#9aadca]">
                Responsável
              </TableHead>
              <TableHead className="py-3 pr-4 md:pr-6 text-right text-[10px] font-bold tracking-widest uppercase text-[#9aadca]">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-slate-500">
                  Carregando materiais...
                </TableCell>
              </TableRow>
            ) : materiais.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-slate-500">
                  Nenhum material cadastrado ainda.
                </TableCell>
              </TableRow>
            ) : (
              materiais.map((m) => {
                const responsible = m.usuario?.nome || "Usuário Desconhecido";
                const initials = getInitials(responsible);
                const avatarColor = getAvatarColor(responsible);
                
                return (
                  <TableRow
                    key={m.id_atividade}
                    className="border-b border-[#f0f4f9] last:border-0 hover:bg-[#f8fafd] transition-colors"
                  >
                    <TableCell className="px-4 md:px-6 py-4 text-sm text-[#1e3a5f] font-medium leading-snug">
                      <div className="flex items-center gap-2">
                        <span className="truncate">{m.titulo}</span>
                        {m.arquivo_url && (
                          <TooltipProvider delayDuration={200}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="shrink-0">
                                  <MdAttachFile className="text-sm text-[#2563a8]" />
                                </span>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="text-xs">
                                PDF anexado
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        {m.turma && (
                          <span className="shrink-0 text-[10px] font-semibold bg-blue-50 text-blue-700 rounded-full px-2 py-0.5">
                            {m.turma.nome}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <StatusBadge status={m.status} />
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col">
                        <span className="text-xs text-[#6b7fa3] whitespace-nowrap">
                          {new Date(m.criado_em).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </span>
                        {m.data_entrega && (
                          <span className={`text-[10px] font-semibold whitespace-nowrap ${
                            new Date(m.data_entrega) < new Date() && m.status !== "feito" && m.status !== "done"
                              ? "text-red-500"
                              : "text-green-600"
                          }`}>
                            Entrega: {new Date(m.data_entrega).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "short",
                            })}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <UserAvatar
                          initials={initials}
                          color={avatarColor}
                          name={responsible}
                        />
                        <span className="text-xs text-[#3a5070] font-medium">
                          {responsible}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 pr-4 md:pr-6">
                      <div className="flex items-center gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenVisualizar(m)}
                          className="rounded-full border-[#dde5f0] text-[#3a5070] text-xs font-semibold gap-1.5 h-8 px-3 hover:bg-[#f0f4f9] hover:border-[#c8d5e8]"
                        >
                          <MdVisibility className="text-sm" />
                          Visualizar
                        </Button>
                        <Button
                          size="sm"
                          className="rounded-full bg-[#1e3a5f] hover:bg-[#162d4a] text-white text-xs font-semibold gap-1.5 h-8 px-3"
                        >
                          <MdEdit className="text-sm" />
                          Revisar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>

      {/* Modal de Visualização */}
      {selectedAtividade && (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden rounded-2xl border-0 shadow-2xl [&>button:last-child]:hidden">
            <ModalHeader
              icon={<MdArticle className="text-white text-xl" />}
              title="Visualizar Atividade"
              description={selectedAtividade.titulo}
              extraDecorativeCircle
            />
            
            <div className="px-6 py-5 max-h-[60vh] overflow-y-auto bg-slate-50">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold text-slate-700">Texto Original</h3>
                <div className="flex gap-2">
                  {selectedAtividade.arquivo_url && (
                    <button
                      onClick={() => setPdfViewerOpen(true)}
                      className="inline-flex items-center gap-1.5 rounded-full h-8 px-3 text-xs font-semibold border border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors"
                    >
                      <MdPictureAsPdf className="text-sm" />
                      Ver PDF
                    </button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCopy}
                    className="rounded-full h-8 text-xs font-semibold gap-1.5"
                  >
                    {copied ? (
                      <>
                        <MdCheck className="text-green-600" />
                        <span className="text-green-600">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <MdContentCopy />
                        Copiar
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                {selectedAtividade.texto_original}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* PDF Viewer Modal */}
      {selectedAtividade?.arquivo_url && (
        <PdfViewerModal
          open={pdfViewerOpen}
          onOpenChange={setPdfViewerOpen}
          pdfUrl={selectedAtividade.arquivo_url}
          title={selectedAtividade.titulo}
          fileName={selectedAtividade.arquivo_nome || undefined}
        />
      )}
    </Card>
  )
}