"use client";

import { useEffect, useState } from "react";
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
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
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
} from "react-icons/md";

type Status = "pending" | "done" | string; // Baseado no schema

interface Atividade {
  id_atividade: number;
  titulo: string;
  texto_original: string;
  texto_adaptado: string | null;
  status: string;
  criado_em: string;
  arquivo_url: string | null;
  arquivo_nome: string | null;
  usuario: {
    nome: string;
  };
}

// Helpers para cor do avatar
const cores = ["#3b5fa0", "#1a6b5a", "#5a3fa0", "#a0503b", "#b26f20"];
function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return cores[Math.abs(hash) % cores.length];
}

function getInitials(name: string) {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return (name[0] || "?").toUpperCase();
}


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

export default function TableContent() {
  const [materiais, setMateriais] = useState<Atividade[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados do Modal de Visualização
  const [selectedAtividade, setSelectedAtividade] = useState<Atividade | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

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

  useEffect(() => {
    fetch("/api/atividades")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMateriais(data);
        }
      })
      .catch((err) => console.error("Erro ao buscar atividades:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card className="rounded-2xl border-0 shadow-none bg-white overflow-hidden">
      <CardHeader className="px-4 md:px-6 flex flex-row items-start justify-between space-y-0 border-b border-[#f0f4f9]">
        <div>
          <CardTitle className="text-base font-bold text-[#1e3a5f]">
            Materiais recentes
          </CardTitle>
          <CardDescription className="text-xs text-[#6b7fa3] mt-0.5">
            Últimas adaptações e revisões da sua equipe
          </CardDescription>
        </div>
        <Button
          variant="link"
          className="text-xs font-semibold text-[#2563a8] p-0 h-auto hover:no-underline hover:text-[#1e3a5f]"
        >
          Ver todos
        </Button>
      </CardHeader>

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
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <StatusBadge status={m.status} />
                    </TableCell>
                    <TableCell className="py-4 text-xs text-[#6b7fa3] whitespace-nowrap">
                      {new Date(m.criado_em).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
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
            <div className="bg-[#2b5784] px-6 pt-5 pb-5 relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />
              <div className="absolute top-2 right-20 w-20 h-20 rounded-full bg-white/5 pointer-events-none" />

              <DialogClose
                className="absolute right-4 top-4 z-20 rounded-lg p-1 text-white/70 transition-colors hover:bg-white/20 hover:text-white focus:outline-none"
                aria-label="Fechar"
              >
                <MdClose className="text-xl" />
              </DialogClose>

              <DialogHeader className="relative z-10 pr-8">
                <div className="flex items-center gap-3 mb-1">
                  <div className="bg-white/20 rounded-xl p-2">
                    <MdArticle className="text-white text-xl" />
                  </div>
                  <DialogTitle className="text-white font-bold text-lg leading-tight">
                    Visualizar Atividade
                  </DialogTitle>
                </div>
                <DialogDescription className="text-white/70 text-sm">
                  {selectedAtividade.titulo}
                </DialogDescription>
              </DialogHeader>
            </div>
            
            <div className="px-6 py-5 max-h-[60vh] overflow-y-auto bg-slate-50">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold text-slate-700">Texto Original</h3>
                <div className="flex gap-2">
                  {selectedAtividade.arquivo_url && (
                    <a
                      href={selectedAtividade.arquivo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full h-8 px-3 text-xs font-semibold border border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors"
                    >
                      <MdAttachFile className="text-sm" />
                      Abrir PDF
                    </a>
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
    </Card>
  )
}