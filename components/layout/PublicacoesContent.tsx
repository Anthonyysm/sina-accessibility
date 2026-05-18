"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MdSearch, MdVisibility, MdEdit, MdArticle } from "react-icons/md";

interface Atividade {
  id_atividade: number;
  titulo: string;
  texto_original: string;
  texto_adaptado: string | null;
  status: string;
  criado_em: string;
  usuario: { nome: string };
}

type FilterStatus = "todos" | "feito" | "nao_feito";

const AVATAR_COLORS = ["#3b5fa0", "#1a6b5a", "#5a3fa0", "#a0503b", "#b26f20"];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name: string) {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return (name[0] || "?").toUpperCase();
}

const FILTER_OPTIONS: { value: FilterStatus; label: string }[] = [
  { value: "todos",    label: "Todos"     },
  { value: "nao_feito", label: "Não feito" },
  { value: "feito",    label: "Feito"     },
];

export default function PublicacoesContent({ refreshKey = 0 }: { refreshKey?: number }) {
  const [materiais, setMateriais] = useState<Atividade[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<FilterStatus>("todos");

  useEffect(() => {
    setLoading(true);
    fetch("/api/atividades")
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setMateriais(data); })
      .catch((err) => console.error("Erro ao buscar atividades:", err))
      .finally(() => setLoading(false));
  }, [refreshKey]);

  const filtrados = materiais.filter((m) => {
    const isDone = ["feito", "done"].includes(m.status.toLowerCase());
    const matchBusca = m.titulo.toLowerCase().includes(busca.toLowerCase());
    const matchStatus =
      filtroStatus === "todos" ||
      (filtroStatus === "feito" && isDone) ||
      (filtroStatus === "nao_feito" && !isDone);
    return matchBusca && matchStatus;
  });

  return (
    <div className="flex flex-col gap-5">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aadca] text-lg pointer-events-none" />
          <Input
            placeholder="Buscar por título..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-9 h-10 rounded-xl border-[#dde5f0] text-[#1e3a5f] placeholder:text-[#9aadca] focus-visible:ring-[#5db5d8]"
          />
        </div>
        <div className="flex gap-2 shrink-0">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFiltroStatus(opt.value)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                filtroStatus === opt.value
                  ? "bg-[#1e3a5f] text-white shadow-sm"
                  : "bg-white text-[#6b7fa3] border border-[#dde5f0] hover:border-[#c8d5e8] hover:text-[#1e3a5f]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contagem */}
      {!loading && (
        <p className="text-xs text-[#9aadca] -mt-2">
          {filtrados.length} {filtrados.length === 1 ? "publicação" : "publicações"} encontradas
        </p>
      )}

      {/* Conteúdo */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400 text-sm">
          Carregando publicações...
        </div>
      ) : filtrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
          <MdArticle className="text-5xl opacity-20" />
          <p className="text-sm">
            {busca || filtroStatus !== "todos"
              ? "Nenhum resultado para este filtro."
              : "Nenhuma publicação cadastrada ainda."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtrados.map((m) => {
            const isDone = ["feito", "done"].includes(m.status.toLowerCase());
            const responsible = m.usuario?.nome || "Usuário Desconhecido";
            const excerpt = m.texto_original?.slice(0, 130);
            const hasMore = (m.texto_original?.length ?? 0) > 130;
            const avatarColor = getAvatarColor(responsible);

            return (
              <div
                key={m.id_atividade}
                className="bg-white rounded-2xl p-5 flex flex-col gap-3 border border-[#f0f4f9] hover:border-[#c8d5e8] hover:shadow-md transition-all duration-200"
              >
                {/* Cabeçalho */}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-[#1e3a5f] leading-snug line-clamp-2 flex-1">
                    {m.titulo}
                  </h3>
                  <Badge
                    variant="outline"
                    className={`shrink-0 rounded-full text-xs font-semibold ${
                      isDone
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {isDone ? "Feito" : "Não feito"}
                  </Badge>
                </div>

                {/* Trecho do texto */}
                <p className="text-xs text-[#6b7fa3] leading-relaxed line-clamp-3">
                  {excerpt}{hasMore ? "…" : ""}
                </p>

                {/* Rodapé */}
                <div className="mt-auto pt-3 border-t border-[#f0f4f9] flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                      style={{ backgroundColor: avatarColor }}
                    >
                      {getInitials(responsible)}
                    </div>
                    <span className="text-xs text-[#6b7fa3] truncate">{responsible}</span>
                  </div>
                  <span className="text-xs text-[#9aadca] shrink-0">
                    {new Date(m.criado_em).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </span>
                </div>

                {/* Ações */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-xl border-[#dde5f0] text-[#3a5070] text-xs font-semibold gap-1.5 h-8 hover:bg-[#f0f4f9]"
                  >
                    <MdVisibility className="text-sm" />
                    Ver
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 rounded-xl bg-[#1e3a5f] hover:bg-[#162d4a] text-white text-xs font-semibold gap-1.5 h-8"
                  >
                    <MdEdit className="text-sm" />
                    Revisar
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}