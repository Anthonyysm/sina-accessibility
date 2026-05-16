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
} from "react-icons/md";

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

  return (
    <Card className="rounded-2xl border-0 shadow-none bg-white">
      <CardHeader className="px-6 flex flex-row items-start justify-between space-y-0 border-b border-[#f0f4f9]">
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
  )
}