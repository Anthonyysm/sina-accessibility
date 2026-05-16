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

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ─── Types ───────────────────────────────────────────────────────────────────
type Status = "Em revisão" | "Processando" | "Publicado";

interface Material {
  id: number;
  title: string;
  status: Status;
  date: string;
  responsible: string;
  initials: string;
  avatarColor: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────
const stats = [
  {
    icon: MdOutlineInsertDriveFile,
    value: "128",
    label: "Materiais Revisados",
    delta: "+12%",
    iconColor: "#3b82f6",
    iconBg: "#3b82f618",
  },
  {
    icon: MdRefresh,
    value: "7",
    label: "Em Processamento",
    delta: "+2 hoje",
    iconColor: "#f59e0b",
    iconBg: "#f59e0b18",
  },
  {
    icon: MdSend,
    value: "84",
    label: "Publicados",
    delta: "+5 esta semana",
    iconColor: "#10b981",
    iconBg: "#10b98118",
  },
  {
    icon: MdFavoriteBorder,
    value: "36",
    label: "Feedbacks Recebidos",
    delta: "+8%",
    iconColor: "#8b5cf6",
    iconBg: "#8b5cf618",
  },
];

const materials: Material[] = [
  {
    id: 1,
    title: "Cap. 4 — A Revolução Industrial no Brasil",
    status: "Em revisão",
    date: "14 mai 2026",
    responsible: "Marina Rocha",
    initials: "MR",
    avatarColor: "#3b5fa0",
  },
  {
    id: 2,
    title: "Texto: Ecossistemas Aquáticos Brasileiros",
    status: "Processando",
    date: "14 mai 2026",
    responsible: "Daniel Aoki",
    initials: "DA",
    avatarColor: "#1a6b5a",
  },
  {
    id: 3,
    title: "Funções de 2º Grau — Apostila Unidade III",
    status: "Publicado",
    date: "12 mai 2026",
    responsible: "Letícia Brum",
    initials: "LB",
    avatarColor: "#5a3fa0",
  },
  {
    id: 4,
    title: "Romantismo na Literatura Brasileira",
    status: "Em revisão",
    date: "11 mai 2026",
    responsible: "Marina Rocha",
    initials: "MR",
    avatarColor: "#3b5fa0",
  },
  {
    id: 5,
    title: "Sistema Circulatório — Resumo Pedagógico",
    status: "Publicado",
    date: "09 mai 2026",
    responsible: "Pedro Vargas",
    initials: "PV",
    avatarColor: "#a0503b",
  },
];

const navItems = [
  { icon: MdDashboard, label: "Dashboard" },
  { icon: MdAddCircleOutline, label: "Novo Material" },
  { icon: MdRateReview, label: "Revisão (IA)" },
  { icon: MdLibraryBooks, label: "Conteúdos Publicados" },
  { icon: MdPersonOutline, label: "Visão do Aluno" },
];

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: Status }) {
  const styles: Record<Status, string> = {
    "Em revisão":
      "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50",
    Processando: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50",
    Publicado: "bg-green-50 text-green-700 border-green-200 hover:bg-green-50",
  };

  return (
    <Badge
      variant="outline"
      className={`rounded-full text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </Badge>
  );
}

// ─── Avatar with Tooltip ──────────────────────────────────────────────────────
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

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState(0);

  return (
    <div className="flex h-screen bg-[#f0f4f9] overflow-hidden montserrat">

      {/* ── Sidebar ── */}
      <aside className="w-[300px] shrink-0 bg-[#1e3a5f] flex flex-col text-white">

        {/* Brand */}
        <div className="px-6 pt-7 pb-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <MdAccessibility className="text-white text-xl" />
          </div>
          <div>
            <p className="font-bold text-base leading-tight tracking-tight">SINA</p>
            <p className="text-xs text-white/50 mt-0.5">Mediação Pedagógica</p>
          </div>
        </div>

        <Separator className="bg-white/10 mx-4 w-auto" />

        {/* Nav */}
        <nav className="flex-1 px-4 py-5 flex flex-col gap-0.5">
          {navItems.map((item, i) => {
            const Icon = item.icon;
            const isActive = activeNav === i;
            return (
              <Button
                key={item.label}
                variant="ghost"
                onClick={() => setActiveNav(i)}
                className={`w-full justify-start gap-3 px-4 py-2.5 h-auto rounded-xl text-sm font-medium transition-all ${isActive
                    ? "bg-white/15 text-white hover:bg-white/20"
                    : "text-white/55 hover:bg-white/[0.08] hover:text-white/85"
                  }`}
              >
                <Icon className="text-lg shrink-0" />
                {item.label}
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#5db5d8]" />
                )}
              </Button>
            );
          })}
        </nav>

        {/* Plan card */}
        <div className="mx-4 mb-5">
          <Card className="bg-white/[0.08] border-white/10 rounded-xl shadow-none">
            <CardContent className="p-4">
              <p className="text-[10px] font-bold tracking-widest uppercase text-[#5db5d8] mb-1">
                Plano Pro
              </p>
              <p className="text-xs text-white/65 leading-relaxed mb-3">
                12 de 50 materiais adaptados este mês
              </p>
              <Progress
                value={24}
                className="h-1.5 bg-white/15 [&>div]:bg-[#5db5d8]"
              />
            </CardContent>
          </Card>
        </div>

        <Separator className="bg-white/10 mx-4 w-auto" />

        {/* User */}
        <div className="px-5 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#3b5fa0] flex items-center justify-center text-xs font-bold text-white shrink-0">
            MR
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-tight truncate">Marina Rocha</p>
            <p className="text-xs text-white/45 mt-0.5">Intérprete · Libras</p>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <header className="h-16 bg-white border-b border-[#e5eaf2] px-8 flex items-center justify-between shrink-0">
          <h1 className="font-bold text-[#1e3a5f] text-xl tracking-tight">
            Dashboard
          </h1>
          <Button className="bg-[#1e3a5f] hover:bg-[#162d4a] text-white rounded-full px-5 gap-2 font-semibold text-sm">
            <MdAdd className="text-base" />
            Novo Material
          </Button>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto px-8 py-7 flex flex-col gap-6">

          {/* Welcome banner */}
          <div
            className="relative rounded-2xl overflow-hidden p-8 flex items-end min-h-[210px]"
            style={{
              background:
                "linear-gradient(135deg, #1e3a5f 0%, #2563a8 55%, #5db5d8 100%)",
            }}
          >
            {/* decorative */}
            <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute top-4 right-24 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />

            <div className="relative z-10 w-full">
              <Badge
                variant="secondary"
                className="mb-4 bg-white/15 text-white/85 border-0 rounded-full gap-1.5 hover:bg-white/20"
              >
                <MdAccessibility className="text-sm" />
                Painel da Intérprete
              </Badge>

              <h2 className="text-white font-extrabold text-3xl tracking-tight mb-2">
                Bem-vindo ao SINA
              </h2>
              <p className="text-white/70 text-sm leading-relaxed max-w-lg mb-6">
                Gerencie conteúdos adaptados e prepare mediações pedagógicas com
                apoio de IA — do PDF original ao material em Português L2,
                pronto para o aluno surdo.
              </p>

              <div className="flex gap-3 flex-wrap">
                <Button className="bg-white text-[#1e3a5f] hover:bg-white/90 rounded-full font-bold px-5 gap-1.5">
                  <MdAdd className="text-base" />
                  Novo Material
                </Button>
                <Button
                  variant="outline"
                  className="bg-white/15 border-white/30 text-white hover:bg-white/25 hover:text-white rounded-full font-semibold px-5 gap-1.5"
                >
                  Abrir workspace de IA
                  <MdArrowOutward className="text-sm" />
                </Button>
              </div>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={stat.label}
                  className="rounded-2xl border-0 shadow-none bg-white hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-5 flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: stat.iconBg }}
                      >
                        <Icon
                          className="text-xl"
                          style={{ color: stat.iconColor }}
                        />
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
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Recent materials */}
          <Card className="rounded-2xl border-0 shadow-none bg-white">
            <CardHeader className="px-6 pt-5 pb-4 flex flex-row items-start justify-between space-y-0 border-b border-[#f0f4f9]">
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
                    <TableHead className="px-6 py-3 text-[10px] font-bold tracking-widest uppercase text-[#9aadca] w-[38%]">
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
                    <TableHead className="py-3 pr-6 text-right text-[10px] font-bold tracking-widest uppercase text-[#9aadca]">
                      Ações
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {materials.map((m) => (
                    <TableRow
                      key={m.id}
                      className="border-b border-[#f0f4f9] last:border-0 hover:bg-[#f8fafd] transition-colors"
                    >
                      <TableCell className="px-6 py-4 text-sm text-[#1e3a5f] font-medium leading-snug">
                        {m.title}
                      </TableCell>
                      <TableCell className="py-4">
                        <StatusBadge status={m.status} />
                      </TableCell>
                      <TableCell className="py-4 text-xs text-[#6b7fa3] whitespace-nowrap">
                        {m.date}
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <UserAvatar
                            initials={m.initials}
                            color={m.avatarColor}
                            name={m.responsible}
                          />
                          <span className="text-xs text-[#3a5070] font-medium">
                            {m.responsible}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 pr-6">
                        <div className="flex items-center gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
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
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

        </main>
      </div>
    </div>
  );
}
