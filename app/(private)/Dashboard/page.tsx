"use client";

import {
  MdAdd,
  MdVisibility,
  MdEdit,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import TableContent from "@/components/layout/TableContent";

// ─── Types ───────────────────────────────────────────────────────────────────
type Status = "Não feito" | "Feito";

interface Material {
  id: number;
  title: string;
  status: Status;
  date: string;
  responsible: string;
  initials: string;
  avatarColor: string;
}


const materials: Material[] = [
  {
    id: 1,
    title: "Cap. 4 A Revolução Industrial no Brasil",
    status: "Não feito",
    date: "14 mai 2026",
    responsible: "Marina Rocha",
    initials: "MR",
    avatarColor: "#3b5fa0",
  },
  {
    id: 2,
    title: "Texto: Ecossistemas Aquáticos Brasileiros",
    status: "Não feito",
    date: "14 mai 2026",
    responsible: "Daniel Aoki",
    initials: "DA",
    avatarColor: "#1a6b5a",
  },
  {
    id: 3,
    title: "Funções de 2º Grau Apostila Unidade III",
    status: "Não feito",
    date: "12 mai 2026",
    responsible: "Letícia Brum",
    initials: "LB",
    avatarColor: "#5a3fa0",
  },
  {
    id: 4,
    title: "Romantismo na Literatura Brasileira",
    status: "Feito",
    date: "11 mai 2026",
    responsible: "Marina Rocha",
    initials: "MR",
    avatarColor: "#3b5fa0",
  },
  {
    id: 5,
    title: "Sistema Circulatório — Resumo Pedagógico",
    status: "Feito",
    date: "09 mai 2026",
    responsible: "Pedro Vargas",
    initials: "PV",
    avatarColor: "#a0503b",
  },
];



// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: Status }) {
  const styles: Record<Status, string> = {
    "Não feito": "p-1 bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50",
    "Feito": "p-1 bg-green-50 text-green-700 border-green-200 hover:bg-green-50",
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
  const tituloPag = "Dashboard"
  return (
    <div className="flex h-screen bg-[#f0f4f9] overflow-hidden montserrat">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar tituloPag={tituloPag} />
        <main className="flex-1 overflow-y-auto px-8 py-7 flex flex-col gap-6">
          {/* Welcome banner */}
          <div
            className="bg-[#2b5784] relative rounded-2xl overflow-hidden p-5 flex items-end min-h-[210px]"
          >
            {/* decorative */}
            <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute top-4 right-24 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
            <div className="relative z-10 w-full">
              <h2 className="text-white font-extrabold text-lg tracking-tight mb-1">
                Bem-vindo ao SINA
              </h2>
              <p className="text-white/70 text-sm leading-relaxed max-w-lg mb-2">
                Gerencie conteúdos adaptados e prepare mediações pedagógicas com
                apoio de IA do PDF original ao material em Português L2,
                pronto para o aluno surdo.
              </p>

              <div className="flex gap-3 flex-wrap">
                <Button className="bg-white text-[#1e3a5f] hover:bg-white/90 rounded-full font-bold px-5 gap-1.5">
                  <MdAdd className="text-base" />
                  Novo Material
                </Button>
              </div>
            </div>
          </div>
          {/* Recent materials */}
          <TableContent />
        </main>
      </div>
    </div>
  );
}
