"use client";

import { useState } from "react";
import {
  MdDashboard,
  MdAddCircleOutline,
  MdRateReview,
  MdLibraryBooks,
  MdPersonOutline,
  MdArrowOutward,
  MdAdd,
  MdOutlineInsertDriveFile,
  MdRefresh,
  MdSend,
  MdFavoriteBorder,
  MdVisibility,
  MdEdit,
  MdAccessibility,
} from "react-icons/md";

// ─── Types ───────────────────────────────────────────────────────────────────
type Status = "Em revisão" | "Processando" | "Publicado";

interface Material {
  id: number;
  title: string;
  status: Status;
  date: string;
  responsible: string;
  initials: string;
  color: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────
const stats = [
  { icon: MdOutlineInsertDriveFile, value: "128", label: "Materiais Revisados", delta: "+12%", color: "#3b82f6" },
  { icon: MdRefresh, value: "7", label: "Em Processamento", delta: "+2 hoje", color: "#f59e0b" },
  { icon: MdSend, value: "84", label: "Publicados", delta: "+5 esta semana", color: "#10b981" },
  { icon: MdFavoriteBorder, value: "36", label: "Feedbacks Recebidos", delta: "+8%", color: "#8b5cf6" },
];

const materials: Material[] = [
  { id: 1, title: "Cap. 4 — A Revolução Industrial no Brasil", status: "Em revisão", date: "14 mai 2026", responsible: "Marina Rocha", initials: "MR", color: "#3b5fa0" },
  { id: 2, title: "Texto: Ecossistemas Aquáticos Brasileiros", status: "Processando", date: "14 mai 2026", responsible: "Daniel Aoki", initials: "DA", color: "#1a6b5a" },
  { id: 3, title: "Funções de 2º Grau — Apostila Unidade III", status: "Publicado", date: "12 mai 2026", responsible: "Letícia Brum", initials: "LB", color: "#5a3fa0" },
  { id: 4, title: "Romantismo na Literatura Brasileira", status: "Em revisão", date: "11 mai 2026", responsible: "Marina Rocha", initials: "MR", color: "#3b5fa0" },
  { id: 5, title: "Sistema Circulatório — Resumo Pedagógico", status: "Publicado", date: "09 mai 2026", responsible: "Pedro Vargas", initials: "PV", color: "#a0503b" },
];

const navItems = [
  { icon: MdDashboard, label: "Dashboard", active: true },
  { icon: MdAddCircleOutline, label: "Novo Material", active: false },
  { icon: MdRateReview, label: "Revisão (IA)", active: false },
  { icon: MdLibraryBooks, label: "Conteúdos Publicados", active: false },
  { icon: MdPersonOutline, label: "Visão do Aluno", active: false },
];

const statusStyles: Record<Status, string> = {
  "Em revisão": "bg-amber-50  text-amber-700  border border-amber-200",
  "Processando": "bg-blue-50   text-blue-700   border border-blue-200",
  "Publicado": "bg-green-50  text-green-700  border border-green-200",
};

// ─── Component ───────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState(0);

  return (
    <div className="flex h-screen bg-[#f0f4f9] font-sans overflow-hidden">

      {/* ── Sidebar ── */}
      <aside className="w-[300px] shrink-0 bg-[#1e3a5f] flex flex-col text-white">

        {/* Brand */}
        <div className="px-6 pt-7 pb-6 flex items-center gap-3 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <MdAccessibility className="text-white text-xl" />
          </div>
          <div>
            <p className="font-bold text-base leading-tight tracking-tight">SINA</p>
            <p className="text-xs text-white/50 leading-tight mt-0.5">Mediação Pedagógica</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
          {navItems.map((item, i) => {
            const Icon = item.icon;
            const isActive = activeNav === i;
            return (
              <button
                key={item.label}
                onClick={() => setActiveNav(i)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 text-left ${isActive
                    ? "bg-white/15 text-white"
                    : "text-white/55 hover:bg-white/8 hover:text-white/85"
                  }`}
              >
                <Icon className="text-lg shrink-0" />
                {item.label}
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#5db5d8]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Plan badge */}
        <div className="mx-4 mb-6 p-4 rounded-xl bg-white/8 border border-white/10">
          <p className="text-[10px] font-bold tracking-widest uppercase text-[#5db5d8] mb-1">
            Plano Pro
          </p>
          <p className="text-xs text-white/70 leading-relaxed mb-3">
            12 de 50 materiais adaptados este mês
          </p>
          <div className="h-1.5 rounded-full bg-white/15 overflow-hidden">
            <div className="h-full w-[24%] rounded-full bg-[#5db5d8]" />
          </div>
        </div>

        {/* User */}
        <div className="px-4 pb-5 flex items-center gap-3 border-t border-white/10 pt-4">
          <div className="w-9 h-9 rounded-full bg-[#3b5fa0] flex items-center justify-center text-xs font-bold shrink-0">
            MR
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-tight truncate">Marina Rocha</p>
            <p className="text-xs text-white/45 leading-tight mt-0.5">Intérprete · Libras</p>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <header className="h-16 bg-white border-b border-[#e5eaf2] px-8 flex items-center justify-between shrink-0">
          <h1 className="font-bold text-[#1e3a5f] text-xl tracking-tight">Dashboard</h1>
          <button className="flex items-center gap-2 bg-[#1e3a5f] hover:bg-[#162d4a] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors">
            <MdAdd className="text-base" />
            Novo Material
          </button>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto px-8 py-7 flex flex-col gap-6">

          {/* Welcome banner */}
          <div className="relative rounded-2xl overflow-hidden min-h-[220px] flex items-end p-8"
            style={{
              background: "linear-gradient(135deg, #1e3a5f 0%, #2563a8 55%, #5db5d8 100%)",
            }}
          >
            {/* decorative circles */}
            <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-white/5" />
            <div className="absolute top-4 right-24 w-32 h-32 rounded-full bg-white/5" />

            <div className="relative z-10 w-full">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white/80 bg-white/15 rounded-full px-3 py-1 mb-4">
                <MdAccessibility className="text-sm" />
                Painel da Intérprete
              </span>
              <h2 className="text-white font-extrabold text-3xl tracking-tight mb-2">
                Bem-vindo ao SINA
              </h2>
              <p className="text-white/70 text-sm leading-relaxed max-w-lg mb-6">
                Gerencie conteúdos adaptados e prepare mediações pedagógicas com apoio
                de IA — do PDF original ao material em Português L2, pronto para o aluno surdo.
              </p>
              <div className="flex gap-3 flex-wrap">
                <button className="flex items-center gap-2 bg-white text-[#1e3a5f] text-sm font-bold px-5 py-2.5 rounded-full hover:bg-white/90 transition-colors">
                  <MdAdd className="text-base" />
                  Novo Material
                </button>
                <button className="flex items-center gap-2 bg-white/15 border border-white/30 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-white/25 transition-colors">
                  Abrir workspace de IA
                  <MdArrowOutward className="text-sm" />
                </button>
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="bg-white rounded-2xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: stat.color + "18" }}
                    >
                      <Icon style={{ color: stat.color }} className="text-xl" />
                    </div>
                    <span className="text-xs font-semibold text-green-600">
                      {stat.delta}
                    </span>
                  </div>
                  <div>
                    <p className="font-extrabold text-[#1e3a5f] text-3xl tracking-tight leading-none mb-1">
                      {stat.value}
                    </p>
                    <p className="text-xs text-[#6b7fa3]">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent materials */}
          <div className="bg-white rounded-2xl overflow-hidden">
            <div className="px-6 pt-5 pb-4 flex items-start justify-between border-b border-[#f0f4f9]">
              <div>
                <h3 className="font-bold text-[#1e3a5f] text-base">Materiais recentes</h3>
                <p className="text-xs text-[#6b7fa3] mt-0.5">Últimas adaptações e revisões da sua equipe</p>
              </div>
              <button className="text-xs font-semibold text-[#2563a8] hover:underline">
                Ver todos
              </button>
            </div>

            {/* Table header */}
            <div className="grid grid-cols-[2fr_120px_100px_160px_140px] px-6 py-3 text-[10px] font-bold tracking-widest uppercase text-[#9aadca] border-b border-[#f0f4f9]">
              <span>Título</span>
              <span>Status</span>
              <span>Data</span>
              <span>Responsável</span>
              <span className="text-right">Ações</span>
            </div>

            {/* Rows */}
            {materials.map((m, i) => (
              <div
                key={m.id}
                className={`grid grid-cols-[2fr_120px_100px_160px_140px] px-6 py-4 items-center hover:bg-[#f8fafd] transition-colors ${i < materials.length - 1 ? "border-b border-[#f0f4f9]" : ""
                  }`}
              >
                <span className="text-sm text-[#1e3a5f] font-medium pr-4 leading-snug">
                  {m.title}
                </span>
                <span>
                  <span className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusStyles[m.status]}`}>
                    {m.status}
                  </span>
                </span>
                <span className="text-xs text-[#6b7fa3]">{m.date}</span>
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                    style={{ background: m.color }}
                  >
                    {m.initials}
                  </div>
                  <span className="text-xs text-[#3a5070] font-medium">{m.responsible}</span>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <button className="flex items-center gap-1.5 text-xs font-semibold text-[#3a5070] border border-[#dde5f0] rounded-full px-3 py-1.5 hover:bg-[#f0f4f9] transition-colors">
                    <MdVisibility className="text-sm" />
                    Visualizar
                  </button>
                  <button className="flex items-center gap-1.5 text-xs font-semibold text-white bg-[#1e3a5f] rounded-full px-3 py-1.5 hover:bg-[#162d4a] transition-colors">
                    <MdEdit className="text-sm" />
                    Revisar
                  </button>
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}
